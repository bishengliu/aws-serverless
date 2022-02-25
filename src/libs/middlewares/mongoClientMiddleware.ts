const logger = require("@dazn/lambda-powertools-logger");
import MongoClientFactory from "@libs/mongo-utils/mongoClientFactory";
import { SQSKafkaEvent } from "@libs/types/sqs.types";
import middy from "@middy/core";
import { SQSConsumerContext } from "./middleware.types";

const defaults = {};
const factory = new MongoClientFactory();

const mongoClientMiddleware = (
  opts: Record<string, unknown> = {}
): middy.MiddlewareObject<SQSKafkaEvent, void> => {
  const options: Record<string, unknown> = { ...defaults, ...opts };

  const mongoClientMiddlewareBefore = async (
    handler: middy.HandlerLambda<SQSKafkaEvent, void, SQSConsumerContext>
  ) => {
    handler.context.mongoClient = await factory.create();
  };
  return {
    before: mongoClientMiddlewareBefore,
  };
};

export default mongoClientMiddleware;
