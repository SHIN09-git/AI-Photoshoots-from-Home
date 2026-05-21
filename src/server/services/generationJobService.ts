import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPromptMatrix } from "@/lib/prompt/buildPromptMatrix";
import { enqueueGenerationJob } from "@/lib/queue/generationQueue";
import { DEFAULT_USER_ID } from "@/server/data/store";
import { ensureDemoUser, getAssetsByIds } from "@/server/services/assetService";
import { assetsFor, toGeneratedImage } from "@/server/services/generatedImageService";
import { getTemplate, toStudioTemplate } from "@/server/services/templateService";
import type { GenerationJob, GenerationSettings, JobDetail, PromptMatrixItem, SelectedVariableInput } from "@/types/studio";

export type CreateGenerationJobInput = {
  userId?: string;
  templateId: string;
  referenceAssetIds: string[];
  requestedCount: number;
  settings: GenerationSettings;
  selectedVariables?: SelectedVariableInput;
};

type JobRecord = {
  id: string;
  userId: string;
  templateId: string;
  status: GenerationJob["status"];
  referenceAssetIds: unknown;
  requestedCount: number;
  settings: unknown;
  promptMatrix: unknown;
  provider: string;
  providerModel: string | null;
  completedCount: number;
  failedCount: number;
  errorMessage: string | null;
  providerError: string | null;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
};

export async function createGenerationJob(input: CreateGenerationJobInput): Promise<GenerationJob> {
  const userId = input.userId ?? DEFAULT_USER_ID;
  await ensureDemoUser(userId);
  const template = await getTemplate(input.templateId);
  if (!template || !template.isActive) {
    throw new Error("Template not found or inactive");
  }

  const references = await getAssetsByIds(input.referenceAssetIds, userId);
  if (references.length !== input.referenceAssetIds.length) {
    throw new Error("Reference asset not found");
  }

  const promptMatrix = buildPromptMatrix({
    template,
    selectedVariables: input.selectedVariables,
    count: input.requestedCount
  });

  const job = await prisma.generationJob.create({
    data: {
      userId,
      templateId: template.id,
      status: "QUEUED",
      referenceAssetIds: input.referenceAssetIds as Prisma.InputJsonValue,
      requestedCount: input.requestedCount,
      settings: input.settings as Prisma.InputJsonValue,
      promptMatrix: promptMatrix as Prisma.InputJsonValue,
      provider: process.env.IMAGE_PROVIDER ?? "mock",
      providerModel: process.env.IMAGE_PROVIDER === "openai" ? process.env.OPENAI_IMAGE_MODEL : "mock-svg-v1"
    }
  });

  enqueueGenerationJob(job.id);
  return toGenerationJob(job);
}

export async function listJobs(userId = DEFAULT_USER_ID): Promise<JobDetail[]> {
  const jobs = await prisma.generationJob.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  const details = await Promise.all(jobs.map((job) => getJobDetail(job.id, userId)));
  return details.filter((job): job is JobDetail => Boolean(job));
}

export async function getJobDetail(jobId: string, userId = DEFAULT_USER_ID): Promise<JobDetail | undefined> {
  const job = await prisma.generationJob.findFirst({
    where: { id: jobId, userId },
    include: { template: true, images: { where: { deletedAt: null }, orderBy: { createdAt: "asc" } } }
  });
  if (!job) return undefined;
  const assets = await assetsFor(job.images);
  const images = job.images.map((image) => toGeneratedImage(image, assets));

  return {
    ...toGenerationJob(job),
    template: job.template ? toStudioTemplate(job.template) : undefined,
    progress: {
      total: job.requestedCount,
      completed: job.completedCount,
      failed: job.failedCount
    },
    images
  };
}

export async function regenerateImageJob(imageId: string, userId = DEFAULT_USER_ID, settingsPatch?: Partial<GenerationSettings>): Promise<GenerationJob> {
  await ensureDemoUser(userId);
  const source = await prisma.generatedImage.findFirst({
    where: { id: imageId, userId, deletedAt: null },
    include: { job: true }
  });
  if (!source) throw new Error("Image not found");

  const settings = { ...(source.job.settings as GenerationSettings), ...settingsPatch };
  const job = await prisma.generationJob.create({
    data: {
      userId,
      templateId: source.job.templateId,
      status: "QUEUED",
      referenceAssetIds: source.job.referenceAssetIds as Prisma.InputJsonValue,
      requestedCount: 1,
      settings: settings as Prisma.InputJsonValue,
      promptMatrix: [source.variables as PromptMatrixItem] as Prisma.InputJsonValue,
      provider: process.env.IMAGE_PROVIDER ?? "mock",
      providerModel: process.env.IMAGE_PROVIDER === "openai" ? process.env.OPENAI_IMAGE_MODEL : "mock-svg-v1"
    }
  });
  enqueueGenerationJob(job.id);
  return toGenerationJob(job);
}

export function toGenerationJob(job: JobRecord): GenerationJob {
  return {
    id: job.id,
    userId: job.userId,
    templateId: job.templateId,
    status: job.status,
    referenceAssetIds: job.referenceAssetIds as string[],
    requestedCount: job.requestedCount,
    settings: job.settings as GenerationSettings,
    promptMatrix: job.promptMatrix as PromptMatrixItem[],
    provider: job.provider,
    providerModel: job.providerModel ?? undefined,
    completedCount: job.completedCount,
    failedCount: job.failedCount,
    errorMessage: job.errorMessage ?? undefined,
    providerError: job.providerError ?? undefined,
    createdAt: job.createdAt.toISOString(),
    startedAt: job.startedAt?.toISOString(),
    completedAt: job.completedAt?.toISOString()
  };
}
