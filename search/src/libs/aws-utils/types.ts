export interface SNSMessageEntry {
  MessageGroupId: string;
  MessageDeduplicationId: string;
  Message: string;
}
export interface SNSMessage extends SNSMessageEntry {
  TopicArn: string;
}

export interface SNSBatchMessages {
  TopicArn: string;
  Messages: SNSMessageEntry[];
}
