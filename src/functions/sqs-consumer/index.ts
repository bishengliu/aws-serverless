import { handlerPath } from "@libs/lambda-utils";
import { ResourcePrefix } from "serverless/constants";

export const sqsConsumerFactory = (resource_prefix: ResourcePrefix) => {
  const sqsConsumer = {
    tags: {
      stage: `sqs-${resource_prefix}-` + "consumer-${self:custom.stage}",
    },
    timeout: 150,
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
      {
        sqs: {
          arn: {
            "Fn::GetAtt": [resource_prefix + "FifoSQS", "Arn"],
          },
          batchSize: 10,
          enabled: true,
          functionResponseType:
            "ReportBatchItemFailures" as "ReportBatchItemFailures",
        },
      },
    ],
    environment: {
      DOCDB_URL: "",
      DOCDB_DB: "",
      DOCDB_USER: "",
      DOCDB_PASSWORD: "",
    },
  };

  return sqsConsumer;
};
