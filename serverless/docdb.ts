import { Constants } from "./constants";

export const docdbResources = (serviceName: string, stage: string) => {
  const resources = {};
  const prefix = serviceName.toLowerCase();
  const suffix = stage.toLowerCase();
  // cluster
  resources[prefix + "-docdb-cluster-" + suffix] = {
    Type: "AWS::DocDB::DBCluster",
    Properties: {
      BackupRetentionPeriod: 8,
      DBClusterIdentifier: prefix + "-docdb-cluster-" + suffix,
      DBClusterParameterGroupName: {
        Ref: prefix + "-docdb-cluster-parameter-group-" + suffix,
      },
      DBSubnetGroupName: {
        Ref: prefix + "-docdb-subnet-group-" + suffix,
      },
      StorageEncrypted: true,
      Port: "27017",
      MasterUsername: "", //todo
      MasterUserPassword: "", //todo
      VpcSecurityGroupIds: [], // todo ec2 sg ids
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };

  // parameter group
  resources[prefix + "-docdb-cluster-parameter-group-" + suffix] = {
    Type: "AWS::DocDB::DBClusterParameterGroup",
    Properties: {
      Description: prefix + "-docdb-cluster-parameter-group-" + suffix,
      Family: "docdb4.0",
      Name: prefix + "-docdb-cluster-parameter-group-" + suffix,
      Parameters: [
        { audit_logs: "disabled" },
        { tls: "enabled" },
        { ttl_monitor: "enabled" },
      ],
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };

  // subnet group
  resources[prefix + "-docdb-subnet-group-" + suffix] = {
    Type: "AWS::DocDB::DBSubnetGroup",
    Properties: {
      DBSubnetGroupName: prefix + "-docdb-subnet-group-" + suffix,
      SubnetIds: [], //todo get the private subnets
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };

  // ec2 security group

  // generate username and password and save to ssm

  // retrieve private subnet from ssm

  // instances
  resources[prefix + "-docdb-instance0-" + suffix] = {
    Type: "AWS::DocDB::DBInstance",
    Properties: {
      DBClusterIdentifier: {
        "Fn::GetAtt": [
          prefix + "-docdb-cluster-" + suffix,
          "ClusterResourceId",
        ],
      },
      DBInstanceClass: "db.r5.2xlarge",
      DBInstanceIdentifier: prefix + "-docdb-cluster-instances-0",
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };

  resources[prefix + "-docdb-instance1-" + suffix] = {
    Type: "AWS::DocDB::DBInstance",
    Properties: {
      DBClusterIdentifier: {
        "Fn::GetAtt": [
          prefix + "-docdb-cluster-" + suffix,
          "ClusterResourceId",
        ],
      },
      DBInstanceClass: "db.r5.2xlarge",
      DBInstanceIdentifier: prefix + "-docdb-cluster-instances-1",
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };

  resources[prefix + "-docdb-instance2-" + suffix] = {
    Type: "AWS::DocDB::DBInstance",
    Properties: {
      DBClusterIdentifier: {
        "Fn::GetAtt": [
          prefix + "-docdb-cluster-" + suffix,
          "ClusterResourceId",
        ],
      },
      DBInstanceClass: "db.r5.2xlarge",
      DBInstanceIdentifier: prefix + "-docdb-cluster-instances-2",
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };

  // outputs
  const outputs = {};

  return {
    resources,
    outputs,
  };
};
