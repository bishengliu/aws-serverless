import { sqsConsumerFactory, kafkaConsumerFactory } from "../src/functions";
import { ResourcePrefix } from "./constants";

const functionGroups = (resourcePrefix: ResourcePrefix) => {
  const kafkaConsumer = kafkaConsumerFactory(resourcePrefix);
  const sqsConsumer = sqsConsumerFactory(resourcePrefix);

  return {
    [resourcePrefix + "-kafka-consumer"]: kafkaConsumer,
    [resourcePrefix + "-sqs-consumer"]: sqsConsumer,
  };
};

export const functions = {
  ...functionGroups(ResourcePrefix.BIOCHEMICAL),
};
