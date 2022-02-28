import { Constants } from "../constants";

export const lambdaVPCSecurityGroupResource = {
  [Constants.LAMBDA_SECURITYGROUP]: {
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
};
