export interface SNSMessage {
  MessageGroupId: string;
  MessageDeduplicationId: string;
  Message: string;
  TopicArn: string;
}

export interface SNSMessages {
  TopicArn: string;
  PublishBatchRequestEntries: SNSMessage[];
}
