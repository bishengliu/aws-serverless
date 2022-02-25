import { ResourcePrefix } from "serverless/constants";
import { CollectionsConfig, TopicToCollectionPrimaryKeyPair } from "./types";

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
} = ResourcePrefix;

export const topicToCollectionPrimaryKeyPair: TopicToCollectionPrimaryKeyPair =
  {
    "product.asset_definition.component": {
      primaryKeyPath: "component.componentNumber",
      collection: COMPONENT,
    },
    "product.asset_definition.core": {
      primaryKeyPath: "core.assetDefinitionNumber",
      collection: ASSET_DEFINITION,
    },
    "product.asset_definition.scientific": {
      primaryKeyPath: "scientific.assetDefinitionNumber",
      collection: ASSET_DEFINITION,
    },
    "product.asset_definition.quality_score": {
      primaryKeyPath: "qualityScore.assetDefinitionNumber",
      collection: ASSET_DEFINITION,
    },
    "product.asset_definition.product_image": {
      primaryKeyPath: "productImage.imageNumber",
      collection: PRODUCT_IMAGE,
    },
    "product.asset_definition.image_quality_score": {
      primaryKeyPath: "imageQualityScore.productImageNumber",
      collection: PRODUCT_IMAGE,
    },
    "product.asset_definition.reference": {
      primaryKeyPath: "reference.referenceNumber",
      collection: REFERENCE,
    },
    "product.asset.asset_component": {
      primaryKeyPath: "assetComponent.assetComponentNumber",
      collection: ASSET_COMPONENT,
    },
    "product.asset.asset": {
      primaryKeyPath: "asset.assetNumber",
      collection: ASSET,
    },
    "target.biochemical": {
      primaryKeyPath: "biochemical.biochemicalNumber",
      collection: BIOCHEMICAL,
    },
    "target.target": {
      primaryKeyPath: "target.targetNumber",
      collection: TARGET,
    },
    "target.standard_protein": {
      primaryKeyPath: "standardProtein.standardProteinNumber",
      collection: STANDARD_PROTEIN,
    },
    "target.taxon": {
      primaryKeyPath: "taxon.taxonNumber",
      collection: TAXON,
    },
  };

export const collectionsConfig: CollectionsConfig = {
  component: {
    // contains: component
    primaryKeyName: "componentNumber",
    version: 1,
  },
  assetDefinition: {
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
  productImage: {
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
  reference: {
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
  assetComponent: {
    // contains: asset-component
    primaryKeyName: "assetComponentNumber",
    version: 1,
  },
  asset: {
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
  biochemical: {
    // contains: biochemical
    primaryKeyName: "biochemicalNumber",
    version: 1,
  },
  target: {
    // contains: target
    primaryKeyName: "targetNumber",
    publishDataChanged: true,
    version: 1,
  },
  standardProtein: {
    // contains: standard-protein
    primaryKeyName: "standardProteinNumber",
    version: 1,
  },
  taxon: {
    // contains: taxon
    primaryKeyName: "taxonNumber",
    version: 1,
  },
};
