import middy from "@middy/core";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logger = require("@dazn/lambda-powertools-logger");

const eventHandler = async () => {};

export const main = middy(eventHandler);
