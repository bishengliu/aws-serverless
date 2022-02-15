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
import { SNSMessage, SNSMessages } from "./types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

class SNSPublisher {
  private static _publisher: any;

  constructor() {}

  public create(): SNSClient {
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

  public async publishMessage(
    message: SNSMessage
  ): Promise<PublishCommandOutput> {
    try {
      const snsClient = this.create();
      const input = message as unknown as PublishCommandInput;
      const command = new PublishCommand(input);

      return await snsClient.send(command);
    } catch (err) {
      logger.warn(`"fail to publish message to SNS"`, message, err);
    }
  }

  public async publishBatchMessages(
    messages: SNSMessages
  ): Promise<PublishBatchCommandOutput> {
    try {
      const snsClient = this.create();

      const input = {
        TopicArn: messages.TopicArn,
        PublishBatchRequestEntries:
          messages.PublishBatchRequestEntries as unknown as PublishBatchRequestEntry[],
      } as PublishBatchCommandInput;

      const command = new PublishBatchCommand(input);

      return await snsClient.send(command);
    } catch (error) {
      logger.warn(`"fail to publish messages to SNS"`, messages, error);
    }
  }
}

export default SNSPublisher;
