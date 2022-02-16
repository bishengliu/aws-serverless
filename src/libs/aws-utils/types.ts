export interface SNSMessageEntry {
  Id: string;
  MessageGroupId: string;
  MessageDeduplicationId: string;
  Message: string;
}

export interface SNSMessage extends Omit<SNSMessageEntry, "Id"> {
  TopicArn: string;
}

export interface SNSBatchMessages {
  TopicArn: string;
  Messages: SNSMessageEntry[];
}
