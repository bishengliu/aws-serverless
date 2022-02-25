import { Collection, Document, Db } from "mongodb";
import { Context } from "aws-lambda";
import SchemaRegistry from "@libs/confluent-schema-registry/src/lib/SchemaRegistry";
import { CollectionConfig } from "@libs/mongo-utils/types";
import { MONGO_COLLECTION } from "serverless/constants";
// import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

type KafkaConsumerContext = {
  schemaRegistry: SchemaRegistry;
} & Context;

type SQSConsumerContext = {
  database: Db | undefined;
  collection: Collection<Document> | undefined;
  collectionConfig: CollectionConfig | undefined;
  collectionName: MONGO_COLLECTION | undefined;
  indexingEsnured: boolean;
} & Context;

export { KafkaConsumerContext, SQSConsumerContext };
