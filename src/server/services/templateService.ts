import { prisma } from "@/lib/prisma";
import { ensureDemoUser } from "@/server/services/assetService";
import type { GenerationSettings, LocationAnchor, StudioTemplate, StudioTemplateVariables } from "@/types/studio";

type TemplateRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  coverUrl: string | null;
  coverPalette: unknown;
  tags: unknown;
  locationAnchor: unknown;
  promptBase: string;
  negativePrompt: string | null;
  variables: unknown;
  defaultSettings: unknown;
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function listTemplates(category?: string): Promise<StudioTemplate[]> {
  const templates = await prisma.studioTemplate.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "asc" }
  });
  return templates.map(toStudioTemplate);
}

export async function getTemplate(templateIdOrSlug: string): Promise<StudioTemplate | undefined> {
  const template = await prisma.studioTemplate.findFirst({
    where: {
      OR: [
        { id: templateIdOrSlug },
        { slug: templateIdOrSlug }
      ]
    }
  });
  return template ? toStudioTemplate(template) : undefined;
}

export async function upsertTemplate(input: Partial<StudioTemplate> & Pick<StudioTemplate, "name" | "slug" | "category" | "description" | "locationAnchor" | "promptBase" | "variables">): Promise<StudioTemplate> {
  await ensureDemoUser();
  const existing = input.id ? await prisma.studioTemplate.findUnique({ where: { id: input.id } }) : null;
  const template = existing
    ? await prisma.studioTemplate.update({
      where: { id: existing.id },
      data: {
        slug: input.slug,
        name: input.name,
        category: input.category,
        description: input.description,
        coverUrl: input.coverUrl,
        coverPalette: input.coverPalette ?? ["#0f766e", "#c88925", "#e75f48", "#416b4a"],
        tags: input.tags ?? [input.category],
        locationAnchor: input.locationAnchor,
        promptBase: input.promptBase,
        negativePrompt: input.negativePrompt,
        variables: input.variables,
        defaultSettings: input.defaultSettings,
        isActive: input.isActive ?? true,
        version: { increment: 1 }
      }
    })
    : await prisma.studioTemplate.create({
      data: {
        slug: input.slug,
        name: input.name,
        category: input.category,
        description: input.description,
        coverUrl: input.coverUrl,
        coverPalette: input.coverPalette ?? ["#0f766e", "#c88925", "#e75f48", "#416b4a"],
        tags: input.tags ?? [input.category],
        locationAnchor: input.locationAnchor,
        promptBase: input.promptBase,
        negativePrompt: input.negativePrompt,
        variables: input.variables,
        defaultSettings: input.defaultSettings,
        isActive: input.isActive ?? true
      }
    });

  return toStudioTemplate(template);
}

export function toStudioTemplate(template: TemplateRecord): StudioTemplate {
  return {
    id: template.id,
    slug: template.slug,
    name: template.name,
    category: template.category,
    description: template.description,
    coverUrl: template.coverUrl ?? undefined,
    coverPalette: template.coverPalette as string[],
    tags: template.tags as string[],
    locationAnchor: template.locationAnchor as LocationAnchor,
    promptBase: template.promptBase,
    negativePrompt: template.negativePrompt ?? undefined,
    variables: template.variables as StudioTemplateVariables,
    defaultSettings: template.defaultSettings as GenerationSettings,
    isActive: template.isActive,
    version: template.version,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString()
  };
}
