import { MongoClient, ReadPreferenceMode, MongoClientOptions } from "mongodb";
class MongoClientFactory {
  private static instance: MongoClient | undefined;

  public constructor(
    private readonly docdbUri: string,
    private readonly username: string,
    private readonly password: string
  ) {}

  public async create() {
    if (MongoClientFactory.instance) return MongoClientFactory.instance;

    const connectionString = `mongodb://${this.docdbUri}/`;
    const connectOptions: MongoClientOptions = {
      tls: true,
      tlsCAFile: "rds-combined-ca-bundle.pem",
      auth: {
        username: this.username,
        password: this.password,
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
