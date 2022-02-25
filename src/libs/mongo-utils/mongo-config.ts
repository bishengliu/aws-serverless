import { MONGO_COLLECTION, ResourcePrefix } from "serverless/constants";
import { CollectionsConfig, ResourceToCollectionPrimaryKeyPair } from "./types";

const {
  ASSET,
  ASSET_COMPONENT,
  ASSET_DEFINITION,
  BIOCHEMICAL,
  COMPONENT,
  PRODUCT_IMAGE,
  REFERENCE,
  STANDARD_PROTEIN,
  TARGET,
  TAXON,
} = MONGO_COLLECTION;

export const resourceToCollectionPrimaryKeyPair: ResourceToCollectionPrimaryKeyPair =
  {
    [ResourcePrefix.COMPONENT]: {
      primaryKeyPath: "component.componentNumber",
      collection: COMPONENT,
    },
    [ResourcePrefix.CORE]: {
      primaryKeyPath: "core.assetDefinitionNumber",
      collection: ASSET_DEFINITION,
    },
    [ResourcePrefix.SCIENTIFIC]: {
      primaryKeyPath: "scientific.assetDefinitionNumber",
      collection: ASSET_DEFINITION,
    },
    [ResourcePrefix.QUALITY_SCORE]: {
      primaryKeyPath: "qualityScore.assetDefinitionNumber",
      collection: ASSET_DEFINITION,
    },
    [ResourcePrefix.PRODUCT_IMAGE]: {
      primaryKeyPath: "productImage.imageNumber",
      collection: PRODUCT_IMAGE,
    },
    [ResourcePrefix.IMAGE_QUALITY_SCORE]: {
      primaryKeyPath: "imageQualityScore.productImageNumber",
      collection: PRODUCT_IMAGE,
    },
    [ResourcePrefix.REFERENCE]: {
      primaryKeyPath: "reference.referenceNumber",
      collection: REFERENCE,
    },
    [ResourcePrefix.ASSET_COMPONENT]: {
      primaryKeyPath: "assetComponent.assetComponentNumber",
      collection: ASSET_COMPONENT,
    },
    [ResourcePrefix.ASSET]: {
      primaryKeyPath: "asset.assetNumber",
      collection: ASSET,
    },
    [ResourcePrefix.BIOCHEMICAL]: {
      primaryKeyPath: "biochemical.biochemicalNumber",
      collection: BIOCHEMICAL,
    },
    [ResourcePrefix.TARGET]: {
      primaryKeyPath: "target.targetNumber",
      collection: TARGET,
    },
    [ResourcePrefix.STANDARD_PROTEIN]: {
      primaryKeyPath: "standardProtein.standardProteinNumber",
      collection: STANDARD_PROTEIN,
    },
    [ResourcePrefix.TAXON]: {
      primaryKeyPath: "taxon.taxonNumber",
      collection: TAXON,
    },
    [ResourcePrefix.ASSET_DEFINITION]: undefined,
  };

export const collectionsConfig: CollectionsConfig = {
  [COMPONENT]: {
    // contains: component
    primaryKeyName: "componentNumber",
    version: 1,
  },
  [ASSET_DEFINITION]: {
    // contains: core, scientific, quality-score
    primaryKeyName: "assetDefinitionNumber",
    secondaryIndices: [
      {
        indexSpec: { "core.primaryTarget.targetNumber": 1 },
        indexName: "byTargetNumber",
      },
    ],
    publishDataChanged: true,
    version: 1,
  },
  [PRODUCT_IMAGE]: {
    // contains: product-image, image-quality-score
    primaryKeyName: "productImageNumber",
    secondaryIndices: [
      {
        indexSpec: { "productImage.imageUsage.assetDefinitionNumber": 1 },
        indexName: "byAssetDefinition",
      },
    ],
    publishDataChanged: true,
    version: 1,
  },
  [REFERENCE]: {
    // contains: reference
    primaryKeyName: "referenceNumber",
    secondaryIndices: [
      {
        indexSpec: { "reference.assetDefinition": 1 },
        indexName: "byAssetDefinition",
      },
    ],
    publishDataChanged: true,
    version: 1,
  },
  [ASSET_COMPONENT]: {
    // contains: asset-component
    primaryKeyName: "assetComponentNumber",
    version: 1,
  },
  [ASSET]: {
    // contains: asset
    primaryKeyName: "assetNumber",
    secondaryIndices: [
      {
        indexSpec: { "asset.parentAssetDefinition": 1 },
        indexName: "byAssetDefinition",
      },
    ],
    publishDataChanged: true,
    version: 1,
  },
  [BIOCHEMICAL]: {
    // contains: biochemical
    primaryKeyName: "biochemicalNumber",
    version: 1,
  },
  [TARGET]: {
    // contains: target
    primaryKeyName: "targetNumber",
    publishDataChanged: true,
    version: 1,
  },
  [STANDARD_PROTEIN]: {
    // contains: standard-protein
    primaryKeyName: "standardProteinNumber",
    version: 1,
  },
  [TAXON]: {
    // contains: taxon
    primaryKeyName: "taxonNumber",
    version: 1,
  },
};
