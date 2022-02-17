// ES6+ example
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
  PublishCommandOutput,
  PublishBatchCommandInput,
  PublishBatchCommand,
  PublishBatchCommandOutput,
  PublishBatchRequestEntry,
} from "@aws-sdk/client-sns";
import { SNSMessage, SNSBatchMessages } from "./types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

class SNSPublisher {
  private static _publisher: any;

  constructor() {}

  public init() {
    if (SNSPublisher._publisher) {
      return SNSPublisher._publisher;
    }

    if (!(process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION)) {
      throw new Error("AWS_REGION is not set!");
    }

    SNSPublisher._publisher = new SNSClient({
      region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
    });
    return SNSPublisher._publisher;
  }
}

const snsPublisher = new SNSPublisher().init();

const publishMessage = async (
  message: SNSMessage
): Promise<PublishCommandOutput> => {
  try {
    const input = message as unknown as PublishCommandInput;
    const command = new PublishCommand(input);

    return await snsPublisher.send(command);
  } catch (err) {
    logger.warn(`"fail to publish message to SNS"`, err);
  }
};

const publishBatchMessages = async (
  messages: SNSBatchMessages
): Promise<PublishBatchCommandOutput> => {
  const input = {
    TopicArn: messages.TopicArn,
    PublishBatchRequestEntries:
      messages.Messages as unknown as PublishBatchRequestEntry[],
  } as PublishBatchCommandInput;

  const command = new PublishBatchCommand(input);

  return await snsPublisher.send(command);
};

export { publishMessage, publishBatchMessages };
