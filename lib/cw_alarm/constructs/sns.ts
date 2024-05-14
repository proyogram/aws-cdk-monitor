import { Construct } from "constructs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as iam from "aws-cdk-lib/aws-iam";
import { EmailSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { snsForCwAlarmProps } from "../variables/sns";

export class SnsConstruct extends Construct {
  public alarmTopic: sns.Topic;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const alarmTopicProps = snsForCwAlarmProps.topicProps;
    const emailAddresses = snsForCwAlarmProps.subscriptionProps.emailAddresses;

    // Create SNS topic
    const alarmTopic = new sns.Topic(this, "Topic", alarmTopicProps);
    // Add SNS subscriptions to alarmTopic
    for (const emailAddress of emailAddresses) {
      alarmTopic.addSubscription(
        new EmailSubscription(
          emailAddress,
          snsForCwAlarmProps.subscriptionProps.props,
        ),
      );
    }
    // Allow alarmTopic to be used by CloudWatch
    alarmTopic.grantPublish(
      new iam.ServicePrincipal("cloudwatch.amazonaws.com"),
    );

    this.alarmTopic = alarmTopic;
  }
}
