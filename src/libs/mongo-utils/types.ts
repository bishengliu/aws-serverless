export type CollectionPrimaryKeyPathPair = {
  collection: string;
  primaryKeyPath: string;
};

export type TopicToCollectionPrimaryKeyPair = Record<
  string, //kafka topic names
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
