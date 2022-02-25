import { ResourcePrefix } from "./constants";
export const consumerResources = (
  resource_prefix: ResourcePrefix,
  stage: string = "poc"
) => {
  const suffix = stage.toLowerCase();
  const resources = {};
  //sns topic
  resources[resource_prefix + "SNSTopic"] = {
    Type: "AWS::SNS::Topic",
    Properties: {
      ContentBasedDeduplication: true,
      DisplayName: `${resource_prefix.toLowerCase()}-topic-${suffix}.fifo`,
      FifoTopic: true,
      Tags: [
        {
          Key: "Name",
          Value: `${resource_prefix.toLowerCase()}-topic-${suffix}.fifo`,
        },
      ],
      TopicName: `${resource_prefix.toLowerCase()}-topic-${suffix}.fifo`,
    },
  };

  // fifo sqs
  resources[resource_prefix + "FifoSQS"] = {
    Type: "AWS::SQS::Queue",
    Properties: {
      QueueName: `${resource_prefix.toLowerCase()}-sqs-${suffix}.fifo`,
      FifoQueue: true,
      VisibilityTimeout: 180,
      RedrivePolicy: {
        deadLetterTargetArn: { "Fn::GetAtt": [resource_prefix + "DLQ", "Arn"] },
        maxReceiveCount: 3,
      },
      Tags: [
        {
          Key: "Name",
          Value: `${resource_prefix.toLowerCase()}-sqs-${suffix}`,
        },
      ],
    },
  };

  // dlq
  resources[resource_prefix + "DLQ"] = {
    Type: "AWS::SQS::Queue",
    Properties: {
      QueueName: `${resource_prefix.toLowerCase()}-dlq-${suffix}.fifo`,
      FifoQueue: true,
      VisibilityTimeout: 160,
      Tags: [
        {
          Key: "Name",
          Value: `${resource_prefix.toLowerCase()}-dlq-${suffix}`,
        },
      ],
    },
  };

  // sns subscription
  resources[resource_prefix + "SNSSubscription"] = {
    Type: "AWS::SNS::Subscription",
    Properties: {
      TopicArn: {
        Ref: resource_prefix + "SNSTopic",
      },
      Endpoint: { "Fn::GetAtt": [resource_prefix + "FifoSQS", "Arn"] },
      Protocol: "sqs",
      RawMessageDelivery: true,
      RedrivePolicy: {
        deadLetterTargetArn: { "Fn::GetAtt": [resource_prefix + "DLQ", "Arn"] },
      },
    },
  };

  // sqs policy
  resources[resource_prefix + "FifoSQSPolicy"] = {
    Type: "AWS::SQS::QueuePolicy",
    Properties: {
      Queues: [{ Ref: resource_prefix + "FifoSQS" }],
      PolicyDocument: {
        Id: "AllowSQSIncomingAccess",
        Statement: {
          Effect: "Allow",
          Principal: "*",
          Action: ["sqs:SendMessage", "sqs:ReceiveMessage"],
          Resource: { "Fn::GetAtt": [resource_prefix + "FifoSQS", "Arn"] },
          Condition: {
            ArnEquals: {
              "aws:SourceArn": { Ref: resource_prefix + "SNSTopic" },
            },
          },
        },
      },
    },
  };

  // dlq policy
  resources[resource_prefix + "DLQSPolicy"] = {
    Type: "AWS::SQS::QueuePolicy",
    Properties: {
      Queues: [{ Ref: resource_prefix + "DLQ" }],
      PolicyDocument: {
        Id: "AllowDLQIncomingAccess",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["sqs:SendMessage", "sqs:ReceiveMessage"],
            Resource: { "Fn::GetAtt": [resource_prefix + "DLQ", "Arn"] },
            Condition: {
              ArnEquals: {
                "aws:SourceArn": {
                  "Fn::GetAtt": [resource_prefix + "FifoSQS", "Arn"],
                },
              },
            },
          },
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["sqs:SendMessage", "sqs:ReceiveMessage"],
            Resource: { "Fn::GetAtt": [resource_prefix + "DLQ", "Arn"] },
            Condition: {
              ArnEquals: {
                "aws:SourceArn": { Ref: resource_prefix + "SNSTopic" },
              },
            },
          },
        ],
      },
    },
  };

  // fifo sqs alarm
  resources[resource_prefix + "SQSCloudWatchAlarm"] = {
    Type: "AWS::CloudWatch::Alarm",
    Properties: {
      AlarmName: `${resource_prefix}-FifoSQS-AgeOfOldestMessage-${suffix}`,
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
      AlarmName: `${resource_prefix}-DLQ-ApproximateNumberOfMessagesVisible-${suffix}`,
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

  //sns topic
  outputs[resource_prefix + "SNSTopicArn"] = {
    Value: {
      "Fn::GetAtt": [resource_prefix + "SNSTopic", "TopicName"],
    },
  };

  // q
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
