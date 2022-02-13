import { KafkaEvent } from "@libs/types/kafka.types";
import middy from "@middy/core";
import {
  kafkaRegistryFactoryMiddleware,
  kafkaEventDecodeMiddleware,
  KafkaConsumerContext,
} from "@libs/middlewares";

const eventHandler = async (
  event: KafkaEvent,
  context: KafkaConsumerContext
) => {
  const recordGroups = Object.entries(event.records);
  for (const [key, groupRecords] of recordGroups) {
    console.log(key + ": " + groupRecords.length);
  }
};

export const main = () =>
  middy(eventHandler)
    .use(kafkaRegistryFactoryMiddleware())
    .use(kafkaEventDecodeMiddleware()); // create kafka schema registry
