import { DecodedKafkaRecord } from "./../kafka.types";
import { kafkaRecordsDecoder } from "@libs/kafka-utils/kafkaRecordsDecoder";
import { KafkaEvent } from "@libs/kafka.types";
import { MiddlewareContext } from "@libs/middlewares/middleware.types";
import middy from "@middy/core";

const defaults = {};

const kafkaEventDecodeMiddleware = (
  opts: Record<string, unknown> = {}
): middy.MiddlewareObject<KafkaEvent, void> => {
  const options: Record<string, unknown> = { ...defaults, ...opts };

  const kafkaEventDecodeMiddlewareBefore = async (
    handler: middy.HandlerLambda<KafkaEvent, void, MiddlewareContext>
  ) => {
    const decodedRecordGroups: DecodedKafkaRecord[][] = [];

    const schemaRegistry = handler.context.schemaRegistry;
    const { records } = handler.event;
    const recordGroups = Object.entries(records);

    for (const [, groupRecords] of recordGroups) {
      const decodedRecords: DecodedKafkaRecord[] = await kafkaRecordsDecoder(
        groupRecords,
        schemaRegistry
      );
      decodedRecordGroups.push(decodedRecords);
    }
    handler.context.recordGroups = decodedRecordGroups;
  };

  return {
    before: kafkaEventDecodeMiddlewareBefore,
  };
};

export default kafkaEventDecodeMiddleware;
