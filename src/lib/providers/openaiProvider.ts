import OpenAI, { toFile } from "openai";
import type { GenerateImageInput, GeneratedImageResult, ImageGenerationProvider } from "@/lib/providers/types";

const DEFAULT_SIZE = "1024x1536";
const DEFAULT_FORMAT = "png";

export class OpenAIImageProvider implements ImageGenerationProvider {
  id = "openai";
  model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

  async healthCheck(): Promise<boolean> {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  async generate(input: GenerateImageInput): Promise<GeneratedImageResult[]> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required when IMAGE_PROVIDER=openai");
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = buildProviderPrompt(input);
    const size = process.env.OPENAI_IMAGE_SIZE || DEFAULT_SIZE;
    const outputFormat = process.env.OPENAI_IMAGE_OUTPUT_FORMAT || DEFAULT_FORMAT;
    const n = Math.max(1, Math.min(input.count ?? 1, 10));

    const response = input.referenceImages.length
      ? await client.images.edit({
        model: this.model,
        image: await Promise.all(input.referenceImages.slice(0, 16).map((image, index) => toFile(
          image.buffer ?? Buffer.from([]),
          image.filename ?? `reference-${index + 1}.${extensionFor(image.mimeType)}`,
          { type: image.mimeType }
        ))),
        prompt,
        n,
        size,
        output_format: outputFormat as "png" | "jpeg" | "webp",
        quality: "auto",
        input_fidelity: input.settings?.identityStrength === "strong" ? "high" : "low"
      })
      : await client.images.generate({
        model: this.model,
        prompt,
        n,
        size,
        output_format: outputFormat as "png" | "jpeg" | "webp",
        quality: "auto"
      });

    const images = await Promise.all((response.data ?? []).map(async (image, index) => {
      const buffer = image.b64_json
        ? Buffer.from(image.b64_json, "base64")
        : await fetchImageBuffer(image.url);
      const seed = input.seed ? `${input.seed}-${index + 1}` : undefined;
      return {
        buffer,
        mimeType: mimeTypeFor(outputFormat),
        width: input.width,
        height: input.height,
        seed,
        provider: this.id,
        model: this.model,
        metadata: {
          revisedPrompt: image.revised_prompt,
          size,
          outputFormat,
          referenceImageCount: input.referenceImages.length
        },
        providerRaw: {
          revisedPrompt: image.revised_prompt
        }
      } satisfies GeneratedImageResult;
    }));

    if (!images.length) {
      throw new Error("OpenAI image provider returned no images");
    }
    return images;
  }
}

function buildProviderPrompt(input: GenerateImageInput): string {
  const parts = [
    input.prompt,
    input.settings ? `Settings: identity strength ${input.settings.identityStrength}; location consistency ${input.settings.locationConsistency}; creativity ${input.settings.creativity}.` : undefined,
    input.settings?.customNote ? `User note: ${input.settings.customNote}` : undefined,
    input.negativePrompt ? `Avoid: ${input.negativePrompt}` : undefined
  ];
  return parts.filter(Boolean).join("\n\n");
}

async function fetchImageBuffer(url?: string): Promise<Buffer> {
  if (!url) throw new Error("OpenAI image response did not include b64_json or url");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch generated image: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

function extensionFor(mimeType: string): string {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  return "png";
}

function mimeTypeFor(format: string): string {
  if (format === "jpeg") return "image/jpeg";
  if (format === "webp") return "image/webp";
  return "image/png";
}
