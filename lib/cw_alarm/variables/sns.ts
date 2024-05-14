import { SnsForCwAlarmProps } from "../interface/sns";

export const snsForCwAlarmProps: SnsForCwAlarmProps = {
  topicProps: {
    topicName: "cw-alarm-topic",
  },
  subscriptionProps: {
    emailAddresses: ["aaa@gmai.com", "bbb@gmai.com"],
  },
};
