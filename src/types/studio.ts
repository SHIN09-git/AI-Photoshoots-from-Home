export type AssetType = "PERSON_REFERENCE" | "LOCATION_REFERENCE" | "GENERATED_IMAGE" | "TEMPLATE_COVER";

export type JobStatus = "PENDING" | "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELED";

export type IdentityStrength = "normal" | "strong";
export type LocationConsistency = "normal" | "strong";
export type Creativity = "safe" | "balanced" | "wild";

export type VariableOption = {
  id: string;
  label: string;
  prompt: string;
  tags?: string[];
};

export type LocationAnchor = {
  placeName: string;
  stableElements: string[];
  foreground: string[];
  background: string[];
  lighting: string[];
  colorPalette: string[];
  avoidElements?: string[];
};

export type StudioTemplateVariables = {
  seasons: VariableOption[];
  times: VariableOption[];
  angles: VariableOption[];
  lenses: VariableOption[];
  filmLooks: VariableOption[];
  outfits: VariableOption[];
  moods: VariableOption[];
};

export type StudioTemplate = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  coverUrl?: string;
  coverPalette: string[];
  tags: string[];
  locationAnchor: LocationAnchor;
  promptBase: string;
  negativePrompt?: string;
  variables: StudioTemplateVariables;
  defaultSettings: GenerationSettings;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type Asset = {
  id: string;
  userId: string;
  type: AssetType;
  url: string;
  thumbUrl?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  deletedAt?: string;
};

export type SelectedVariableInput = {
  seasons?: string[];
  times?: string[];
  angles?: string[];
  lenses?: string[];
  filmLooks?: string[];
  outfits?: string[];
  moods?: string[];
};

export type PromptMatrixItem = {
  season: VariableOption;
  timeOfDay: VariableOption;
  angle: VariableOption;
  lens: VariableOption;
  filmLook: VariableOption;
  outfit: VariableOption;
  mood: VariableOption;
};

export type GenerationSettings = {
  identityStrength: IdentityStrength;
  locationConsistency: LocationConsistency;
  creativity: Creativity;
  customNote?: string;
  negativePrompt?: string;
};

export type GenerationJob = {
  id: string;
  userId: string;
  templateId: string;
  status: JobStatus;
  referenceAssetIds: string[];
  requestedCount: number;
  settings: GenerationSettings;
  promptMatrix: PromptMatrixItem[];
  provider: string;
  providerModel?: string;
  errorMessage?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
};

export type GeneratedImage = {
  id: string;
  userId: string;
  jobId: string;
  assetId?: string;
  url: string;
  thumbUrl?: string;
  prompt: string;
  negativePrompt?: string;
  variables: PromptMatrixItem;
  provider: string;
  providerModel?: string;
  seed?: string;
  width?: number;
  height?: number;
  isFavorite: boolean;
  createdAt: string;
  deletedAt?: string;
};

export type JobProgress = {
  total: number;
  completed: number;
  failed: number;
};

export type JobDetail = GenerationJob & {
  template?: StudioTemplate;
  progress: JobProgress;
  images: GeneratedImage[];
};
