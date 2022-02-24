import { SQSMessageAttributes, SQSRecordAttributes } from "aws-lambda";
import { KafkaRecord } from "./kafka.types";

export type SQSKafkaRecord = {
  messageId: string;
  receiptHandle: string;
  body: KafkaRecord;
  attributes: SQSRecordAttributes;
  messageAttributes: SQSMessageAttributes;
  md5OfBody: string;
  eventSource: "aws:sqs";
  eventSourceARN: string;
  awsRegion: string;
};

export type SQSKafkaEvent = {
  Records: SQSKafkaRecord[];
};
