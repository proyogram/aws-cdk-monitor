import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import * as cw_actions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";
import { cwPropsList } from "../variables/cw";
import { CwProps } from "../interface/cw";
import {
  defineComparisonOperatorFromString,
  defineTreatMissingDataFromString,
} from "../utils/utils";

export class CwConstruct extends Construct {
  constructor(scope: Construct, id: string, alarmTopic: sns.Topic) {
    super(scope, id);

    // Create Metrics and Alarm Props
    const alarmPropsList = new CreateMetricsAndAlarmPropsConstruct(
      this,
      "CreateMetricsAndAlarmPropsConstruct",
    ).alarmPropsList;

    // Create Alarms
    for (const alarmProps of alarmPropsList) {
      const alarmId = "CwAlarm0" + alarmPropsList.indexOf(alarmProps);
      const alarm = new cw.Alarm(this, alarmId, alarmProps);
      alarm.addAlarmAction(new cw_actions.SnsAction(alarmTopic));
    }
  }
}

// Create Metrics and Alarm Props
export class CreateMetricsAndAlarmPropsConstruct extends Construct {
  public readonly alarmPropsList: Array<cw.AlarmProps>;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const createdAlarmPropsList: Array<cw.AlarmProps> = [];

    for (const cwProps of cwPropsList) {
      if (cwProps.dimensionsMapList !== undefined) {
        for (const dimensionsMap of cwProps.dimensionsMapList) {
          const metricIdFirst =
            "CreateMetricsConstructFirst0" +
            cwPropsList.indexOf(cwProps) +
            cwProps.dimensionsMapList.indexOf(dimensionsMap);
          const createdAlarmProps = new CreateMetricsConstruct(
            this,
            metricIdFirst,
            cwProps,
            dimensionsMap,
          ).createdAlarmProps;
          createdAlarmPropsList.push(createdAlarmProps);
        }
      } else {
        const metricIdSecond =
          "CreateMetricsConstructSecond0" + cwPropsList.indexOf(cwProps);
        const createdAlarmProps = new CreateMetricsConstruct(
          this,
          metricIdSecond,
          cwProps,
        ).createdAlarmProps;
        createdAlarmPropsList.push(createdAlarmProps);
      }
    }

    this.alarmPropsList = createdAlarmPropsList;
  }
}

// Create Metrics
export class CreateMetricsConstruct extends Construct {
  public readonly createdAlarmProps: cw.AlarmProps;
  constructor(
    scope: Construct,
    id: string,
    cwProps: CwProps,
    dimensionsMap?: { [key: string]: any },
  ) {
    super(scope, id);

    const usingMetrics: { [key: string]: cw.IMetric } = {};
    const createdMetricList: Array<cw.IMetric> = [];
    let createdMetric: cw.IMetric;

    // Create Metrics
    for (const metricProps of cwProps.metricPropsList) {
      // Error when you use both dimensionsMapList and dimensionMap in metricPrps
      if (
        dimensionsMap !== undefined &&
        metricProps.dimensionsMap !== undefined
      ) {
        throw new Error(
          `Cannot use both dimensionsMapList and dimensionMap in metricProps!`,
        );
      }

      // Create Metric
      const metric = new cw.Metric({
        period: cdk.Duration.seconds(metricProps.periodSeconds),
        dimensionsMap: dimensionsMap,
        ...metricProps,
      });

      // Create usingMetric
      if (metricProps.metricId !== undefined) {
        usingMetrics[metricProps.metricId] = metric;
      }

      createdMetricList.push(metric);
    }

    // Check MathMetric
    if (cwProps.MathExpressionProps !== undefined) {
      // When MathMetric
      createdMetric = new cw.MathExpression({
        expression:
          cwProps.MathExpressionProps.expressionByMetrics.toLowerCase(),
        period: cdk.Duration.seconds(cwProps.MathExpressionProps.periodSeconds),
        usingMetrics: usingMetrics,
        ...cwProps.MathExpressionProps,
      });
    } else {
      {
        // When not MathMetric
        createdMetric = createdMetricList[0];
      }
    }

    // Change type from String to cloudwatch.ComparisonOperator
    if (cwProps.alarmProps.comparisonOperatorString !== undefined) {
      cwProps.alarmProps.comparisonOperator =
        defineComparisonOperatorFromString(
          cwProps.alarmProps.comparisonOperatorString,
        );
    }
    // Change type from String to cloudwatch.TreatMissingData
    if (cwProps.alarmProps.treatMissingDataString !== undefined) {
      cwProps.alarmProps.treatMissingData = defineTreatMissingDataFromString(
        cwProps.alarmProps.treatMissingDataString,
      );
    }

    // Define AlarmName
    let alarmName: string = cwProps.alarmProps.alarmNamePrefix;
    if (dimensionsMap !== undefined) {
      for (const dimension of Object.values(dimensionsMap)) {
        alarmName += "-" + dimension;
      }
    }

    // Create CloudWatch Alarm Props
    const createdAlarmProps: cw.AlarmProps = {
      metric: createdMetric,
      alarmName: alarmName,
      ...cwProps.alarmProps,
    };

    this.createdAlarmProps = createdAlarmProps;
  }
}
