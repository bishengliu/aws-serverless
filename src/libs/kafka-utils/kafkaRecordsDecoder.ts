import { DecodedKafkaField, KafkaRecord } from "../types/kafka.types";
import SchemaRegistry from "@libs/confluent-schema-registry/src/lib/SchemaRegistry";
// import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

export const decodeKafkaRecords = async (
  records: KafkaRecord[],
  schemaRegistry: SchemaRegistry
): Promise<KafkaRecord[]> => {
  const decodedRecords: KafkaRecord[] = [];

  for (const record of records) {
    // logger.debug("start to decode record:", record);
    const { key: base64EncodedKey, value: base64EncodedMessage } = record;

    try {
      const decodedKey: DecodedKafkaField = await decodeKafkaField(
        base64EncodedKey,
        schemaRegistry
      );

      const decodedMessage: DecodedKafkaField = await decodeKafkaField(
        base64EncodedMessage,
        schemaRegistry
      );

      const decodedRecord: KafkaRecord = {
        ...record,
        ...{ key: decodedKey, value: decodedMessage },
      } as KafkaRecord;

      decodedRecords.push(decodedRecord);

      // logger.debug("record decoded:", decodedRecord);
    } catch (error) {
      logger.warn("Fail to decode kafka record", error); // todo:need to decide what to log/do
      continue;
    }
  }

  return decodedRecords;
};

const decodeKafkaField = async (
  base64Encoded: string,
  schemaRegistry: SchemaRegistry
): Promise<DecodedKafkaField> => {
  const kafkaFieldBuffer = Buffer.from(base64Encoded, "base64");

  const kafkaField: DecodedKafkaField = isAvroEncoded(kafkaFieldBuffer)
    ? await schemaRegistry.decode(kafkaFieldBuffer)
    : kafkaFieldBuffer.toString("utf8");

  return kafkaField;
};

const isAvroEncoded = (buffer: Buffer): boolean =>
  buffer.length > 0 && buffer.slice(0, 1).readInt8(0) === 0;
