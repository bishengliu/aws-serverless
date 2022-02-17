import { KafkaEvent } from "@libs/types/kafka.types";
import middy from "@middy/core";
import {
  kafkaRegistryFactoryMiddleware,
  kafkaEventDecodeMiddleware,
} from "@libs/middlewares";
import { publishBatchMessages } from "@libs/aws-utils";
import { kafkaEventToSNSBatchMessages } from "@libs/common-utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

const eventHandler = async (event: KafkaEvent) => {
  const snsBatchMessages = kafkaEventToSNSBatchMessages(event);

  for (var messages of snsBatchMessages) {
    try {
      await publishBatchMessages(messages);
      logger.info("batch messages published to SNS");
    } catch (error) {
      logger.warn("fail to publish SNS messages", messages);
    }
  }
};

export const main = middy(eventHandler)
  .use(kafkaRegistryFactoryMiddleware())
  .use(kafkaEventDecodeMiddleware());
