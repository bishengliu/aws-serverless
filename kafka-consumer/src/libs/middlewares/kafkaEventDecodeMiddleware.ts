import { decodeKafkaRecords } from "@libs/kafka-utils";
import {
  KafkaEvent,
  KafkaRecordsByTopicAndPartition,
} from "@libs/types/kafka.types";
import { KafkaConsumerContext } from "@libs/middlewares";
import middy from "@middy/core";

const defaults = {};

const kafkaEventDecodeMiddleware = (
  opts: Record<string, unknown> = {}
): middy.MiddlewareObject<KafkaEvent, void> => {
  const options: Record<string, unknown> = { ...defaults, ...opts };

  const kafkaEventDecodeMiddlewareBefore = async (
    handler: middy.HandlerLambda<KafkaEvent, void, KafkaConsumerContext>
  ) => {
    const schemaRegistry = handler.context.schemaRegistry;
    const { records } = handler.event;
    const recordGroups = Object.entries(records);

    const decodedRecords = {} as KafkaRecordsByTopicAndPartition;

    for (const [key, groupRecords] of recordGroups) {
      decodedRecords[key] = await decodeKafkaRecords(
        groupRecords,
        schemaRegistry
      );
    }
    handler.event.records = decodedRecords;
  };

  return {
    before: kafkaEventDecodeMiddlewareBefore,
  };
};

export default kafkaEventDecodeMiddleware;
