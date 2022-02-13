import { handlerPath } from "@libs/handlerResolver";

const event = {
  kafka: {
    accessConfigurations: {
      saslPlainAuth: [
        "${file(./deploy/serverless/config/${self:custom.stage}.yml):kafkaEvents.biochemical.accessConfigurations.saslPlainAuth}",
      ],
    },
    bootstrapServers: [
      "${file(./deploy/serverless/config/${self:custom.stage}.yml):kafkaEvents.biochemical.bootstrapServers}",
    ],
    topic:
      "${file(./deploy/serverless/config/${self:custom.stage}.yml):kafkaEvents.biochemical.topic}",
  },
};

export const kafkaConsumer = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [event],
  tags: { stage: "kafka-consumer-${self:custom.stage}" },
  timeout: 300,
  environment: {
    AWS_REGION: "eu-west-1",
    SCHEMA_REGISTRY_CREDENTIALS_ARN:
      "${file(deploy/config/${self:custom.stage}.yml)}:custom.schemaRegistry.credentials",
  },
};
