import { KafkaEvent } from "@libs/types/kafka.types";
import middy from "@middy/core";
import {
  kafkaRegistryFactoryMiddleware,
  kafkaEventDecodeMiddleware,
  KafkaConsumerContext,
} from "@libs/middlewares";
import {
  SNSPublisher,
  SNSMessage,
  SNSBatchMessages,
  SNSMessageEntry,
} from "@libs/aws-utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

const eventHandler = async (event: KafkaEvent) => {
  logger.info("decoded events:", event);

  const snsPublisher = new SNSPublisher();
  const MessageGroupId = process.env.MESSAGE_GROUP_ID;
  const TopicArn = process.env.SNS_TOPIC_ARN;

  const messages: SNSMessageEntry[] = [];

  const recordGroups = Object.entries(event.records);
  for (const [_, groupRecords] of recordGroups) {
    for (const record of groupRecords) {
      messages.push({
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

  await snsPublisher.publishBatchMessages(batchMessages);
  logger.info("events published to SNS");
};

export const main = middy(eventHandler)
  .use(kafkaRegistryFactoryMiddleware())
  .use(kafkaEventDecodeMiddleware());
