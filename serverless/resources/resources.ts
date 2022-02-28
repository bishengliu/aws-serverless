import { lambdaVPCSecurityGroupResource } from "./lambda-vpc-securitygroup";
import { parameterResources } from "./parameters";
import { consumerResources } from "./consumer-resources";
import { ResourcePrefix } from "../constants";
import { docdbResources } from "./docdb";

export const resources = (stage: string) => {
  const docdb = docdbResources(stage);
  const biochemicalStack = consumerResources(ResourcePrefix.BIOCHEMICAL, stage);
  return {
    Parameters: {
      ...parameterResources(),
    },
    Resources: {
      ...lambdaVPCSecurityGroupResource, // lambda sg inside vpc
      ...docdb.resources,
      ...biochemicalStack.resources,
    },
    Outputs: {
      ...docdb.outputs,
      ...biochemicalStack.outputs,
    },
  };
};
