import type { AWS } from "@serverless/typescript";
import { kafkaConsumer } from "@functions/kafka-consumer";

const serverlessConfiguration: AWS = {
  service: "kafka-consumer",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-stack-output",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: { kafkaConsumer },
  package: { individually: true },
  custom: {
    stage: "${opt:stage, 'dev'}",
    stack: "${self.service}-${self:custom.stage}",
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
  },
};

module.exports = serverlessConfiguration;
