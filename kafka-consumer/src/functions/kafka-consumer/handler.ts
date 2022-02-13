import { KafkaEvent } from "@libs/kafka.types";
import middy from "@middy/core";
import kafkaRegistryFactoryMiddleware from "@libs/middlewares/kafkaRegistryFactoryMiddleware";
import { KafkaConsumerContext } from "@libs/middlewares/middleware.types";
const eventHandler = async (
  event: KafkaEvent,
  context: KafkaConsumerContext
) => {
  const recordGroups = Object.entries(event.records);
  for (const [key, groupRecords] of recordGroups) {
    console.log(key + ": " + groupRecords.length);
  }
};

export const handler = () =>
  middy(eventHandler).use(kafkaRegistryFactoryMiddleware()); // create kafka schema registry
