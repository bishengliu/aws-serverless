import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandInput,
} from "@aws-sdk/client-secrets-manager";

class SecretsManager {
  private static client;

  constructor() {}

  public CreateClient() {
    if (SecretsManager.client) {
      return SecretsManager.client;
    }

    if (!(process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION)) {
      throw new Error("AWS_REGION is not set!");
    }

    SecretsManager.client = new SecretsManagerClient({
      region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
    });

    return SecretsManager.client;
  }
}

const secretsManagerClient = new SecretsManager().CreateClient();

const fetchCredentials = async (secretNameOrArn: string) => {
  const command = new GetSecretValueCommand({
    SecretId: secretNameOrArn,
  } as GetSecretValueCommandInput);
  const response = await secretsManagerClient.send(command);
  return response?.SecretString ? JSON.parse(response?.SecretString) : "";
};

export default fetchCredentials;
