import { sqsConsumerFactory, kafkaConsumerFactory } from "../src/functions";
import { ResourcePrefix } from "./constants";

const functionGroups = (
  resourcePrefix: ResourcePrefix,
  stage: string = "poc"
) => {
  const kafkaConsumer = kafkaConsumerFactory(resourcePrefix);
  const sqsConsumer = sqsConsumerFactory(resourcePrefix);

  return {
    [resourcePrefix + "-kafka-consumer-" + stage]: kafkaConsumer,
    [resourcePrefix + "-sqs-consumer-" + stage]: sqsConsumer,
  };
};

export const functions = (stage: string) => ({
  ...functionGroups(ResourcePrefix.BIOCHEMICAL, stage.toLowerCase()),
});
