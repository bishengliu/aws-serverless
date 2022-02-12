import middy from "@middy/core";

const defaults = {};

const kafkaEventDecodeMiddleware = (opts: Record<string, unknown> = {}) => {
  const options: Record<string, unknown> = { ...defaults, ...opts };

  const kafkaEventDecodeMiddlewareBefore = async (request) => {
    // decode the event
    // attach the decode event to request
  };

  return {
    before: kafkaEventDecodeMiddlewareBefore,
  };
};

export default kafkaEventDecodeMiddleware;
