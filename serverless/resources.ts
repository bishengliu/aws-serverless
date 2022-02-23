import { consumerResources } from "./consumer-resources";
import { ResourcePrefix } from "./constants";

const biochemicalStack = consumerResources(ResourcePrefix.BIOCHEMICAL);

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
    ...biochemicalStack.resources,
  },
  Outputs: {
    ...biochemicalStack.outputs,
  },
};
