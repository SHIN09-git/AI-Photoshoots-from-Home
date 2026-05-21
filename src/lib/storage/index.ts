import { LocalStorageProvider } from "@/lib/storage/localStorageProvider";
import type { StorageProvider } from "@/lib/storage/types";

export function getStorageProvider(): StorageProvider {
  return new LocalStorageProvider();
}
