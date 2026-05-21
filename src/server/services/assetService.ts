import { prisma } from "@/lib/prisma";
import { DEFAULT_USER_ID } from "@/server/data/store";
import type { StoredObject } from "@/lib/storage/types";
import type { Asset, AssetType } from "@/types/studio";

export type CreateAssetInput = StoredObject & {
  userId?: string;
  type: AssetType;
};

export async function ensureDemoUser(userId = DEFAULT_USER_ID): Promise<void> {
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      name: "Demo User"
    }
  });
}

export async function createAsset(input: CreateAssetInput): Promise<Asset> {
  const userId = input.userId ?? DEFAULT_USER_ID;
  await ensureDemoUser(userId);
  const asset = await prisma.asset.create({
    data: {
      userId,
      type: input.type,
      storageKey: input.storageKey,
      url: input.url,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      hash: input.hash,
      width: input.width,
      height: input.height
    }
  });
  return toAsset(asset);
}

export async function getAssetsByIds(assetIds: string[], userId = DEFAULT_USER_ID): Promise<Asset[]> {
  const assets = await prisma.asset.findMany({
    where: {
      id: { in: assetIds },
      userId,
      deletedAt: null
    }
  });
  const byId = new Map(assets.map((asset) => [asset.id, toAsset(asset)]));
  return assetIds.map((assetId) => byId.get(assetId)).filter((asset): asset is Asset => Boolean(asset));
}

export function toAsset(asset: {
  id: string;
  userId: string;
  type: AssetType;
  storageKey: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  hash: string;
  width: number | null;
  height: number | null;
  createdAt: Date;
  deletedAt: Date | null;
}): Asset {
  return {
    id: asset.id,
    userId: asset.userId,
    type: asset.type,
    storageKey: asset.storageKey,
    url: asset.url,
    mimeType: asset.mimeType,
    sizeBytes: asset.sizeBytes,
    hash: asset.hash,
    width: asset.width ?? undefined,
    height: asset.height ?? undefined,
    createdAt: asset.createdAt.toISOString(),
    deletedAt: asset.deletedAt?.toISOString()
  };
}
