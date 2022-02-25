import { MongoClient, ReadPreferenceMode, MongoClientOptions } from "mongodb";
import { handlerPath } from "@libs/lambda-utils";
class MongoClientFactory {
  private static instance: MongoClient | undefined;

  public async create() {
    if (MongoClientFactory.instance) return MongoClientFactory.instance;

    if (
      !process.env.DOCDB_URL ||
      !process.env.DOCDB_USER ||
      !process.env.DOCDB_PASSWORD
    ) {
      throw new Error(
        "fail to create mongo client: missing process.env.DOCDB_URL, process.env.DOCDB_USER or process.env.DOCDB_PASSWORD"
      );
    }

    const connectionString = `mongodb://${process.env.DOCDB_URL}/`;
    const connectOptions: MongoClientOptions = {
      tls: true,
      tlsCAFile: `${handlerPath(__dirname)}/rds-combined-ca-bundle.pem`,
      auth: {
        username: process.env.DOCDB_USER,
        password: process.env.DOCDB_PASSWORD,
      },
      monitorCommands: true,
      retryWrites: false, // DocumentDB does not support retryWrites
      connectTimeoutMS: 150,
      readPreference: ReadPreferenceMode.secondaryPreferred,
    };

    const client = new MongoClient(connectionString, connectOptions);
    MongoClientFactory.instance = await client.connect();
    return MongoClientFactory.instance;
  }
}

export default MongoClientFactory;
