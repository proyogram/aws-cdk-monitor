import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SnsConstruct, CwConstruct } from "./constructs";
import { snsProps, cwProps } from "./parameters";

export class CwAlarmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sns = new SnsConstruct(this, "SnsConstruct", snsProps);
    const cw = new CwConstruct(this, "CwConstruct", cwProps, sns.alarmTopic);
  }
}
