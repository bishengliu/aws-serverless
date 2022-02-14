import { KafkaEvent } from "@libs/types/kafka.types";
import middy from "@middy/core";
import {
  kafkaRegistryFactoryMiddleware,
  kafkaEventDecodeMiddleware,
  KafkaConsumerContext,
} from "@libs/middlewares";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

const eventHandler = async (
  event: KafkaEvent,
  context: KafkaConsumerContext
) => {
  const recordGroups = Object.entries(event.records);
  for (const [key, groupRecords] of recordGroups) {
    logger.debug(key, groupRecords);
  }
};

export const main = () =>
  middy(eventHandler)
    .use(kafkaRegistryFactoryMiddleware())
    .use(kafkaEventDecodeMiddleware()); // create kafka schema registry