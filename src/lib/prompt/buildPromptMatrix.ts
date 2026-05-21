import type { PromptMatrixItem, SelectedVariableInput, StudioTemplate, VariableOption } from "@/types/studio";

type DimensionName = "seasons" | "times" | "angles" | "lenses" | "filmLooks" | "outfits" | "moods";

type NormalizedDimensions = Record<DimensionName, VariableOption[]>;

const preferredStride: Record<DimensionName, number> = {
  seasons: 1,
  times: 2,
  angles: 3,
  lenses: 5,
  filmLooks: 7,
  outfits: 1,
  moods: 1
};

export type BuildPromptMatrixInput = {
  template: Pick<StudioTemplate, "variables">;
  selectedVariables?: SelectedVariableInput;
  count: 4 | 6 | 9 | 12 | number;
};

export function buildPromptMatrix(input: BuildPromptMatrixInput): PromptMatrixItem[] {
  if (!Number.isInteger(input.count) || input.count <= 0 || input.count > 12) {
    throw new Error("count must be a positive integer up to 12");
  }

  const dimensions = normalizeDimensions(input.template, input.selectedVariables);
  const uniqueLimit = Object.values(dimensions).reduce((product, options) => product * Math.max(options.length, 1), 1);
  const matrix: PromptMatrixItem[] = [];
  const used = new Set<string>();

  for (let i = 0; matrix.length < input.count && i < input.count * 24; i += 1) {
    const item = makeItem(dimensions, i);
    const key = matrixKey(item);
    if (!used.has(key)) {
      used.add(key);
      matrix.push(item);
    }
  }

  if (matrix.length < input.count && uniqueLimit < input.count) {
    for (let i = 0; matrix.length < input.count; i += 1) {
      matrix.push(makeItem(dimensions, i));
    }
  }

  return matrix.slice(0, input.count);
}

export function matrixKey(item: PromptMatrixItem): string {
  return [
    item.season.id,
    item.timeOfDay.id,
    item.angle.id,
    item.lens.id,
    item.filmLook.id,
    item.outfit.id,
    item.mood.id
  ].join("|");
}

function normalizeDimensions(template: Pick<StudioTemplate, "variables">, selected?: SelectedVariableInput): NormalizedDimensions {
  return {
    seasons: pickOptions(template.variables.seasons, selected?.seasons),
    times: pickOptions(template.variables.times, selected?.times),
    angles: pickOptions(template.variables.angles, selected?.angles),
    lenses: pickOptions(template.variables.lenses, selected?.lenses),
    filmLooks: pickOptions(template.variables.filmLooks, selected?.filmLooks),
    outfits: pickOptions(template.variables.outfits, selected?.outfits),
    moods: pickOptions(template.variables.moods, selected?.moods)
  };
}

function pickOptions(options: VariableOption[], selectedIds?: string[]): VariableOption[] {
  if (!selectedIds?.length) return options;
  const byId = new Map(options.map((option) => [option.id, option]));
  const picked = selectedIds.map((id) => byId.get(id)).filter((option): option is VariableOption => Boolean(option));
  return picked.length ? picked : options;
}

function makeItem(dimensions: NormalizedDimensions, index: number): PromptMatrixItem {
  return {
    season: pickLoop(dimensions.seasons, index, strideFor("seasons", dimensions.seasons.length)),
    timeOfDay: pickLoop(dimensions.times, index, strideFor("times", dimensions.times.length)),
    angle: pickLoop(dimensions.angles, index, strideFor("angles", dimensions.angles.length)),
    lens: pickLoop(dimensions.lenses, index, strideFor("lenses", dimensions.lenses.length)),
    filmLook: pickLoop(dimensions.filmLooks, index, strideFor("filmLooks", dimensions.filmLooks.length)),
    outfit: pickLoop(dimensions.outfits, index, strideFor("outfits", dimensions.outfits.length)),
    mood: pickLoop(dimensions.moods, index, strideFor("moods", dimensions.moods.length))
  };
}

function pickLoop(options: VariableOption[], index: number, stride: number): VariableOption {
  return options[(index * stride) % options.length];
}

function strideFor(name: DimensionName, length: number): number {
  if (length <= 1) return 1;
  const candidates = [preferredStride[name], preferredStride[name] + 1, 1, 2, 3, 5, 7, 11];
  return candidates.find((candidate) => gcd(candidate, length) === 1) ?? 1;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}
