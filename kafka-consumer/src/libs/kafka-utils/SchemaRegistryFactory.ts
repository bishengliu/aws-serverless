import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

class SchemaRegistryFactory {
  public constructor() {}

  public async create(): Promise<SchemaRegistry> {
    const host = "http://registry:8081/";
    return new SchemaRegistry({
      host,
    });
  }
}

export default SchemaRegistryFactory;
