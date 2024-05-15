import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as cw_actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import { CwAlarmMetricsProps } from '../interface';
import { defineComparisonOperatorFromString, defineTreatMissingDataFromString } from '../utils/utils';

export class CwConstruct extends Construct {
  constructor(scope: Construct, id: string, cwProps: Array<CwAlarmMetricsProps>, alarmTopic: sns.Topic) {
    super(scope, id);

    // Create Metrics and Alarm Props
    const alarmPropsList = new CreateAlarmPropsMetricsConstruct(this, 'CreateAlarmPropsMetricsConstruct', cwProps).alarmPropsList;

    // Create Alarms
    for (const alarmProps of alarmPropsList) {
      const alarmId = 'CwAlarm0' + alarmPropsList.indexOf(alarmProps);
      const alarm = new cw.Alarm(this, alarmId, alarmProps);
      alarm.addAlarmAction(new cw_actions.SnsAction(alarmTopic));
    }
  }
}

// Create Metrics and Alarm Props
export class CreateAlarmPropsMetricsConstruct extends Construct {
  public readonly alarmPropsList: Array<cw.AlarmProps>;
  constructor(scope: Construct, id: string, cwProps: Array<CwAlarmMetricsProps>) {
    super(scope, id);

    const createdAlarmPropsList: Array<cw.AlarmProps> = [];

    for (const cwAlarmMetricsProps of cwProps) {
      if (cwAlarmMetricsProps.dimensionsMapList !== undefined) {
        for (const dimensionsMap of cwAlarmMetricsProps.dimensionsMapList) {
          const metricIdFirst =
            'CreateMetricsConstructFirst0' + cwProps.indexOf(cwAlarmMetricsProps) + cwAlarmMetricsProps.dimensionsMapList.indexOf(dimensionsMap);
          const createdAlarmProps = new CreateMetricsConstruct(this, metricIdFirst, cwAlarmMetricsProps, dimensionsMap).createdAlarmProps;
          createdAlarmPropsList.push(createdAlarmProps);
        }
      } else {
        const metricIdSecond = 'CreateMetricsConstructSecond0' + cwProps.indexOf(cwAlarmMetricsProps);
        const createdAlarmProps = new CreateMetricsConstruct(this, metricIdSecond, cwAlarmMetricsProps).createdAlarmProps;
        createdAlarmPropsList.push(createdAlarmProps);
      }
    }

    this.alarmPropsList = createdAlarmPropsList;
  }
}

// Create Metrics
export class CreateMetricsConstruct extends Construct {
  public readonly createdAlarmProps: cw.AlarmProps;
  constructor(scope: Construct, id: string, cwAlarmMetricsProps: CwAlarmMetricsProps, dimensionsMap?: { [key: string]: any }) {
    super(scope, id);

    const usingMetrics: { [key: string]: cw.IMetric } = {};
    const createdMetricList: Array<cw.IMetric> = [];
    let createdMetric: cw.IMetric;

    // Create Metrics
    for (const metricProps of cwAlarmMetricsProps.metricPropsList) {
      // Error when you use both dimensionsMapList and dimensionMap in metricPrps
      if (dimensionsMap !== undefined && metricProps.dimensionsMap !== undefined) {
        throw new Error(`Cannot use both dimensionsMapList and dimensionMap in metricProps!`);
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
    if (cwAlarmMetricsProps.MathExpressionProps !== undefined) {
      // When MathMetric
      createdMetric = new cw.MathExpression({
        expression: cwAlarmMetricsProps.MathExpressionProps.expressionByMetrics.toLowerCase(),
        period: cdk.Duration.seconds(cwAlarmMetricsProps.MathExpressionProps.periodSeconds),
        usingMetrics: usingMetrics,
        ...cwAlarmMetricsProps.MathExpressionProps,
      });
    } else {
      {
        // When not MathMetric
        createdMetric = createdMetricList[0];
      }
    }

    // Change type from String to cloudwatch.ComparisonOperator
    if (cwAlarmMetricsProps.alarmProps.comparisonOperatorString !== undefined) {
      cwAlarmMetricsProps.alarmProps.comparisonOperator = defineComparisonOperatorFromString(cwAlarmMetricsProps.alarmProps.comparisonOperatorString);
    }
    // Change type from String to cloudwatch.TreatMissingData
    if (cwAlarmMetricsProps.alarmProps.treatMissingDataString !== undefined) {
      cwAlarmMetricsProps.alarmProps.treatMissingData = defineTreatMissingDataFromString(cwAlarmMetricsProps.alarmProps.treatMissingDataString);
    }

    // Define AlarmName
    let alarmName: string = cwAlarmMetricsProps.alarmProps.alarmNamePrefix;
    if (dimensionsMap !== undefined) {
      for (const dimension of Object.values(dimensionsMap)) {
        alarmName += '-' + dimension;
      }
    }

    // Create CloudWatch Alarm Props
    const createdAlarmProps: cw.AlarmProps = {
      metric: createdMetric,
      alarmName: alarmName,
      ...cwAlarmMetricsProps.alarmProps,
    };

    this.createdAlarmProps = createdAlarmProps;
  }
}
