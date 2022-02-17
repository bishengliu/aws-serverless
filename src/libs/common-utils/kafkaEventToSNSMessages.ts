import { KafkaEvent } from "@libs/types/kafka.types";
import { SNSBatchMessages, SNSMessageEntry, SNSMessage } from "@libs/aws-utils";

const kafkaEventToSNSBatchMessages = (
  event: KafkaEvent
): SNSBatchMessages[] => {
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

  const batches: SNSBatchMessages[] = [];

  // SNS only allows send batch requests with 10 message each time

  while (messages.length >= 10) {
    batches.push({
      TopicArn,
      Messages: messages.splice(0, 10),
    } as SNSBatchMessages);
  }

  if (messages.length > 0) {
    batches.push({
      TopicArn,
      Messages: messages.splice(0),
    });
  }

  return batches;
};

const kafkaEventToSNSMessages = (event: KafkaEvent): SNSMessage[] => {
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
