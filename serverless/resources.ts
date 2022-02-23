import { snsFifoResource } from "./sns-resource";
import { consumerResources } from "./consumer-resources";
import rConstants from "./constants";
import { ResourcePrefix } from "./constants";

const biochemicalResources = consumerResources(
  ResourcePrefix.BIOCHEMICAL,
  rConstants.SNSFifoTopicResource
);

const snsResource = snsFifoResource(
  rConstants.SNSFifoTopicResource,
  rConstants.SNSFifoTopicName
);

export const resources = {
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
    ...snsResource,
    ...biochemicalResources.resources,
  },
  Outputs: {
    TargetSNSTopicArn: {
      Value: {
        "Fn::GetAtt": [rConstants.SNSFifoTopicResource, "TopicName"],
      },
    },
    ...biochemicalResources.outputs,
  },
};
