import { Context } from "aws-lambda";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

type KafkaConsumerContext = {
  schemaRegistry: SchemaRegistry;
} & Context;

export { KafkaConsumerContext };
