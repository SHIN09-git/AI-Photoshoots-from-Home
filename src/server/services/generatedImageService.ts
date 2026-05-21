import { prisma } from "@/lib/prisma";
import { DEFAULT_USER_ID } from "@/server/data/store";
import type { GeneratedImage, PromptMatrixItem } from "@/types/studio";

type ImageRecord = {
  id: string;
  userId: string;
  jobId: string;
  assetId: string | null;
  prompt: string;
  negativePrompt: string | null;
  variables: unknown;
  provider: string;
  providerModel: string | null;
  providerMetadata: unknown;
  providerError: string | null;
  seed: string | null;
  width: number | null;
  height: number | null;
  isFavorite: boolean;
  createdAt: Date;
  deletedAt: Date | null;
};

type AssetLookup = Map<string, { url: string }>;

export async function listGeneratedImages(userId = DEFAULT_USER_ID): Promise<GeneratedImage[]> {
  const images = await prisma.generatedImage.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" }
  });
  const assets = await assetsFor(images);
  return images.map((image) => toGeneratedImage(image, assets));
}

export async function getGeneratedImage(imageId: string, userId = DEFAULT_USER_ID): Promise<GeneratedImage | undefined> {
  const image = await prisma.generatedImage.findFirst({
    where: { id: imageId, userId, deletedAt: null }
  });
  if (!image) return undefined;
  const assets = await assetsFor([image]);
  return toGeneratedImage(image, assets);
}

export async function setFavorite(imageId: string, isFavorite: boolean, userId = DEFAULT_USER_ID): Promise<GeneratedImage | undefined> {
  const existing = await prisma.generatedImage.findFirst({ where: { id: imageId, userId, deletedAt: null } });
  if (!existing) return undefined;
  const image = await prisma.generatedImage.update({
    where: { id: imageId },
    data: { isFavorite }
  });
  const assets = await assetsFor([image]);
  return toGeneratedImage(image, assets);
}

export async function softDeleteGeneratedImage(imageId: string, userId = DEFAULT_USER_ID): Promise<boolean> {
  const existing = await prisma.generatedImage.findFirst({ where: { id: imageId, userId, deletedAt: null } });
  if (!existing) return false;
  await prisma.generatedImage.update({
    where: { id: imageId },
    data: { deletedAt: new Date() }
  });
  return true;
}

export async function assetsFor(images: Array<{ assetId: string | null }>): Promise<AssetLookup> {
  const assetIds = images.map((image) => image.assetId).filter((assetId): assetId is string => Boolean(assetId));
  const assets = await prisma.asset.findMany({ where: { id: { in: assetIds } } });
  return new Map(assets.map((asset) => [asset.id, { url: asset.url }]));
}

export function toGeneratedImage(image: ImageRecord, assets: AssetLookup): GeneratedImage {
  return {
    id: image.id,
    userId: image.userId,
    jobId: image.jobId,
    assetId: image.assetId ?? undefined,
    url: image.assetId ? assets.get(image.assetId)?.url ?? "" : "",
    prompt: image.prompt,
    negativePrompt: image.negativePrompt ?? undefined,
    variables: image.variables as PromptMatrixItem,
    provider: image.provider,
    providerModel: image.providerModel ?? undefined,
    providerMetadata: image.providerMetadata as Record<string, unknown> | undefined,
    providerError: image.providerError ?? undefined,
    seed: image.seed ?? undefined,
    width: image.width ?? undefined,
    height: image.height ?? undefined,
    isFavorite: image.isFavorite,
    createdAt: image.createdAt.toISOString(),
    deletedAt: image.deletedAt?.toISOString()
  };
}
