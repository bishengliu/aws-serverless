import { handlerPath } from "@libs/lambda-utils";

const event = {
  kafka: {
    accessConfigurations: {
      saslPlainAuth: [
        "arn:aws:secretsmanager:eu-west-1:250098771573:secret:/manual/yeti/kafka/confluent-dev-GRHIgz",
        // "${file(../../deploy/serverless/config/${self:custom.stage}.yml):kafkaEvents.biochemical.accessConfigurations.saslPlainAuth}",
      ],
    },
    bootstrapServers: [
      "pkc-e8mp5.eu-west-1.aws.confluent.cloud:9092",
      // "${file(deploy/serverless/config/${self:custom.stage}.yml):kafkaEvents.biochemical.bootstrapServers}",
    ],
    topic: "abcam.event.target.target.sit",
    //"${file(deploy/serverless/config/${self:custom.stage}.yml):kafkaEvents.biochemical.topic}",
  },
};

export const kafkaConsumer = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [event],
  tags: { stage: "kafka-consumer-${self:custom.stage}" },
  timeout: 300,
  environment: {
    SCHEMA_REGISTRY_CREDENTIALS_ARN:
      "${file(deploy/config/${self:custom.stage}.yml):custom.schemaRegistry.credentials}",
  },
};
