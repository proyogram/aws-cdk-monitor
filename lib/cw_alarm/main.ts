import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SnsConstruct } from "./constructs/sns";
import { CwConstruct } from "./constructs/cw";

export class CwAlarmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sns = new SnsConstruct(this, "SnsConstruct");
    const cw = new CwConstruct(this, "CwConstruct", sns.alarmTopic);
  }
}
