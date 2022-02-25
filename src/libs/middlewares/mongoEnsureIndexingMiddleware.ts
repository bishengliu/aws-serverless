const logger = require("@dazn/lambda-powertools-logger");
import { mongoEnsureIndexing } from "@libs/mongo-utils";
import { SQSKafkaEvent } from "@libs/types/sqs.types";
import middy from "@middy/core";
import { SQSConsumerContext } from "./middleware.types";

const defaults = {};

const mongoEnsureIndexingMiddleware = (
  opts: Record<string, unknown> = {}
): middy.MiddlewareObject<SQSKafkaEvent, void> => {
  const options: Record<string, unknown> = { ...defaults, ...opts };

  const mongoEnsureIndexingMiddlewareBefore = async (
    handler: middy.HandlerLambda<SQSKafkaEvent, void, SQSConsumerContext>
  ) => {
    if (!handler.context.indexingEsnured) {
      if (!handler.context.collection)
        throw new Error("docdb connection doesn't exist on context!");
      if (!handler.context.collectionConfig)
        throw new Error("docdb collectionConfig doesn't exist on context!");
      try {
        await mongoEnsureIndexing(
          handler.context.collection,
          handler.context.collectionConfig
        );
        handler.context.indexingEsnured = true;
      } catch (error) {
        logger("fail to ensure all the indexing!");
        handler.context.indexingEsnured = false;
      }
    }
  };

  return {
    before: mongoEnsureIndexingMiddlewareBefore,
  };
};

export default mongoEnsureIndexingMiddleware;
