import type { StudioTemplateVariables, VariableOption } from "@/types/studio";

export const seasonOptions = [
  {
    id: "spring",
    label: "春",
    prompt: "spring atmosphere, fresh air, soft blossoms, gentle colors, subtle seasonal details"
  },
  {
    id: "summer",
    label: "夏",
    prompt: "summer evening, humid air, slightly glowing skin, vivid city colors, light breathable outfit"
  },
  {
    id: "autumn",
    label: "秋",
    prompt: "autumn mood, golden leaves, dry crisp air, warm earthy palette, elegant calm atmosphere"
  },
  {
    id: "winter",
    label: "冬",
    prompt: "winter atmosphere, cold air, layered outfit, subtle breath mist, cool shadows, warm lights"
  },
  {
    id: "rainy",
    label: "雨季",
    prompt: "rainy season, wet pavement, reflections, umbrella optional, moody cinematic atmosphere"
  },
  {
    id: "snow",
    label: "雪天",
    prompt: "light snow, soft flakes, clean cold air, quiet street mood, warm practical lights"
  }
] satisfies VariableOption[];

export const timeOptions = [
  {
    id: "morning",
    label: "清晨",
    prompt: "early morning soft light, gentle shadows, quiet street, fresh and clean atmosphere"
  },
  {
    id: "afternoon",
    label: "午后",
    prompt: "afternoon natural light, clear details, balanced contrast, relaxed daily portrait feeling"
  },
  {
    id: "golden-hour",
    label: "黄昏",
    prompt: "golden hour warm sunlight, long shadows, glowing rim light, romantic cinematic warmth"
  },
  {
    id: "blue-hour",
    label: "蓝调时刻",
    prompt: "blue hour sky, city lights just turned on, elegant contrast between cool ambient light and warm lamps"
  },
  {
    id: "night",
    label: "夜晚",
    prompt: "night street photography, neon bokeh, warm practical lights, controlled face lighting"
  },
  {
    id: "late-night",
    label: "深夜",
    prompt: "late night quiet mood, sparse practical lights, calm cinematic darkness, clean subject lighting"
  }
] satisfies VariableOption[];

export const angleOptions = [
  {
    id: "front-half-body",
    label: "正面半身",
    prompt: "front-facing half-body portrait, subject looking naturally toward camera, balanced composition"
  },
  {
    id: "over-shoulder",
    label: "侧身回眸",
    prompt: "over-the-shoulder pose, subject turning back naturally, dynamic candid moment"
  },
  {
    id: "low-angle",
    label: "低机位",
    prompt: "low-angle environmental portrait, confident posture, landmark rising behind subject"
  },
  {
    id: "high-angle",
    label: "高机位",
    prompt: "slightly high camera angle, elegant framing, visible ground texture and layered background"
  },
  {
    id: "wide-environment",
    label: "远景环境人像",
    prompt: "wide environmental portrait, full body visible, strong sense of place, subject integrated into the scene"
  },
  {
    id: "close-up",
    label: "近景特写",
    prompt: "close-up portrait, shallow depth of field, expressive eyes, background landmark softly blurred"
  }
] satisfies VariableOption[];

export const lensOptions = [
  {
    id: "35mm",
    label: "35mm",
    prompt: "35mm lens look, environmental context, natural perspective, moderate depth of field"
  },
  {
    id: "50mm",
    label: "50mm",
    prompt: "50mm lens look, natural perspective, balanced subject and background separation"
  },
  {
    id: "85mm",
    label: "85mm",
    prompt: "85mm portrait lens look, shallow depth of field, compressed background, creamy bokeh"
  },
  {
    id: "wide",
    label: "广角环境",
    prompt: "wide-angle street photography, dynamic perspective, strong leading lines, no face distortion"
  },
  {
    id: "tele",
    label: "长焦压缩",
    prompt: "telephoto compressed background, elegant layering, strong subject isolation, natural face shape"
  }
] satisfies VariableOption[];

export const filmLookOptions = [
  {
    id: "warm-portrait-film",
    label: "暖调人像",
    prompt: "warm portrait film color, soft highlight rolloff, fine grain, flattering but natural skin tone"
  },
  {
    id: "high-iso-night-grain",
    label: "高感颗粒",
    prompt: "high ISO night film grain, rich shadows, slight halation around lights, documentary street feeling"
  },
  {
    id: "cinematic-daylight",
    label: "电影日光",
    prompt: "cinematic daylight color grading, clean contrast, subtle film grain, natural dynamic range"
  },
  {
    id: "neon-night",
    label: "霓虹夜景",
    prompt: "neon night color finish, controlled saturated practical lights, clean face exposure, rich dark tones"
  },
  {
    id: "classic-bw",
    label: "经典黑白",
    prompt: "classic black and white photography, strong tonal contrast, rich midtones, timeless portrait mood"
  }
] satisfies VariableOption[];

export const outfitOptions = [
  {
    id: "minimal-black",
    label: "黑色简洁",
    prompt: "minimal black outfit, clean silhouette, understated styling, contemporary editorial feeling"
  },
  {
    id: "light-coat",
    label: "浅色外套",
    prompt: "light neutral coat, soft fabric texture, simple layered outfit, natural daily styling"
  },
  {
    id: "street-layer",
    label: "街头层次",
    prompt: "streetwear layered outfit, relaxed fit, practical texture, not too flashy"
  }
] satisfies VariableOption[];

export const moodOptions = [
  {
    id: "calm",
    label: "安静",
    prompt: "calm expression, natural posture, introspective but approachable mood"
  },
  {
    id: "candid",
    label: "抓拍",
    prompt: "candid moment, slight movement, natural micro-expression, documentary realism"
  },
  {
    id: "confident",
    label: "自信",
    prompt: "confident posture, composed expression, editorial presence without exaggeration"
  }
] satisfies VariableOption[];

export const defaultTemplateVariables: StudioTemplateVariables = {
  seasons: seasonOptions,
  times: timeOptions,
  angles: angleOptions,
  lenses: lensOptions,
  filmLooks: filmLookOptions,
  outfits: outfitOptions,
  moods: moodOptions
};
