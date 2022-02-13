import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { fetchCredentials } from "@libs/aws-utils";

class SchemaRegistryFactory {
  private static instance: SchemaRegistry | undefined;

  public static reset(): void {
    SchemaRegistryFactory.instance = undefined;
  }

  public constructor() {}

  public async create(): Promise<SchemaRegistry> {
    if (SchemaRegistryFactory.instance) {
      return SchemaRegistryFactory.instance;
    }

    if (
      !process.env.SCHEMA_REGISTRY_CREDENTIALS_ARN ||
      !(process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION)
    ) {
      throw new Error(
        "SCHEMA_REGISTRY_CREDENTIALS_ARN or AWS_REGION is not set!"
      );
    }
    const { host, username, password } = await fetchCredentials(
      process.env.SCHEMA_REGISTRY_CREDENTIALS_ARN,
      process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
    );

    SchemaRegistryFactory.instance = new SchemaRegistry({
      host,
      auth: {
        username,
        password,
      },
    });
    return SchemaRegistryFactory.instance;
  }
}

export default SchemaRegistryFactory;
