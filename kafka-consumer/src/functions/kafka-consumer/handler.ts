import { KafkaEvent } from "@libs/kafka.types";
import middy from "@middy/core";
import kafkaRegistryFactoryMiddleware from "@libs/middlewares/kafkaRegistryFactoryMiddleware";
import { KafkaConsumerContext } from "@libs/middlewares/middleware.types";
const eventHandler = async (
  event: KafkaEvent,
  context: KafkaConsumerContext
) => {
  // upon success publish to SNS
};

export const handler = () =>
  middy(eventHandler).use(kafkaRegistryFactoryMiddleware()); // create kafka schema registry
