import { CwAlarmMetricsProps } from '../interface';

export const cwProps: Array<CwAlarmMetricsProps> = [
  {
    dimensionsMapList: [
      {
        InstanceId: 'INSTANCEID_01',
      },
      {
        InstanceId: 'INSTANCEID_02',
      },
    ],
    metricPropsList: [
      {
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
        periodSeconds: 300,
        statistic: 'Average',
      },
    ],
    alarmProps: {
      alarmNamePrefix: 'EC2-CPUUtilization',
      threshold: 80,
      evaluationPeriods: 1,
      comparisonOperatorString: 'GREATER_OR_EQUAL',
      treatMissingDataString: 'IGNORE',
    },
  },
  {
    dimensionsMapList: [
      {
        InstanceId: 'INSTANCEID_01',
        device: 'DEVICE_NAME_01',
      },
      {
        InstanceId: 'INSTANCEID_01',
        device: 'DEVICE_NAME_02',
      },
      {
        InstanceId: 'INSTANCEID_02',
        device: 'DEVICE_NAME_01',
      },
      {
        InstanceId: 'INSTANCEID_02',
        device: 'DEVICE_NAME_02',
      },
    ],
    metricPropsList: [
      {
        namespace: 'CWAgent',
        metricName: 'disk_used_percent',
        periodSeconds: 300,
        statistic: 'Average',
      },
    ],
    alarmProps: {
      alarmNamePrefix: 'EC2-DiskUtilization',
      threshold: 80,
      evaluationPeriods: 1,
      comparisonOperatorString: 'GREATER_OR_EQUAL',
      treatMissingDataString: 'IGNORE',
    },
  },
  {
    dimensionsMapList: [
      {
        TableName: 'DynamoDB_01',
      },
      {
        TableName: 'DynamoDB_02',
      },
    ],
    metricPropsList: [
      {
        metricId: 'm1',
        namespace: 'AWS/DynamoDB',
        metricName: 'ConsumedReadCapacityUnits',
        periodSeconds: 300,
        statistic: 'Average',
      },
      {
        metricId: 'm2',
        namespace: 'AWS/DynamoDB',
        metricName: 'ProvisionedReadCapacityUnits',
        periodSeconds: 300,
        statistic: 'Average',
      },
    ],
    MathExpressionProps: {
      expressionByMetrics: '(m1/m2)*100',
      periodSeconds: 300,
    },
    alarmProps: {
      alarmNamePrefix: 'DynamoDB-ReadCapacityUtilization',
      threshold: 80,
      evaluationPeriods: 1,
      comparisonOperatorString: 'GREATER_OR_EQUAL',
    },
  },
  {
    metricPropsList: [
      {
        metricId: 'm1',
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
        periodSeconds: 300,
        statistic: 'Average',
        dimensionsMap: {
          InstanceId: 'INSTANCEID_01',
        },
      },
      {
        metricId: 'm2',
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
        periodSeconds: 300,
        statistic: 'Average',
        dimensionsMap: {
          InstanceId: 'INSTANCEID_02',
        },
      },
    ],
    MathExpressionProps: {
      expressionByMetrics: '(m1+m2)/2',
      periodSeconds: 300,
    },
    alarmProps: {
      alarmNamePrefix: 'EC2-Average_CPUUtilization-INSTANCEID_01_AND_INSTANCEID_02',
      threshold: 80,
      evaluationPeriods: 1,
      comparisonOperatorString: 'GREATER_OR_EQUAL',
    },
  },
];
