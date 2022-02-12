import { KafkaEvent } from "@libs/kafka.types";
import type { Context } from "aws-lambda";

const handler = async (event: KafkaEvent, context: Context) => {
  // upon success publish to SNS
};

export default handler;
