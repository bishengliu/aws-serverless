import { Constants } from "../constants";
export const docdbResources = (stage: string) => {
  const resources = {};
  const prefix = Constants.SERVICE_NAME.toLowerCase();
  const suffix = stage.toLowerCase();
  const admin_user = Constants.DOCDB_ADMIN_USERNAME;
  // cluster
  resources["DocdbCluster"] = {
    Type: "AWS::DocDB::DBCluster",
    Properties: {
      BackupRetentionPeriod: 8,
      DBClusterIdentifier: prefix + "-docdb-cluster-" + suffix,
      DBClusterParameterGroupName: {
        Ref: "DocdbClusterParameterGroup",
      },
      DBSubnetGroupName: {
        Ref: "DocdbSubnets",
      },
      StorageEncrypted: true,
      Port: "27017",
      MasterUsername: admin_user,
      MasterUserPassword: {
        "Fn::Join": [
          "",
          [
            "{{resolve:secretsmanager:",
            { Ref: "DocdbCredentials" },
            ":SecretString:password}}",
          ],
        ],
      },
      VpcSecurityGroupIds: [{ Ref: "DocdbSecurityGroup" }],
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };

  // parameter group
  resources["DocdbClusterParameterGroup"] = {
    Type: "AWS::DocDB::DBClusterParameterGroup",
    Properties: {
      Description: prefix + "-docdb-cluster-parameter-group-" + suffix,
      Family: "docdb4.0",
      Name: prefix + "-docdb-cluster-parameter-group-" + suffix,
      Parameters: {
        audit_logs: "disabled",
        tls: "enabled",
        ttl_monitor: "enabled",
      },
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };

  // subnet group
  resources["DocdbSubnets"] = {
    Type: "AWS::DocDB::DBSubnetGroup",
    Properties: {
      DBSubnetGroupDescription: prefix + "-docdb-subnet-group-" + suffix,
      DBSubnetGroupName: prefix + "-docdb-subnet-group-" + suffix,
      SubnetIds: "${ssm:/terraform/vpc/subnets/private_service_subnets}",
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };

  // ec2 security group
  resources["DocdbSecurityGroup"] = {
    Type: "AWS::EC2::SecurityGroup",
    Properties: {
      GroupDescription: prefix + "-docdb-security-group-" + suffix,
      GroupName: prefix + "-docdb-security-group-" + suffix,
      VpcId: "{{resolve:ssm:/terraform/vpc_id}}",
      SecurityGroupIngress: [
        {
          IpProtocol: "tcp",
          FromPort: 27017,
          ToPort: 27017,
          CidrIp: "0.0.0.0/0",
        },
      ],
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };
  // generate username and password and save to ssm
  resources["DocdbCredentials"] = {
    Type: "AWS::SecretsManager::Secret",
    Properties: {
      Name: prefix + "-docdb-credentials-" + suffix,
      Description: "master password for docdb",
      GenerateSecretString: {
        SecretStringTemplate: `{"username":\"${admin_user}\"}`,
        GenerateStringKey: "password",
        PasswordLength: 30,
        ExcludeCharacters: '"@/\\',
      },
      Tags: [
        {
          Key: "System",
          Value: prefix + "-" + suffix,
        },
      ],
    },
  };

  // instances
  resources["DocdbInstance0"] = {
    Type: "AWS::DocDB::DBInstance",
    Properties: {
      DBClusterIdentifier: {
        Ref: "DocdbCluster",
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

  resources["DocdbInstance1"] = {
    Type: "AWS::DocDB::DBInstance",
    Properties: {
      DBClusterIdentifier: {
        Ref: "DocdbCluster",
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

  resources["DocdbInstance2"] = {
    Type: "AWS::DocDB::DBInstance",
    Properties: {
      DBClusterIdentifier: {
        Ref: "DocdbCluster",
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
