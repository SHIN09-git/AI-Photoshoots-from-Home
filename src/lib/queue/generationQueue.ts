import { composePrompt } from "@/lib/prompt/composePrompt";
import { getImageProvider } from "@/lib/providers";
import { getJobRuns, getStore, id, nowIso } from "@/server/data/store";
import { createAsset, getAssetsByIds } from "@/server/services/assetService";
import { getTemplate } from "@/server/services/templateService";
import type { GeneratedImage, GenerationJob } from "@/types/studio";

export function enqueueGenerationJob(jobId: string): void {
  const runs = getJobRuns();
  if (runs.has(jobId)) return;
  const run = runGenerationJob(jobId).finally(() => {
    runs.delete(jobId);
  });
  runs.set(jobId, run);
}

async function runGenerationJob(jobId: string): Promise<void> {
  const store = getStore();
  const job = store.jobs.find((item) => item.id === jobId);
  if (!job || job.status === "CANCELED") return;

  job.status = "RUNNING";
  job.startedAt = nowIso();

  const template = getTemplate(job.templateId);
  if (!template) {
    failJob(job, "Template not found");
    return;
  }

  const provider = getImageProvider();
  const references = getAssetsByIds(job.referenceAssetIds, job.userId);

  for (const variables of job.promptMatrix) {
    const latestJob = store.jobs.find((item) => item.id === jobId);
    if (latestJob?.status === "CANCELED") return;
    await delay(420);

    try {
      const composed = composePrompt({ template, variables, settings: job.settings });
      const [result] = await provider.generate({
        referenceImages: references.map((asset) => ({ url: asset.url, mimeType: asset.mimeType })),
        prompt: composed.prompt,
        negativePrompt: composed.negativePrompt,
        width: 900,
        height: 1125,
        metadata: {
          templateName: template.name,
          variables
        }
      });

      const url = `data:${result.mimeType};base64,${result.buffer.toString("base64")}`;
      const asset = createAsset({
        userId: job.userId,
        type: "GENERATED_IMAGE",
        url,
        thumbUrl: url,
        mimeType: result.mimeType,
        size: result.buffer.byteLength,
        width: result.width,
        height: result.height,
        metadata: {
          jobId: job.id,
          provider: provider.id,
          providerModel: provider.model
        }
      });

      const image: GeneratedImage = {
        id: id("img"),
        userId: job.userId,
        jobId: job.id,
        assetId: asset.id,
        url,
        thumbUrl: url,
        prompt: composed.prompt,
        negativePrompt: composed.negativePrompt,
        variables,
        provider: provider.id,
        providerModel: provider.model,
        seed: result.seed,
        width: result.width,
        height: result.height,
        isFavorite: false,
        createdAt: nowIso()
      };
      store.images.push(image);
    } catch (error) {
      job.errorMessage = error instanceof Error ? error.message : "Unknown generation error";
    }
  }

  const imageCount = store.images.filter((image) => image.jobId === job.id && !image.deletedAt).length;
  job.status = imageCount > 0 ? "SUCCEEDED" : "FAILED";
  job.completedAt = nowIso();
}

function failJob(job: GenerationJob, message: string): void {
  job.status = "FAILED";
  job.errorMessage = message;
  job.completedAt = nowIso();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
