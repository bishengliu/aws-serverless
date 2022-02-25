export enum MONGO_COLLECTION {
  ASSET = "asset",
  ASSET_COMPONENT = "assetComponent",
  ASSET_DEFINITION = "assetDefinition",
  BIOCHEMICAL = "biochemical",
  COMPONENT = "component",
  PRODUCT_IMAGE = "productImage",
  REFERENCE = "reference",
  STANDARD_PROTEIN = "standardProtein",
  TARGET = "target",
  TAXON = "taxon",
}

export enum ResourcePrefix {
  ASSET = "asset",
  ASSET_COMPONENT = "assetComponent",
  ASSET_DEFINITION = "assetDefinition",
  BIOCHEMICAL = "biochemical",
  COMPONENT = "component",
  PRODUCT_IMAGE = "productImage",
  REFERENCE = "reference",
  STANDARD_PROTEIN = "standardProtein",
  TARGET = "target",
  TAXON = "taxon",

  CORE = "core",
  SCIENTIFIC = "scientific",
  QUALITY_SCORE = "qualityScore",
  IMAGE_QUALITY_SCORE = "image_quality_score",
}

export const Constants = {
  SERVICE_NAME: "search-ephemeral",
  DOCDB_ADMIN_USERNAME: "docdb_admin",
};
