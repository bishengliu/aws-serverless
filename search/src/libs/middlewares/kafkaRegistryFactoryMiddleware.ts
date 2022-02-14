import { SchemaRegistryFactory } from "@libs/kafka-utils";
import { KafkaEvent } from "@libs/types/kafka.types";
import { KafkaConsumerContext } from "@libs/middlewares";
import middy from "@middy/core";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

const defaults = {};

const kafkaRegistryFactoryMiddleware = (
  opts: Record<string, unknown> = {}
): middy.MiddlewareObject<KafkaEvent, void> => {
  const options: Record<string, unknown> = { ...defaults, ...opts };

  const kafkaRegistryFactoryMiddlewareBefore = async (
    handler: middy.HandlerLambda<KafkaEvent, void, KafkaConsumerContext>
  ) => {
    // logger.debug("raw event:", handler.event);

    const factory = new SchemaRegistryFactory();
    handler.context.schemaRegistry = await factory.create();

    logger.debug("schemaRegistry", handler.context.schemaRegistry);
  };

  return {
    before: kafkaRegistryFactoryMiddlewareBefore,
  };
};

export default kafkaRegistryFactoryMiddleware;
