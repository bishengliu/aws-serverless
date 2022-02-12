import { DecodedKafkaRecord } from "./../kafka.types";
import { DecodedKafkaField, KafkaRecord } from "../kafka.types";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
export const kafkaRecordsDecoder = async (
  records: KafkaRecord[],
  schemaRegistry: SchemaRegistry
) => {
  const decodedRecords: DecodedKafkaRecord[] = [];
  for (const record of records) {
    const { key: base64EncodedKey, value: base64EncodedMessage } = record;

    const decodedKey: DecodedKafkaField = await decodeKafkaField(
      base64EncodedKey,
      schemaRegistry
    );

    const decodedMessage: DecodedKafkaField = await decodeKafkaField(
      base64EncodedMessage,
      schemaRegistry
    );

    decodedRecords.push({
      decodedKey,
      decodedMessage,
      record,
    } as DecodedKafkaRecord);
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
