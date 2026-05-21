import { describe, expect, it } from "vitest";
import { buildPromptMatrix, matrixKey } from "@/lib/prompt/buildPromptMatrix";
import { composePrompt, mergeNegativePrompts } from "@/lib/prompt/composePrompt";
import { seedTemplates } from "@/server/data/seedTemplates";

const template = seedTemplates.find((item) => item.slug === "chongqing-mountain-city-night-alley")!;

describe("buildPromptMatrix", () => {
  it("covers core dimensions evenly for count 6, 9, and 12", () => {
    for (const count of [6, 9, 12] as const) {
      const matrix = buildPromptMatrix({ template, count });

      expect(matrix).toHaveLength(count);
      expect(new Set(matrix.map((item) => item.season.id)).size).toBeGreaterThanOrEqual(Math.min(count, template.variables.seasons.length));
      expect(new Set(matrix.map((item) => item.timeOfDay.id)).size).toBeGreaterThanOrEqual(Math.min(count, template.variables.times.length));
      expect(new Set(matrix.map((item) => item.angle.id)).size).toBeGreaterThanOrEqual(Math.min(count, template.variables.angles.length));
      expect(new Set(matrix.map((item) => item.filmLook.id)).size).toBeGreaterThanOrEqual(Math.min(count, template.variables.filmLooks.length));
    }
  });

  it("covers 85mm when the default three portrait lenses are selected", () => {
    const matrix = buildPromptMatrix({
      template,
      count: 6,
      selectedVariables: {
        lenses: ["35mm", "50mm", "85mm"]
      }
    });

    expect(matrix.map((item) => item.lens.id)).toContain("85mm");
    expect(new Set(matrix.map((item) => item.lens.id))).toEqual(new Set(["35mm", "50mm", "85mm"]));
  });

  it("prevents duplicate combinations when the option space can satisfy the requested count", () => {
    const matrix = buildPromptMatrix({ template, count: 12 });
    expect(new Set(matrix.map(matrixKey)).size).toBe(matrix.length);
  });

  it("respects locked variables while varying unlocked dimensions", () => {
    const matrix = buildPromptMatrix({
      template,
      count: 6,
      selectedVariables: {
        seasons: ["rainy"],
        lenses: ["85mm"],
        times: ["blue-hour", "night"],
        angles: ["front-half-body", "over-shoulder", "wide-environment"]
      }
    });

    expect(matrix.every((item) => item.season.id === "rainy")).toBe(true);
    expect(matrix.every((item) => item.lens.id === "85mm")).toBe(true);
    expect(new Set(matrix.map((item) => item.timeOfDay.id))).toEqual(new Set(["blue-hour", "night"]));
    expect(new Set(matrix.map((item) => item.angle.id)).size).toBe(3);
  });
});

describe("composePrompt", () => {
  it("composes identity, location, scene, quality, and user note layers", () => {
    const [variables] = buildPromptMatrix({ template, count: 4 });
    const result = composePrompt({
      template,
      variables,
      settings: {
        identityStrength: "strong",
        locationConsistency: "strong",
        creativity: "balanced",
        customNote: "black minimal outfit",
        negativePrompt: "bad crop"
      }
    });

    expect(result.prompt).toContain("uploaded person's facial identity");
    expect(result.prompt).toContain("Chongqing mountain city alley");
    expect(result.prompt).toContain("Season:");
    expect(result.prompt).toContain("Lens and depth of field:");
    expect(result.prompt).toContain("black minimal outfit");
  });

  it("merges negative prompts without duplicate tokens", () => {
    const merged = mergeNegativePrompts("cartoon, blurry", "cartoon, harsh light", "blurry, bad crop");

    expect(merged).toBe("cartoon, blurry, harsh light, bad crop");
  });

  it("includes general, template, and custom negative prompts", () => {
    const [variables] = buildPromptMatrix({ template, count: 4 });
    const result = composePrompt({
      template,
      variables,
      settings: {
        identityStrength: "normal",
        locationConsistency: "normal",
        creativity: "safe",
        negativePrompt: "bad crop"
      }
    });

    expect(result.negativePrompt).toContain("cartoon");
    expect(result.negativePrompt).toContain("flat modern mall");
    expect(result.negativePrompt).toContain("bad crop");
  });
});
