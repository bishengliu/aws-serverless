import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandInput,
} from "@aws-sdk/client-secrets-manager";

const fetchCredentials = async (secretNameOrArn: string, region: string) => {
  const secretManagerClient = new SecretsManagerClient({ region });

  const command = new GetSecretValueCommand({
    SecretId: secretNameOrArn,
  } as GetSecretValueCommandInput);

  const response = await secretManagerClient.send(command);
  return response?.SecretString ? JSON.parse(response?.SecretString) : "";
};

export default fetchCredentials;
