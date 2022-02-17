import { KafkaEvent } from "@libs/types/kafka.types";
import middy from "@middy/core";
import {
  kafkaRegistryFactoryMiddleware,
  kafkaEventDecodeMiddleware,
} from "@libs/middlewares";
import { publishBatchMessages, publishMessage } from "@libs/aws-utils";
import {
  kafkaEventToSNSBatchMessages,
  kafkaEventToSNSMessages,
} from "@libs/common-utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

const eventHandler = async (event: KafkaEvent) => {
  const messages = kafkaEventToSNSMessages(event);
  messages.forEach(async (message) => {
    await publishMessage(message);
    logger.info("events published to SNS");
  });
  // logger.info("decoded events:", event);
  // const snsBatchMessages = kafkaEventToSNSMessages(event);
  // logger.info(snsBatchMessages);
  // await publishBatchMessages(snsBatchMessages);
};

export const main = middy(eventHandler)
  .use(kafkaRegistryFactoryMiddleware())
  .use(kafkaEventDecodeMiddleware());
