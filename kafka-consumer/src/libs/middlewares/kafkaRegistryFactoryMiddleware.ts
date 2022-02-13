import SchemaRegistryFactory from "@libs/kafka-utils/SchemaRegistryFactory";
import { KafkaEvent } from "@libs/kafka.types";
import { KafkaConsumerContext } from "@libs/middlewares/middleware.types";
import middy from "@middy/core";

const defaults = {};

const kafkaRegistryFactoryMiddleware = (
  opts: Record<string, unknown> = {}
): middy.MiddlewareObject<KafkaEvent, void> => {
  const options: Record<string, unknown> = { ...defaults, ...opts };

  const kafkaRegistryFactoryMiddlewareBefore = async (
    handler: middy.HandlerLambda<KafkaEvent, void, KafkaConsumerContext>
  ) => {
    const factory = new SchemaRegistryFactory();
    handler.context.schemaRegistry = await factory.create();
  };

  return {
    before: kafkaRegistryFactoryMiddlewareBefore,
  };
};

export default kafkaRegistryFactoryMiddleware;
