import type { AWS } from "@serverless/typescript";
import { kafkaConsumer } from "@functions/kafka-consumer";

const serverlessConfiguration: AWS = {
  service: "search",
  variablesResolutionMode: "20210326",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-stack-output",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    timeout: 20,
    memorySize: 256,
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
    lambdaHashingVersion: "20201221",
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
          Ref: "LambdaSecurityGroup",
        },
      ],
    },
    vpcEndpointIds: ["${self:custom.vpc.endpoint}"],
    iam: {
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
              "ec2:DescribeSecurityGroups",
              "ec2:DescribeSubnets",
              "ec2:DescribeVpcs",
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { kafkaConsumer },
  package: { individually: true },
  custom: {
    stage: "${opt:stage, 'poc'}",
    stack: "${self:service}-${self:custom.stage}",
    config: "${file(deploy/config/${self:custom.stage}.yml)}",
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    deploymentBucket: {
      blockPublicAccess: true,
    },
    // # serverless-stack-output
    output: {
      handler: "deploy/output.handler",
      file: ".serverless/stack.json",
    },
    vpc: {
      id: "${ssm:/terraform/vpc_id}",
      endpoint:
        "${ssm:/terraform/${self:custom.vpc.id}/api_gateway_private_api_vpc_endpoint_id}",
    },
  },
  resources: {
    Resources: {
      LambdaSecurityGroup: {
        Type: "AWS::EC2::SecurityGroup",
        Properties: {
          GroupDescription: "Allow open egress to anywhere",
          VpcId: "${self:custom.vpc.id}",
          SecurityGroupEgress: {
            IpProtocol: -1,
            FromPort: 0,
            ToPort: 0,
            CidrIp: "0.0.0.0/0",
          },
          Tags: [{ Key: "Name", Value: "egress-sg" }],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
