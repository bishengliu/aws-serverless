export const snsFifoResource = (snsResourceName, snsFifoTopicName) => {
  const snsResource = {};
  snsResource[snsResourceName] = {
    Type: "AWS::SNS::Topic",
    Properties: {
      ContentBasedDeduplication: true,
      DisplayName: snsResourceName,
      FifoTopic: true,
      Tags: [{ Key: "Name", Value: snsFifoTopicName }],
      TopicName: snsFifoTopicName,
    },
  };

  return snsResource;
};
