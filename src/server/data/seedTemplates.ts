import { defaultTemplateVariables } from "../../lib/prompt/variables";
import type { StudioTemplate } from "../../types/studio";

const now = new Date().toISOString();

const baseSettings = {
  identityStrength: "strong",
  locationConsistency: "strong",
  creativity: "balanced",
  customNote: "服装偏黑色简洁，整体更像时尚街拍。",
  negativePrompt: ""
} as const;

const promptBase = "Create a realistic editorial portrait photo based on the uploaded person reference.";

export const seedTemplates: StudioTemplate[] = [
  {
    id: "tpl_tokyo",
    slug: "tokyo-tower-night-street",
    name: "东京塔夜景街拍",
    category: "城市街拍",
    description: "以东京塔为远景锚点，适合蓝调时刻、夜景、雨后反光街道的人像写真。",
    coverPalette: ["#16324f", "#f49b38", "#10211f", "#f6c47c"],
    tags: ["夜景", "城市", "反光街道"],
    locationAnchor: {
      placeName: "Tokyo Tower street viewpoint",
      stableElements: [
        "Tokyo Tower clearly visible in the background",
        "urban street perspective",
        "wet pavement or reflective road surface when rainy",
        "warm tower lights contrasting with blue evening sky"
      ],
      foreground: ["street railing", "sidewalk edge", "subtle city lights"],
      background: ["Tokyo Tower", "distant high-rise buildings", "street lamps and traffic bokeh"],
      lighting: ["mixed ambient city light", "soft key light on face", "warm backlight from street lamps"],
      colorPalette: ["deep blue", "warm orange", "black", "muted skin tone"],
      avoidElements: ["crowded tourists", "random large text signs blocking the landmark"]
    },
    promptBase,
    negativePrompt: "crowded tourists, blocked landmark, aggressive signage",
    variables: defaultTemplateVariables,
    defaultSettings: baseSettings,
    isActive: true,
    version: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "tpl_chongqing",
    slug: "chongqing-mountain-city-night-alley",
    name: "重庆山城夜巷",
    category: "川渝烟火",
    description: "潮湿石板路、暖色小店灯、坡道和层叠楼宇，适合烟火气街拍。",
    coverPalette: ["#263a30", "#d38b32", "#9d3027", "#10222d"],
    tags: ["烟火气", "坡道", "暖灯"],
    locationAnchor: {
      placeName: "Chongqing mountain city alley",
      stableElements: [
        "steep narrow alley",
        "layered buildings on a hillside",
        "warm storefront lights",
        "wet stone pavement",
        "red lanterns or subtle local street details"
      ],
      foreground: ["stone steps", "old railing", "soft steam from street food stall"],
      background: ["stacked residential buildings", "neon signs in soft bokeh", "distant bridge lights"],
      lighting: ["warm shop light on one side of face", "cool blue ambient night light", "soft reflections on wet ground"],
      colorPalette: ["warm amber", "deep blue", "dark green", "brick red"],
      avoidElements: ["overcrowded tourists", "messy large text signs"]
    },
    promptBase,
    negativePrompt: "flat modern mall, empty studio background, harsh white light",
    variables: defaultTemplateVariables,
    defaultSettings: baseSettings,
    isActive: true,
    version: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "tpl_sakura",
    slug: "spring-sakura-slope",
    name: "春日樱花坡道",
    category: "日系清新",
    description: "坡道、樱花、柔和逆光，适合清爽日常写真。",
    coverPalette: ["#f3b6c5", "#f7f0e1", "#8fb6d8", "#7b925d"],
    tags: ["樱花", "清晨", "柔和逆光"],
    locationAnchor: {
      placeName: "quiet sakura slope street",
      stableElements: [
        "gentle sloped street",
        "sakura trees along both sides",
        "soft petals in the air",
        "small residential walls and railings"
      ],
      foreground: ["fallen petals", "white railing", "soft shadow pattern"],
      background: ["blurred houses", "sakura canopy", "pale blue sky"],
      lighting: ["soft morning backlight", "gentle fill light", "low contrast pastel shadows"],
      colorPalette: ["pale pink", "cream white", "soft blue", "light green"],
      avoidElements: ["heavy traffic", "dark cyberpunk mood"]
    },
    promptBase,
    negativePrompt: "overly saturated neon, crowded road, harsh contrast",
    variables: defaultTemplateVariables,
    defaultSettings: baseSettings,
    isActive: true,
    version: 1,
    createdAt: now,
    updatedAt: now
  }
];
