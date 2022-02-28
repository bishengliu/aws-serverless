import type { AWS } from "@serverless/typescript";
import { resources } from "./serverless/resources/resources";
import { functions } from "./serverless/functions";
import { Constants } from "serverless/constants";
import { custom } from "./serverless/custom";
import { provider } from "./serverless/provider";

const serverlessConfiguration: AWS = {
  service: Constants.SERVICE_NAME.toLowerCase(),
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
    lambdaHashingVersion: "20201221",
    ...provider,
  },
  // import the function via paths
  functions: { ...functions },
  package: { individually: true },
  custom: {
    ...custom,
  },
  resources: {
    ...resources("${self:custom.stage}"),
  },
};

module.exports = serverlessConfiguration;
