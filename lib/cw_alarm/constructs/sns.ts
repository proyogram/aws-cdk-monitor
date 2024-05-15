import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { SnsProps } from '../interface';

export class SnsConstruct extends Construct {
  public alarmTopic: sns.Topic;
  constructor(scope: Construct, id: string, snsProps: SnsProps) {
    super(scope, id);

    const alarmTopicProps = snsProps.topicProps;
    const emailAddresses = snsProps.subscriptionProps.emailAddresses;

    // Create SNS topic
    const alarmTopic = new sns.Topic(this, 'Topic', alarmTopicProps);
    // Add SNS subscriptions to alarmTopic
    for (const emailAddress of emailAddresses) {
      alarmTopic.addSubscription(new EmailSubscription(emailAddress, snsProps.subscriptionProps.props));
    }
    // Allow alarmTopic to be used by CloudWatch
    alarmTopic.grantPublish(new iam.ServicePrincipal('cloudwatch.amazonaws.com'));

    this.alarmTopic = alarmTopic;
  }
}
