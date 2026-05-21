import type { GenerationSettings, PromptMatrixItem, StudioTemplate } from "@/types/studio";

export const GENERAL_NEGATIVE_PROMPT = [
  "cartoon",
  "anime",
  "3d render",
  "waxy skin",
  "plastic skin",
  "over-smoothed face",
  "changed identity",
  "different person",
  "deformed face",
  "asymmetrical eyes",
  "distorted hands",
  "extra fingers",
  "broken limbs",
  "duplicate person",
  "low resolution",
  "blurry",
  "messy background",
  "unreadable text",
  "watermark",
  "logo",
  "NSFW",
  "explicit nudity"
].join(", ");

export type ComposePromptInput = {
  template: StudioTemplate;
  variables: PromptMatrixItem;
  settings: GenerationSettings;
};

export function composePrompt(input: ComposePromptInput): { prompt: string; negativePrompt: string } {
  const { template, variables, settings } = input;
  const identityLayer = settings.identityStrength === "strong"
    ? "Preserve the uploaded person's facial identity with high priority: face shape, facial feature proportions, hairstyle impression, natural skin texture, and overall temperament."
    : "Preserve the uploaded person's facial identity, natural facial proportions, hairstyle impression, and overall temperament.";

  const locationLayer = [
    `Place: ${template.locationAnchor.placeName}`,
    `Stable elements: ${template.locationAnchor.stableElements.join("; ")}`,
    `Foreground: ${template.locationAnchor.foreground.join("; ")}`,
    `Background: ${template.locationAnchor.background.join("; ")}`,
    `Lighting: ${template.locationAnchor.lighting.join("; ")}`,
    `Color palette: ${template.locationAnchor.colorPalette.join(", ")}`,
    template.locationAnchor.avoidElements?.length ? `Avoid: ${template.locationAnchor.avoidElements.join("; ")}` : ""
  ].filter(Boolean).join("\n");

  const locationConsistency = settings.locationConsistency === "strong"
    ? "Keep the same location anchor highly consistent across the batch. Do not replace the place with a generic street or studio."
    : "Keep the location anchor recognizable and coherent.";

  const creativity = {
    safe: "Use conservative realistic variation. Prioritize identity and location stability over novelty.",
    balanced: "Use balanced creative variation while preserving identity and location consistency.",
    wild: "Allow bolder styling and composition while keeping the same person and place recognizable."
  }[settings.creativity];

  const prompt = [
    template.promptBase,
    identityLayer,
    "Do not over-beautify or change the person's age, face shape, body shape, or skin texture unnaturally.",
    "",
    "Location anchor:",
    locationLayer,
    "",
    "Scene variation:",
    `Season: ${variables.season.prompt}`,
    `Time of day: ${variables.timeOfDay.prompt}`,
    `Camera angle and framing: ${variables.angle.prompt}`,
    `Lens and depth of field: ${variables.lens.prompt}`,
    `Film / color finish: ${variables.filmLook.prompt}`,
    `Outfit and styling: ${variables.outfit.prompt}`,
    `Mood: ${variables.mood.prompt}`,
    "",
    "Quality direction:",
    "realistic photography, coherent lighting, natural pose, clean composition, high detail, no distorted hands, no warped face, no extra people unless requested.",
    locationConsistency,
    creativity,
    "",
    "Additional user note:",
    settings.customNote?.trim() || "none"
  ].join("\n");

  return {
    prompt,
    negativePrompt: mergeNegativePrompts(GENERAL_NEGATIVE_PROMPT, template.negativePrompt, settings.negativePrompt)
  };
}

export function mergeNegativePrompts(...parts: Array<string | undefined>): string {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const part of parts) {
    for (const token of (part ?? "").split(",")) {
      const normalized = token.trim();
      const key = normalized.toLowerCase();
      if (normalized && !seen.has(key)) {
        seen.add(key);
        merged.push(normalized);
      }
    }
  }
  return merged.join(", ");
}
