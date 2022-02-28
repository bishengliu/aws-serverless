import { Constants } from "./constants";

const iam = {
  role: {
    name: "${self:custom.stack}-role",
    statements: [
      {
        Effect: "Allow",
        Resource:
          "${file(deploy/config/${self:custom.stage}.yml):custom.schemaRegistry.credentials}",
        Action: "secretsmanager:GetSecretValue",
      },
      {
        Effect: "Allow",
        Resource: "*",
        Action: [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeSubnets",
          "ec2:DescribeVpcs",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:PutMetricFilter",
          "logs:PutRetentionPolicy",
        ],
      },
      {
        Effect: "Allow",
        Resource: "*",
        Action: [
          "SNS:Publish",
          "SNS:GetTopicAttributes",
          "SNS:Subscribe",
          "SNS:ListSubscriptionsByTopic",
          "SQS:SendMessage",
          "SQS:ReceiveMessage",
          "SQS:DeleteMessage",
        ],
      },
    ],
  },
};

export const provider = {
  tracing: {
    apiGateway: true,
    lambda: true,
  },
  apiGateway: {
    minimumCompressionSize: 1024,
    shouldStartNameWithService: true,
  },
  environment: {
    LOG_LEVEL: "DEBUG",
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
  },
  stackTags: {
    Environment: "${self:custom.stage}",
    Project: "YETI",
    System: "${self:service}",
    IaC: "serverless",
  },
  vpc: {
    subnetIds: {
      "Fn::Split": [
        ",",
        "${ssm(raw):/terraform/vpc/subnets/private_service_subnets}",
      ],
    },
    securityGroupIds: [
      {
        Ref: Constants.LAMBDA_SECURITYGROUP,
      },
    ],
  },
  vpcEndpointIds: ["${self:custom.vpc.endpoint}"],
  iam: {
    ...iam,
  },
};
