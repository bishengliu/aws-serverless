import { Db } from "mongodb";
import { Context } from "aws-lambda";
import SchemaRegistry from "@libs/confluent-schema-registry/src/lib/SchemaRegistry";
// import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

type KafkaConsumerContext = {
  schemaRegistry: SchemaRegistry;
} & Context;

type SQSConsumerContext = {
  database: Db;
} & Context;

export { KafkaConsumerContext, SQSConsumerContext };
