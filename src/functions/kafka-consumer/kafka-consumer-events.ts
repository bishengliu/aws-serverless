import { ResourcePrefix } from "serverless/constants";

const events = {};

events[ResourcePrefix.BIOCHEMICAL] = {
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

export const kafkaConsumerEvent = (kafkaEventKey: ResourcePrefix) =>
  events[kafkaEventKey];
