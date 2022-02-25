import { ResourcePrefix, MONGO_COLLECTION } from "serverless/constants";

export type CollectionPrimaryKeyPathPair = {
  collection: MONGO_COLLECTION;
  primaryKeyPath: string;
};

export type ResourceToCollectionPrimaryKeyPair = Record<
  ResourcePrefix, //kafka topic names
  CollectionPrimaryKeyPathPair
>;

export type CollectionConfig = {
  primaryKeyName: string;
  secondaryIndices?: {
    indexSpec: Record<string, 1 | -1>;
    indexName: string;
    otherAttributes?: Record<string, unknown>;
  }[];
  publishDataChanged?: boolean;
  version: number;
};

export type CollectionsConfig = Record<string, CollectionConfig>;
