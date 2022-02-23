import {
  kafkaConsumerEvent,
  KafkaEventKey,
} from "@functions/kafka-consumer-events";
import { handlerPath } from "@libs/lambda-utils";
import rConstants from "serverless/constants";

export const kafkaConsumerFactory = (name: string) => {
  const kafkaConsumer = {
    tags: { stage: "kafka-consumer-${self:custom.stage}" },
    timeout: 300,
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [kafkaConsumerEvent(KafkaEventKey.BIOCHEMICAL)],
    environment: {
      SNS_TOPIC_ARN: {
        Ref: rConstants.SNSFifoTopicResource,
      },
      MESSAGE_GROUP_ID: name,
      SCHEMA_REGISTRY_CREDENTIALS_ARN:
        "${file(deploy/config/${self:custom.stage}.yml):custom.schemaRegistry.credentials}",
    },
  };
  return kafkaConsumer;
};
