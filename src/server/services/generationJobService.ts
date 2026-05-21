import { buildPromptMatrix } from "@/lib/prompt/buildPromptMatrix";
import { enqueueGenerationJob } from "@/lib/queue/generationQueue";
import { DEFAULT_USER_ID, getStore, id, nowIso } from "@/server/data/store";
import { getAssetsByIds } from "@/server/services/assetService";
import { getTemplate } from "@/server/services/templateService";
import type { GenerationJob, GenerationSettings, JobDetail, SelectedVariableInput } from "@/types/studio";

export type CreateGenerationJobInput = {
  userId?: string;
  templateId: string;
  referenceAssetIds: string[];
  requestedCount: number;
  settings: GenerationSettings;
  selectedVariables?: SelectedVariableInput;
};

export function createGenerationJob(input: CreateGenerationJobInput): GenerationJob {
  const userId = input.userId ?? DEFAULT_USER_ID;
  const template = getTemplate(input.templateId);
  if (!template || !template.isActive) {
    throw new Error("Template not found or inactive");
  }

  const references = getAssetsByIds(input.referenceAssetIds, userId);
  if (references.length !== input.referenceAssetIds.length) {
    throw new Error("Reference asset not found");
  }

  const promptMatrix = buildPromptMatrix({
    template,
    selectedVariables: input.selectedVariables,
    count: input.requestedCount
  });

  const job: GenerationJob = {
    id: id("job"),
    userId,
    templateId: template.id,
    status: "QUEUED",
    referenceAssetIds: input.referenceAssetIds,
    requestedCount: input.requestedCount,
    settings: input.settings,
    promptMatrix,
    provider: process.env.IMAGE_PROVIDER ?? "mock",
    providerModel: process.env.IMAGE_PROVIDER === "openai" ? process.env.OPENAI_IMAGE_MODEL : "mock-svg-v1",
    createdAt: nowIso()
  };

  getStore().jobs.unshift(job);
  enqueueGenerationJob(job.id);
  return job;
}

export function listJobs(userId = DEFAULT_USER_ID): JobDetail[] {
  return getStore().jobs
    .filter((job) => job.userId === userId)
    .map((job) => getJobDetail(job.id, userId))
    .filter((job): job is JobDetail => Boolean(job));
}

export function getJobDetail(jobId: string, userId = DEFAULT_USER_ID): JobDetail | undefined {
  const store = getStore();
  const job = store.jobs.find((item) => item.id === jobId && item.userId === userId);
  if (!job) return undefined;
  const images = store.images.filter((image) => image.jobId === job.id && !image.deletedAt);
  const failed = job.status === "FAILED" ? Math.max(job.requestedCount - images.length, 1) : 0;
  return {
    ...job,
    template: getTemplate(job.templateId),
    progress: {
      total: job.requestedCount,
      completed: images.length,
      failed
    },
    images
  };
}

export function regenerateImageJob(imageId: string, userId = DEFAULT_USER_ID, settingsPatch?: Partial<GenerationSettings>): GenerationJob {
  const store = getStore();
  const source = store.images.find((image) => image.id === imageId && image.userId === userId && !image.deletedAt);
  if (!source) throw new Error("Image not found");
  const sourceJob = store.jobs.find((job) => job.id === source.jobId);
  if (!sourceJob) throw new Error("Source job not found");

  const job: GenerationJob = {
    id: id("job"),
    userId,
    templateId: sourceJob.templateId,
    status: "QUEUED",
    referenceAssetIds: sourceJob.referenceAssetIds,
    requestedCount: 1,
    settings: { ...sourceJob.settings, ...settingsPatch },
    promptMatrix: [source.variables],
    provider: process.env.IMAGE_PROVIDER ?? "mock",
    providerModel: process.env.IMAGE_PROVIDER === "openai" ? process.env.OPENAI_IMAGE_MODEL : "mock-svg-v1",
    createdAt: nowIso()
  };
  store.jobs.unshift(job);
  enqueueGenerationJob(job.id);
  return job;
}
