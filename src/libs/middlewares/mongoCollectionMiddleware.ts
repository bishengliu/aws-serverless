const logger = require("@dazn/lambda-powertools-logger");
import { MongoCollectionFactory } from "@libs/mongo-utils";
import { SQSKafkaEvent } from "@libs/types/sqs.types";
import middy from "@middy/core";
import { SQSConsumerContext } from "./middleware.types";

const defaults = {};
const factory = new MongoCollectionFactory();

const mongoCollectionMiddleware = (
  opts: Record<string, unknown> = {}
): middy.MiddlewareObject<SQSKafkaEvent, void> => {
  const options: Record<string, unknown> = { ...defaults, ...opts };

  const mongoCollectionMiddlewareBefore = async (
    handler: middy.HandlerLambda<SQSKafkaEvent, void, SQSConsumerContext>
  ) => {
    if (!handler.context.database)
      throw new Error("docdb database not connected!");
    handler.context.collectionName = factory.getCollectionName();
    handler.context.collection = await factory.getCollection(
      handler.context.database
    );
    handler.context.collectionConfig = factory.getCollectionConfig();
  };

  return {
    before: mongoCollectionMiddlewareBefore,
  };
};

export default mongoCollectionMiddleware;
