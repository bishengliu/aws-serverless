import { MONGO_COLLECTION } from "serverless/constants";
import { CollectionConfig, CollectionPrimaryKeyPathPair } from "./types";
import { Collection, Document, Db } from "mongodb";
import {
  resourceToCollectionPrimaryKeyPair,
  collectionsConfig,
} from "./mongo-config";

class MongoCollectionFactory {
  private static collection: Collection<Document> | undefined;
  private static collectionConfig: CollectionConfig | undefined;
  private static collectionName: MONGO_COLLECTION | undefined;

  public getCollectionName(): MONGO_COLLECTION {
    if (MongoCollectionFactory.collectionName)
      return MongoCollectionFactory.collectionName;
    this.validateResourceTopic();

    const collectionPrimaryKeyPathPair: CollectionPrimaryKeyPathPair =
      resourceToCollectionPrimaryKeyPair[process.env.RESOURCE_TOPIC];

    MongoCollectionFactory.collectionName =
      collectionPrimaryKeyPathPair.collection;

    return MongoCollectionFactory.collectionName;
  }

  public async getCollection(database: Db) {
    if (MongoCollectionFactory.collection)
      return MongoCollectionFactory.collection;

    MongoCollectionFactory.collectionName = this.getCollectionName();

    MongoCollectionFactory.collection = database.collection(
      MongoCollectionFactory.collectionName
    );

    return MongoCollectionFactory.collection;
  }

  public getCollectionConfig() {
    if (MongoCollectionFactory.collectionConfig)
      return MongoCollectionFactory.collectionConfig;
    MongoCollectionFactory.collectionName = this.getCollectionName();

    this.valiadteCollectionConfig(MongoCollectionFactory.collectionName);

    const collectionConfig =
      collectionsConfig[MongoCollectionFactory.collectionName];

    MongoCollectionFactory.collectionConfig = collectionConfig;

    return MongoCollectionFactory.collectionConfig;
  }

  private valiadteCollectionConfig = (collectionName: MONGO_COLLECTION) => {
    if (Object.keys(collectionsConfig).indexOf(collectionName) === -1) {
      throw new Error(`missing collection config for ${collectionName}!`);
    }
  };

  private validateResourceTopic = () => {
    if (!process.env.RESOURCE_TOPIC)
      throw new Error("missing process.env.RESOURCE_TOPIC!");

    if (
      Object.keys(resourceToCollectionPrimaryKeyPair).indexOf(
        process.env.RESOURCE_TOPIC
      ) === -1
    ) {
      throw new Error("invalid process.env.RESOURCE_TOPIC!");
    }
  };
}
export default MongoCollectionFactory;
