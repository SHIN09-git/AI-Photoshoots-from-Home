import { getStore, id, nowIso } from "@/server/data/store";
import type { StudioTemplate } from "@/types/studio";

export function listTemplates(category?: string): StudioTemplate[] {
  const templates = getStore().templates;
  return templates.filter((template) => !category || template.category === category);
}

export function getTemplate(templateIdOrSlug: string): StudioTemplate | undefined {
  return getStore().templates.find((template) => template.id === templateIdOrSlug || template.slug === templateIdOrSlug);
}

export function upsertTemplate(input: Partial<StudioTemplate> & Pick<StudioTemplate, "name" | "slug" | "category" | "description" | "locationAnchor" | "promptBase" | "variables">): StudioTemplate {
  const store = getStore();
  const existingIndex = input.id ? store.templates.findIndex((template) => template.id === input.id) : -1;
  const existing = existingIndex >= 0 ? store.templates[existingIndex] : undefined;
  const timestamp = nowIso();
  const template: StudioTemplate = {
    id: existing?.id ?? input.id ?? id("tpl"),
    slug: input.slug,
    name: input.name,
    category: input.category,
    description: input.description,
    coverUrl: input.coverUrl,
    coverPalette: input.coverPalette ?? existing?.coverPalette ?? ["#0f766e", "#c88925", "#e75f48", "#416b4a"],
    tags: input.tags ?? existing?.tags ?? [input.category],
    locationAnchor: input.locationAnchor,
    promptBase: input.promptBase,
    negativePrompt: input.negativePrompt,
    variables: input.variables,
    defaultSettings: input.defaultSettings ?? existing?.defaultSettings ?? {
      identityStrength: "strong",
      locationConsistency: "strong",
      creativity: "balanced",
      customNote: "",
      negativePrompt: ""
    },
    isActive: input.isActive ?? existing?.isActive ?? true,
    version: existing ? existing.version + 1 : 1,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp
  };

  if (existingIndex >= 0) {
    store.templates[existingIndex] = template;
  } else {
    store.templates.unshift(template);
  }

  return template;
}
