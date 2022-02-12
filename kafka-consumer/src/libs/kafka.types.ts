export type KafkaRecord = {
  topic: string;
  partition: number;
  offset: number;
  timestamp: number;
  timestampType: string;
  key: string;
  value: string;
  headers?: Record<string, number[]>[];
};

export type KafkaRecordsByTopicAndPartition = Record<string, KafkaRecord[]>;

export type KafkaEvent = {
  eventSource: "SelfManagedKafka";
  records: KafkaRecordsByTopicAndPartition;
};
