import {
  mongoClientMiddleware,
  mongoCollectionMiddleware,
  mongoEnsureIndexingMiddleware,
  SQSConsumerContext,
} from "@libs/middlewares";
import { mongoUpsert } from "@libs/mongo-utils/mongoUpsert";
import { SQSKafkaEvent } from "@libs/types/sqs.types";
import middy from "@middy/core";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

const eventHandler = async (
  event: SQSKafkaEvent,
  context: SQSConsumerContext
) => {
  const records = event.Records.flatMap((record) => record.body);

  for (let record of records) {
    await mongoUpsert(record.value, context);
  }
};

export const main = middy(eventHandler)
  .use(mongoClientMiddleware())
  .use(mongoCollectionMiddleware())
  .use(mongoEnsureIndexingMiddleware());
