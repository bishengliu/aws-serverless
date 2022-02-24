import { SQSKafkaEvent } from "@libs/types/sqs.types";
import middy from "@middy/core";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

const eventHandler = async (event: SQSKafkaEvent) => {
  const records = event.Records.flatMap((record) => record.body);
  console.log(records);
};

export const main = middy(eventHandler);
