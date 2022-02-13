import { KafkaRecordsByTopicAndPartition } from "../kafka.types";
import { decodeKafkaRecords } from "@libs/kafka-utils/kafkaRecordsDecoder";
import { KafkaEvent } from "@libs/kafka.types";
import { KafkaConsumerContext } from "@libs/middlewares/middleware.types";
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
