import { DEFAULT_USER_ID, getStore, id, nowIso } from "@/server/data/store";
import type { Asset, AssetType } from "@/types/studio";

export type CreateAssetInput = {
  userId?: string;
  type: AssetType;
  url: string;
  thumbUrl?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  metadata?: Record<string, unknown>;
};

export function createAsset(input: CreateAssetInput): Asset {
  const store = getStore();
  const asset: Asset = {
    id: id("asset"),
    userId: input.userId ?? DEFAULT_USER_ID,
    type: input.type,
    url: input.url,
    thumbUrl: input.thumbUrl,
    mimeType: input.mimeType,
    size: input.size,
    width: input.width,
    height: input.height,
    metadata: input.metadata,
    createdAt: nowIso()
  };
  store.assets.push(asset);
  return asset;
}

export function getAssetsByIds(assetIds: string[], userId = DEFAULT_USER_ID): Asset[] {
  const store = getStore();
  return assetIds
    .map((assetId) => store.assets.find((asset) => asset.id === assetId && asset.userId === userId && !asset.deletedAt))
    .filter((asset): asset is Asset => Boolean(asset));
}
