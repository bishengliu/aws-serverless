import { DecodedKafkaRecord } from "../kafka.types";
import { Context } from "aws-lambda";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

type MiddlewareContext = {
  schemaRegistry: SchemaRegistry;
  recordGroups: DecodedKafkaRecord[][];
} & Context;

export { MiddlewareContext };
