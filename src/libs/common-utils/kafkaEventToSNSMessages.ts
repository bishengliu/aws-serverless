import { KafkaEvent } from "@libs/types/kafka.types";
import { SNSBatchMessages, SNSMessageEntry, SNSMessage } from "@libs/aws-utils";

const kafkaEventToSNSBatchMessages = (event: KafkaEvent) => {
  const MessageGroupId = process.env.MESSAGE_GROUP_ID;
  const TopicArn = process.env.SNS_TOPIC_ARN;

  const messages: SNSMessageEntry[] = [];

  const recordGroups = Object.entries(event.records);
  for (const [_, groupRecords] of recordGroups) {
    for (const record of groupRecords) {
      messages.push({
        Id: record.offset + "-" + record.timestamp,
        MessageGroupId,
        MessageDeduplicationId:
          record.topic + "-" + record.partition + "-" + record.offset,
        Message: JSON.stringify(record),
      } as SNSMessageEntry);
    }
  }
  const batchMessages: SNSBatchMessages = {
    TopicArn: TopicArn,
    Messages: messages,
  };

  return batchMessages;
};

const kafkaEventToSNSMessages = (event: KafkaEvent) => {
  const MessageGroupId = process.env.MESSAGE_GROUP_ID;
  const TopicArn = process.env.SNS_TOPIC_ARN;

  const messages: SNSMessage[] = [];

  const recordGroups = Object.entries(event.records);
  for (const [_, groupRecords] of recordGroups) {
    for (const record of groupRecords) {
      messages.push({
        MessageGroupId,
        MessageDeduplicationId:
          record.topic + "-" + record.partition + "-" + record.offset,
        Message: JSON.stringify(record),
        TopicArn,
      } as SNSMessage);
    }
  }
  return messages;
};

export { kafkaEventToSNSBatchMessages, kafkaEventToSNSMessages };
