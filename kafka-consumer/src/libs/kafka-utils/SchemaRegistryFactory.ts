import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { fetchCredentials } from "@libs/aws-utils";

class SchemaRegistryFactory {
  public constructor() {}

  public async create(): Promise<SchemaRegistry> {
    const { host, username, password } = await fetchCredentials(
      process.env.SCHEMA_REGISTRY_CREDENTIALS_ARN,
      process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
    );
    return new SchemaRegistry({
      host,
      auth: {
        username,
        password,
      },
    });
  }
}

export default SchemaRegistryFactory;
