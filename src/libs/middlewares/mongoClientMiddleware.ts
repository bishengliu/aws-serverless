const logger = require("@dazn/lambda-powertools-logger");
import { MongoClientFactory } from "@libs/mongo-utils";
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
    if (!process.env.DOCDB_DB)
      throw new Error("missing process.env.DOCDB_DB for the docdb database!");
    const mongoClient = await factory.create();
    handler.context.database = mongoClient.db(process.env.DOCDB_DB);
    logger.info(handler.context.database);
  };
  return {
    before: mongoClientMiddlewareBefore,
  };
};

export default mongoClientMiddleware;
