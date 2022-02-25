import { SQSConsumerContext } from "@libs/middlewares";
import { DecodedKafkaField } from "@libs/types/kafka.types";
import { Collection } from "mongodb";
import { CollectionConfig } from "./types";
export const mongoUpsert = async (
  message: DecodedKafkaField,
  context: SQSConsumerContext
) => {
  const primaryKeyPath: string = context.primaryKeyPath;
  const collection: Collection = context.collection;
  const collectionConfig: CollectionConfig = context.collectionConfig;

  if (typeof message === "string") {
    throw new Error(
      "Malformed source document, expected an object not a string"
    );
  }
  const primaryKeyFragment = createPrimaryKeyFragment(
    primaryKeyPath,
    collectionConfig,
    message
  );

  const now = new Date();
  const update = {
    $setOnInsert: { ...primaryKeyFragment, created: now },
    $set: {
      ...message,
      lastModified: now,
      version: collectionConfig.version,
    },
  };

  const updateResult = await collection.updateOne(primaryKeyFragment, update, {
    upsert: true,
  });

  if (!updateResult.acknowledged) {
    throw new Error("Update was not acknowledged");
  }
};

const createPrimaryKeyFragment = (
  primaryKeyPath: string,
  collectionConfig: CollectionConfig,
  message: DecodedKafkaField
): Record<string, string> => {
  try {
    // traverse the message to find the value of the primary key field
    const primaryKeyValue: string = primaryKeyPath
      .split(".")
      .reduce((parent, child) => parent[child], message);

    if (!primaryKeyValue) {
      throw new Error("Primary key not found in source document");
    }

    return { [collectionConfig.primaryKeyName]: primaryKeyValue };
  } catch (err) {
    throw new Error(
      `Malformed source document does not contain primary key at expected path: ${primaryKeyPath}`
    );
  }
};
