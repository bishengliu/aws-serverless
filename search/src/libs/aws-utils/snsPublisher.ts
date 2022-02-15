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
  private _publisher: any;

  constructor() {
    this.init();
  }

  private init() {
    if (this._publisher) {
      return;
    }

    if (!(process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION)) {
      throw new Error("AWS_REGION is not set!");
    }

    this._publisher = new SNSClient({
      region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
    });
  }

  public async publishMessage(
    message: SNSMessage
  ): Promise<PublishCommandOutput> {
    try {
      const input = message as unknown as PublishCommandInput;
      const command = new PublishCommand(input);

      return await this._publisher.send(command);
    } catch (err) {
      logger.warn(`"fail to publish message to SNS"`, message, err);
    }
  }

  public async publishBatchMessages(
    messages: SNSBatchMessages
  ): Promise<PublishBatchCommandOutput> {
    try {
      const input = {
        TopicArn: messages.TopicArn,
        PublishBatchRequestEntries:
          messages.Messages as unknown as PublishBatchRequestEntry[],
      } as PublishBatchCommandInput;

      const command = new PublishBatchCommand(input);

      return await this._publisher.send(command);
    } catch (error) {
      logger.warn(`"fail to publish messages to SNS"`, messages, error);
    }
  }
}

export default SNSPublisher;
