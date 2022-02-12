import { Context } from "aws-lambda";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

type MiddlewareContext = {
  schemaRegistry: SchemaRegistry;
} & Context;

export { MiddlewareContext };
