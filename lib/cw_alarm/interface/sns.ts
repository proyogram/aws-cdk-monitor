import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_sub from 'aws-cdk-lib/aws-sns-subscriptions';

export interface SnsTopicProps extends sns.TopicProps {
  topicName: string;
}

export interface SnsSubscriptionProps {
  emailAddresses: string[];
  props?: sns_sub.EmailSubscriptionProps;
}

export interface SnsProps {
  topicProps: SnsTopicProps;
  subscriptionProps: SnsSubscriptionProps;
}
