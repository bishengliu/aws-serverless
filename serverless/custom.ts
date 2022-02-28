export const custom = {
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
};
