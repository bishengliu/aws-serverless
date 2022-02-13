import { handlerPath } from "@libs/handlerResolver";

export const kafkaConsumer = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events:
    "${file(./deploy/serverless/config/${self:custom.stage}.yml):kafkaEvents}",
  tags: "kafka-consumer-${self:custom.stage}",
  environment: {
    SCHEMA_REGISTRY_CREDENTIALS_ARN:
      "${file(deploy/config/${self:custom.stage}.yml)}:custom.schemaRegistry.credentials",
  },
};
