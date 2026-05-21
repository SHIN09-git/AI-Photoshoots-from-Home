import { DEFAULT_USER_ID, getStore } from "@/server/data/store";
import type { GeneratedImage } from "@/types/studio";

export function listGeneratedImages(userId = DEFAULT_USER_ID): GeneratedImage[] {
  return getStore().images.filter((image) => image.userId === userId && !image.deletedAt);
}

export function getGeneratedImage(imageId: string, userId = DEFAULT_USER_ID): GeneratedImage | undefined {
  return getStore().images.find((image) => image.id === imageId && image.userId === userId && !image.deletedAt);
}

export function setFavorite(imageId: string, isFavorite: boolean, userId = DEFAULT_USER_ID): GeneratedImage | undefined {
  const image = getGeneratedImage(imageId, userId);
  if (!image) return undefined;
  image.isFavorite = isFavorite;
  return image;
}

export function softDeleteGeneratedImage(imageId: string, userId = DEFAULT_USER_ID): boolean {
  const image = getGeneratedImage(imageId, userId);
  if (!image) return false;
  image.deletedAt = new Date().toISOString();
  return true;
}
