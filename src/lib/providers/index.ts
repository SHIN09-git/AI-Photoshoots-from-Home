import { MockImageProvider } from "@/lib/providers/mockProvider";
import { OpenAIImageProvider } from "@/lib/providers/openaiProvider";
import type { ImageGenerationProvider } from "@/lib/providers/types";

export function getImageProvider(): ImageGenerationProvider {
  const provider = process.env.IMAGE_PROVIDER ?? "mock";
  if (provider === "openai") return new OpenAIImageProvider();
  return new MockImageProvider();
}
