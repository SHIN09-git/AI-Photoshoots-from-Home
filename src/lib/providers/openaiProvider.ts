import type { GenerateImageInput, GeneratedImageResult, ImageGenerationProvider } from "@/lib/providers/types";

export class OpenAIImageProvider implements ImageGenerationProvider {
  id = "openai";
  model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";

  async healthCheck(): Promise<boolean> {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  async generate(input: GenerateImageInput): Promise<GeneratedImageResult[]> {
    void input;
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required when IMAGE_PROVIDER=openai");
    }

    throw new Error("OpenAI image provider adapter is isolated for production integration; use IMAGE_PROVIDER=mock for local MVP.");
  }
}
