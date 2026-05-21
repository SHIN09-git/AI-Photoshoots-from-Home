import { z } from "zod";

export const generationSettingsSchema = z.object({
  identityStrength: z.enum(["normal", "strong"]).default("strong"),
  locationConsistency: z.enum(["normal", "strong"]).default("strong"),
  creativity: z.enum(["safe", "balanced", "wild"]).default("balanced"),
  customNote: z.string().max(1200).optional(),
  negativePrompt: z.string().max(1200).optional()
});

export const selectedVariablesSchema = z.object({
  seasons: z.array(z.string()).optional(),
  times: z.array(z.string()).optional(),
  angles: z.array(z.string()).optional(),
  lenses: z.array(z.string()).optional(),
  filmLooks: z.array(z.string()).optional(),
  outfits: z.array(z.string()).optional(),
  moods: z.array(z.string()).optional()
}).default({});

export const createGenerationJobSchema = z.object({
  templateId: z.string().min(1),
  referenceAssetIds: z.array(z.string()).min(1).max(3),
  requestedCount: z.union([z.literal(4), z.literal(6), z.literal(9), z.literal(12)]),
  settings: generationSettingsSchema,
  selectedVariables: selectedVariablesSchema.optional()
});

const variableOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  prompt: z.string().min(1),
  tags: z.array(z.string()).optional()
});

const templateVariablesSchema = z.object({
  seasons: z.array(variableOptionSchema).min(1),
  times: z.array(variableOptionSchema).min(1),
  angles: z.array(variableOptionSchema).min(1),
  lenses: z.array(variableOptionSchema).min(1),
  filmLooks: z.array(variableOptionSchema).min(1),
  outfits: z.array(variableOptionSchema).min(1),
  moods: z.array(variableOptionSchema).min(1)
});

export const templateSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  coverUrl: z.string().optional(),
  coverPalette: z.array(z.string()).min(1).default(["#0f766e", "#c88925", "#e75f48", "#416b4a"]),
  tags: z.array(z.string()).default([]),
  locationAnchor: z.object({
    placeName: z.string().min(1),
    stableElements: z.array(z.string()).min(1),
    foreground: z.array(z.string()).min(1),
    background: z.array(z.string()).min(1),
    lighting: z.array(z.string()).min(1),
    colorPalette: z.array(z.string()).min(1),
    avoidElements: z.array(z.string()).optional()
  }),
  promptBase: z.string().min(1),
  negativePrompt: z.string().optional(),
  variables: templateVariablesSchema,
  defaultSettings: generationSettingsSchema.optional(),
  isActive: z.boolean().default(true)
});

export const favoriteSchema = z.object({
  isFavorite: z.boolean()
});

export const regenerateSchema = z.object({
  creativity: z.enum(["safe", "balanced", "wild"]).optional(),
  customNote: z.string().max(1200).optional()
});
