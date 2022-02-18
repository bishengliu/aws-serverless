export enum KafkaEventKey {
  BIOCHEMICAL = "biochemical",
}

const events = {};

events["biochemical"] = {
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

export const kafkaConsumerEvent = (kafkaEventKey: KafkaEventKey) =>
  events[kafkaEventKey];
