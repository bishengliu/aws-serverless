import { parameterResources } from "./parameters";
import { consumerResources } from "./consumer-resources";
import { ResourcePrefix } from "./constants";
import { docdbResources } from "./docdb";

export const resources = (stage: string) => {
  const docdb = docdbResources(stage);
  const biochemicalStack = consumerResources(ResourcePrefix.BIOCHEMICAL, stage);
  return {
    Parameters: {
      ...parameterResources(),
    },
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
      ...docdb.resources,
      ...biochemicalStack.resources,
    },
    Outputs: {
      ...docdb.outputs,
      ...biochemicalStack.outputs,
    },
  };
};
