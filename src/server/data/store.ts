import { seedTemplates } from "@/server/data/seedTemplates";
import type { Asset, GeneratedImage, GenerationJob, StudioTemplate } from "@/types/studio";

export const DEFAULT_USER_ID = "demo_user";

type StudioStore = {
  assets: Asset[];
  templates: StudioTemplate[];
  jobs: GenerationJob[];
  images: GeneratedImage[];
};

type GlobalWithStudio = typeof globalThis & {
  __studioStore?: StudioStore;
  __studioJobRuns?: Map<string, Promise<void>>;
};

const globalStudio = globalThis as GlobalWithStudio;

export function getStore(): StudioStore {
  if (!globalStudio.__studioStore) {
    globalStudio.__studioStore = {
      assets: [],
      templates: structuredClone(seedTemplates),
      jobs: [],
      images: []
    };
  }
  return globalStudio.__studioStore;
}

export function getJobRuns(): Map<string, Promise<void>> {
  if (!globalStudio.__studioJobRuns) {
    globalStudio.__studioJobRuns = new Map();
  }
  return globalStudio.__studioJobRuns;
}

export function id(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomUUID().slice(0, 8)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
