import { CollectionConfig } from "./types";
import { Collection } from "mongodb";

const logger = require("@dazn/lambda-powertools-logger");
const primaryIndexName = "primary";

export const mongoEnsureIndexing = async (
  collection: Collection,
  collectionConfig: CollectionConfig
) => {
  const currentIndices = await getIndexNames(collection);

  const indexPromises: Promise<void>[] = [];

  if (indexRequired(currentIndices, primaryIndexName)) {
    const primaryPromise = createIndex(
      collection,
      primaryIndexName,
      { [collectionConfig.primaryKeyName]: 1 },
      { unique: true }
    );
    indexPromises.push(primaryPromise);
  }

  if (collectionConfig.secondaryIndices) {
    const secondaryPromises = collectionConfig.secondaryIndices
      .filter(({ indexName }) => indexRequired(currentIndices, indexName))
      .map(({ indexName, indexSpec, otherAttributes }) =>
        createIndex(collection, indexName, indexSpec, otherAttributes)
      );

    indexPromises.push(...secondaryPromises);
  }

  return Promise.all(indexPromises);
};

const indexRequired = (currentIndices, indexName: string) =>
  !currentIndices.includes(indexName);

const getIndexNames = async (collection: Collection): Promise<string[]> => {
  const indexes = await collection.indexes();
  return indexes.map((index: { name: string }) => index.name);
};

const createIndex = async (
  collection: Collection,
  indexName: string,
  indexSpec: Record<string, 1 | -1>,
  otherAttributes: Record<string, unknown> = {}
) => {
  try {
    await collection.createIndex(indexSpec, {
      name: indexName,
      ...otherAttributes,
    });
    logger.info("Added index to collection");
  } catch (err) {
    logger.error("Index creation failed");
  }
};
