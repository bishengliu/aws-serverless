import { ResourcePrefix } from "./constants";
export const consumerResources = (
  resource_prefix: ResourcePrefix,
  SNSTopicResource: string
) => {
  const resources = {};

  // fifo sqs
  resources[resource_prefix + "FifoSQS"] = {
    Type: "AWS::SQS::Queue",
    Properties: {
      QueueName: `${resource_prefix.toLowerCase()}.fifo`,
      FifoQueue: true,
      VisibilityTimeout: 180,
      RedrivePolicy: {
        deadLetterTargetArn: { "Fn::GetAtt": [resource_prefix + "DLQ", "Arn"] },
        maxReceiveCount: 3,
      },
      Tags: [{ Key: "Name", Value: `${resource_prefix.toLowerCase()}` }],
    },
  };

  // sqs policy
  resources[resource_prefix + "FifoSQSPolicy"] = {
    Type: "AWS::SQS::QueuePolicy",
    Properties: {
      Queues: [{ Ref: resource_prefix + "FifoSQS" }],
      PolicyDocument: {
        Id: "AllowIncomingAccess",
        Statement: {
          Effect: "Allow",
          Principal: "*",
          Action: ["sqs:SendMessage"],
          Condition: {
            ArnEquals: {
              "aws:SourceArn": { Ref: SNSTopicResource },
            },
          },
        },
      },
    },
  };

  // dlq
  resources[resource_prefix + "DLQ"] = {
    Type: "AWS::SQS::Queue",
    Properties: {
      QueueName: `${resource_prefix.toLowerCase()}-dlq.fifo`,
      FifoQueue: true,
      VisibilityTimeout: 160,
      Tags: [{ Key: "Name", Value: `${resource_prefix.toLowerCase()}-dlq` }],
    },
  };

  // sns subscription
  resources[resource_prefix + "SNSSubscription"] = {
    Type: "AWS::SNS::Subscription",
    Properties: {
      TopicArn: {
        Ref: SNSTopicResource,
      },
      Endpoint: { "Fn::GetAtt": [resource_prefix + "FifoSQS", "Arn"] },
      Protocol: "sqs",
      RawMessageDelivery: true,
    },
  };

  // fifo sqs alarm
  resources[resource_prefix + "SQSCloudWatchAlarm"] = {
    Type: "AWS::CloudWatch::Alarm",
    Properties: {
      AlarmName: `${resource_prefix} + FifoSQS_AgeOfOldestMessage`,
      AlarmDescription: `Alarms if the ${resource_prefix} SQS Queue has messages in it for too long`,
      ComparisonOperator: "GreaterThanThreshold",
      Dimensions: [
        {
          Name: "QueueName",
          Value: {
            "Fn::GetAtt": [resource_prefix + "FifoSQS", "QueueName"],
          },
        },
      ],
      DatapointsToAlarm: 2,
      EvaluationPeriods: 3,
      MetricName: "ApproximateAgeOfOldestMessage",
      Namespace: "AWS/SQS",
      Period: 300,
      Statistic: "Maximum",
      Threshold: 30,
      TreatMissingData: "notBreaching",
      Unit: "Seconds",
    },
  };

  // dlq ApproximateNumberOfMessagesVisible alarm
  resources[resource_prefix + "DLQApproximateNumberOfMessagesVisible"] = {
    Type: "AWS::CloudWatch::Alarm",
    Properties: {
      AlarmName: `${resource_prefix}DLQ_ApproximateNumberOfMessagesVisible`,
      AlarmDescription: `Alarms if the ${resource_prefix} DLQ has too many messages`,
      ComparisonOperator: "GreaterThanThreshold",
      Dimensions: [
        {
          Name: "QueueName",
          Value: {
            "Fn::GetAtt": [resource_prefix + "DLQ", "QueueName"],
          },
        },
      ],
      DatapointsToAlarm: 2,
      EvaluationPeriods: 3,
      MetricName: "ApproximateNumberOfMessagesVisible",
      Namespace: "AWS/SQS",
      Period: 300,
      Statistic: "Maximum",
      Threshold: 1,
      TreatMissingData: "notBreaching",
    },
  };

  // outputs
  const outputs = {};
  outputs[resource_prefix + "FifoSQSArn"] = {
    Value: {
      "Fn::GetAtt": [resource_prefix + "FifoSQS", "QueueName"],
    },
  };

  return {
    resources,
    outputs,
  };
};
