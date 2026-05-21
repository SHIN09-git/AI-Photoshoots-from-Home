import type { GenerationSettings } from "@/types/studio";
import type { PromptMatrixItem } from "@/types/studio";

export type GenerateImageInput = {
  referenceImages: Array<{
    url: string;
    buffer?: Buffer;
    filename?: string;
    mimeType: string;
  }>;
  prompt: string;
  negativePrompt?: string;
  settings?: GenerationSettings;
  width?: number;
  height?: number;
  count?: number;
  seed?: string;
  metadata?: {
    templateName?: string;
    variables?: PromptMatrixItem;
    [key: string]: unknown;
  };
};

export type GeneratedImageResult = {
  buffer: Buffer;
  mimeType: string;
  width?: number;
  height?: number;
  seed?: string;
  providerRaw?: unknown;
  provider?: string;
  model?: string;
  metadata?: Record<string, unknown>;
};

export type ImageGenerationProvider = {
  id: string;
  model: string;
  generate(input: GenerateImageInput): Promise<GeneratedImageResult[]>;
  edit?(input: GenerateImageInput): Promise<GeneratedImageResult[]>;
  healthCheck(): Promise<boolean>;
};
