import { prisma } from "@/lib/prisma";
import { composePrompt } from "@/lib/prompt/composePrompt";
import { getImageProvider } from "@/lib/providers";
import { getStorageProvider } from "@/lib/storage";
import { getJobRuns } from "@/server/data/store";
import { createAsset } from "@/server/services/assetService";
import { getTemplate } from "@/server/services/templateService";
import type { GenerationSettings, PromptMatrixItem } from "@/types/studio";

export function enqueueGenerationJob(jobId: string): void {
  const runs = getJobRuns();
  if (runs.has(jobId)) return;
  const run = runGenerationJob(jobId).finally(() => {
    runs.delete(jobId);
  });
  runs.set(jobId, run);
}

async function runGenerationJob(jobId: string): Promise<void> {
  const job = await prisma.generationJob.findUnique({ where: { id: jobId } });
  if (!job || job.status === "CANCELED") return;

  await prisma.generationJob.update({
    where: { id: jobId },
    data: { status: "RUNNING", startedAt: new Date() }
  });

  const template = await getTemplate(job.templateId);
  if (!template) {
    await failJob(jobId, "Template not found");
    return;
  }

  const provider = getImageProvider();
  const storage = getStorageProvider();
  const referenceIds = job.referenceAssetIds as string[];
  const referenceAssets = await prisma.asset.findMany({
    where: { id: { in: referenceIds }, userId: job.userId, deletedAt: null }
  });
  const promptMatrix = job.promptMatrix as PromptMatrixItem[];

  for (const variables of promptMatrix) {
    const latest = await prisma.generationJob.findUnique({ where: { id: jobId } });
    if (!latest || latest.status === "CANCELED") return;

    try {
      const composed = composePrompt({ template, variables, settings: job.settings as GenerationSettings });
      const referenceImages = await Promise.all(referenceAssets.map(async (asset) => {
        const object = await storage.getObject(asset.storageKey);
        return {
          url: asset.url,
          buffer: object.buffer,
          filename: asset.storageKey.split("/").at(-1),
          mimeType: asset.mimeType
        };
      }));

      const [result] = await provider.generate({
        referenceImages,
        prompt: composed.prompt,
        negativePrompt: composed.negativePrompt,
        settings: job.settings as GenerationSettings,
        width: 1024,
        height: 1536,
        metadata: {
          templateName: template.name,
          variables
        }
      });

      const stored = await storage.putObject({
        buffer: result.buffer,
        mimeType: result.mimeType,
        prefix: "generated",
        filename: `generated-${result.seed ?? crypto.randomUUID()}.${extensionFromMime(result.mimeType)}`
      });

      const asset = await createAsset({
        userId: job.userId,
        type: "GENERATED_IMAGE",
        ...stored
      });

      await prisma.generatedImage.create({
        data: {
          userId: job.userId,
          jobId,
          assetId: asset.id,
          prompt: composed.prompt,
          negativePrompt: composed.negativePrompt,
          variables,
          provider: result.provider ?? provider.id,
          providerModel: result.model ?? provider.model,
          providerMetadata: result.metadata ?? result.providerRaw ?? undefined,
          seed: result.seed,
          width: result.width,
          height: result.height
        }
      });

      await prisma.generationJob.update({
        where: { id: jobId },
        data: { completedCount: { increment: 1 } }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown generation error";
      await prisma.generationJob.update({
        where: { id: jobId },
        data: {
          failedCount: { increment: 1 },
          errorMessage: message,
          providerError: message
        }
      });
    }
  }

  const finalJob = await prisma.generationJob.findUnique({ where: { id: jobId } });
  if (!finalJob) return;

  await prisma.generationJob.update({
    where: { id: jobId },
    data: {
      status: finalJob.completedCount > 0 ? "SUCCEEDED" : "FAILED",
      completedAt: new Date()
    }
  });
}

async function failJob(jobId: string, message: string): Promise<void> {
  await prisma.generationJob.update({
    where: { id: jobId },
    data: {
      status: "FAILED",
      errorMessage: message,
      providerError: message,
      completedAt: new Date()
    }
  });
}

function extensionFromMime(mimeType: string): string {
  return mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1]?.replace("svg+xml", "svg") ?? "bin";
}
