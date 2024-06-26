import { SnsProps } from '../interface';

export const snsProps: SnsProps = {
  topicProps: {
    topicName: 'cw-alarm-topic',
  },
  subscriptionProps: {
    emailAddresses: ['aaa@gmail.com', 'bbb@gmail.com'],
  },
};
