import { handlerPath } from "@libs/lambda-utils";

export const sqsConsumerFactory = (name: string) => {
  const sqsConsumer = {
    tags: { stage: `sqs-${name}-` + "consumer-${self:custom.stage}" },
    timeout: 300,
  };
  sqsConsumer["handler"] = `${handlerPath(__dirname)}/handler.main`;

  sqsConsumer["events"] = [];

  sqsConsumer["environment"] = () => ({});

  return sqsConsumer;
};
