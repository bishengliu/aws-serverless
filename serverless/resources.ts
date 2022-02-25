import { parameterResources } from "./parameters";
import { consumerResources } from "./consumer-resources";
import { ResourcePrefix, Constants } from "./constants";
import { docdbResources } from "./docdb";

const docdb = docdbResources(Constants.SERVICE_NAME, "poc");
const biochemicalStack = consumerResources(ResourcePrefix.BIOCHEMICAL);

export const resources = {
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
