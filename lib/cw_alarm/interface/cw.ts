import * as cw from "aws-cdk-lib/aws-cloudwatch";

export interface MetricProps extends cw.MetricProps {
  namespace: string;
  metricName: string;
  periodSeconds: number;
  metricId?: string;
  dimensionsMap?: { [key: string]: any };
}

export interface MathExpressionProps {
  expressionByMetrics: string;
  periodSeconds: number;
  color?: string;
  label?: string;
  searchAccount?: string;
  searchRegion?: string;
  warnings?: string[];
  warningsV2?: { [key: string]: any };
}

export interface AlarmProps {
  alarmNamePrefix: string;
  threshold: number;
  evaluationPeriods: number;
  actionsEnabled?: boolean;
  alarmDescription?: string;
  datapointsToAlarm?: number;
  evaluateLowSampleCountPercentile?: string;
  comparisonOperator?: cw.ComparisonOperator;
  comparisonOperatorString?:
    | "GREATER_OR_EQUAL"
    | "GREATER"
    | "LESS_OR_EQUAL"
    | "LESS"
    | "LESS_LOWER_OR_GREATER_UPPER"
    | "GREATER_UPPER"
    | "LESS_LOWER";
  treatMissingData?: cw.TreatMissingData;
  treatMissingDataString?: "BREACHING" | "NOT_BREACHING" | "IGNORE" | "MISSING";
}

export interface CwAlarmMetricsProps {
  alarmProps: AlarmProps;
  metricPropsList: Array<MetricProps>;
  dimensionsMapList?: Array<{ [key: string]: any }>;
  MathExpressionProps?: MathExpressionProps;
}
