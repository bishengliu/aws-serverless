import { KafkaEvent } from "@libs/types/kafka.types";
import middy from "@middy/core";
import {
  kafkaRegistryFactoryMiddleware,
  kafkaEventDecodeMiddleware,
} from "@libs/middlewares";
import { publishBatchMessages } from "@libs/aws-utils";
import { kafkaEventToSNSMessages } from "@libs/common-utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

const eventHandler = async (event: KafkaEvent) => {
  // logger.info("decoded events:", event);

  await publishBatchMessages(kafkaEventToSNSMessages(event));
  // logger.info("events published to SNS");
};

export const main = middy(eventHandler)
  .use(kafkaRegistryFactoryMiddleware())
  .use(kafkaEventDecodeMiddleware());
