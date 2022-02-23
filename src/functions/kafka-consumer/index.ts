import {
  kafkaConsumerEvent,
  KafkaEventKey,
} from "@functions/kafka-consumer-events";
import { handlerPath } from "@libs/lambda-utils";
import { ResourcePrefix } from "serverless/constants";

export const kafkaConsumerFactory = (resource_prefix: ResourcePrefix) => {
  const kafkaConsumer = {
    tags: { stage: "kafka-consumer-${self:custom.stage}" },
    timeout: 300,
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [kafkaConsumerEvent(KafkaEventKey.BIOCHEMICAL)],
    environment: {
      SNS_TOPIC_ARN: {
        Ref: resource_prefix + "SNSTopic",
      },
      MESSAGE_GROUP_ID: resource_prefix,
      SCHEMA_REGISTRY_CREDENTIALS_ARN:
        "${file(deploy/config/${self:custom.stage}.yml):custom.schemaRegistry.credentials}",
    },
  };
  return kafkaConsumer;
};
