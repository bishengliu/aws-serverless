import { handlerPath } from "@libs/lambda-utils";
import rConstants from "serverless/constants";

const event = {
  kafka: {
    accessConfigurations: {
      saslPlainAuth: [
        "${file(deploy/config/${self:custom.stage}.yml):kafkaEvents.biochemical.accessConfigurations.saslPlainAuth}",
      ],
    },
    bootstrapServers: [
      "${file(deploy/config/${self:custom.stage}.yml):kafkaEvents.biochemical.bootstrapServers}",
    ],
    topic:
      "${file(deploy/config/${self:custom.stage}.yml):kafkaEvents.biochemical.topic}",
  },
};

export const kafkaConsumer = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [event],
  tags: { stage: "kafka-consumer-${self:custom.stage}" },
  timeout: 300,
  environment: {
    SNS_TOPIC_ARN: {
      Ref: rConstants.SNSFifoTopicResource,
    },
    MESSAGE_GROUP_ID: "biochemical",
    SCHEMA_REGISTRY_CREDENTIALS_ARN:
      "${file(deploy/config/${self:custom.stage}.yml):custom.schemaRegistry.credentials}",
  },
};
