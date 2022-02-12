import { KafkaEvent } from "@libs/kafka.types";
import type { Context } from "aws-lambda";
import middy from "@middy/core";
import kafkaRegistryFactoryMiddleware from "@libs/middlewares/kafkaRegistryFactoryMiddleware";

const eventHandler = async (event: KafkaEvent, context: Context) => {
  // upon success publish to SNS
};

export const handler = () =>
  middy(eventHandler).use(kafkaRegistryFactoryMiddleware()); // create kafka schema registry
