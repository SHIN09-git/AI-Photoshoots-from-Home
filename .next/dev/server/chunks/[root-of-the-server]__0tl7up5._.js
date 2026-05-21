module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/prompt/buildPromptMatrix.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPromptMatrix",
    ()=>buildPromptMatrix,
    "matrixKey",
    ()=>matrixKey
]);
const preferredStride = {
    seasons: 1,
    times: 2,
    angles: 3,
    lenses: 5,
    filmLooks: 7,
    outfits: 1,
    moods: 1
};
function buildPromptMatrix(input) {
    if (!Number.isInteger(input.count) || input.count <= 0 || input.count > 12) {
        throw new Error("count must be a positive integer up to 12");
    }
    const dimensions = normalizeDimensions(input.template, input.selectedVariables);
    const uniqueLimit = Object.values(dimensions).reduce((product, options)=>product * Math.max(options.length, 1), 1);
    const matrix = [];
    const used = new Set();
    for(let i = 0; matrix.length < input.count && i < input.count * 24; i += 1){
        const item = makeItem(dimensions, i);
        const key = matrixKey(item);
        if (!used.has(key)) {
            used.add(key);
            matrix.push(item);
        }
    }
    if (matrix.length < input.count && uniqueLimit < input.count) {
        for(let i = 0; matrix.length < input.count; i += 1){
            matrix.push(makeItem(dimensions, i));
        }
    }
    return matrix.slice(0, input.count);
}
function matrixKey(item) {
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
function normalizeDimensions(template, selected) {
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
function pickOptions(options, selectedIds) {
    if (!selectedIds?.length) return options;
    const byId = new Map(options.map((option)=>[
            option.id,
            option
        ]));
    const picked = selectedIds.map((id)=>byId.get(id)).filter((option)=>Boolean(option));
    return picked.length ? picked : options;
}
function makeItem(dimensions, index) {
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
function pickLoop(options, index, stride) {
    return options[index * stride % options.length];
}
function strideFor(name, length) {
    if (length <= 1) return 1;
    const candidates = [
        preferredStride[name],
        preferredStride[name] + 1,
        1,
        2,
        3,
        5,
        7,
        11
    ];
    return candidates.find((candidate)=>gcd(candidate, length) === 1) ?? 1;
}
function gcd(a, b) {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while(y){
        [x, y] = [
            y,
            x % y
        ];
    }
    return x;
}
}),
"[project]/src/lib/prompt/composePrompt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GENERAL_NEGATIVE_PROMPT",
    ()=>GENERAL_NEGATIVE_PROMPT,
    "composePrompt",
    ()=>composePrompt,
    "mergeNegativePrompts",
    ()=>mergeNegativePrompts
]);
const GENERAL_NEGATIVE_PROMPT = [
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
function composePrompt(input) {
    const { template, variables, settings } = input;
    const identityLayer = settings.identityStrength === "strong" ? "Preserve the uploaded person's facial identity with high priority: face shape, facial feature proportions, hairstyle impression, natural skin texture, and overall temperament." : "Preserve the uploaded person's facial identity, natural facial proportions, hairstyle impression, and overall temperament.";
    const locationLayer = [
        `Place: ${template.locationAnchor.placeName}`,
        `Stable elements: ${template.locationAnchor.stableElements.join("; ")}`,
        `Foreground: ${template.locationAnchor.foreground.join("; ")}`,
        `Background: ${template.locationAnchor.background.join("; ")}`,
        `Lighting: ${template.locationAnchor.lighting.join("; ")}`,
        `Color palette: ${template.locationAnchor.colorPalette.join(", ")}`,
        template.locationAnchor.avoidElements?.length ? `Avoid: ${template.locationAnchor.avoidElements.join("; ")}` : ""
    ].filter(Boolean).join("\n");
    const locationConsistency = settings.locationConsistency === "strong" ? "Keep the same location anchor highly consistent across the batch. Do not replace the place with a generic street or studio." : "Keep the location anchor recognizable and coherent.";
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
function mergeNegativePrompts(...parts) {
    const seen = new Set();
    const merged = [];
    for (const part of parts){
        for (const token of (part ?? "").split(",")){
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
}),
"[project]/src/lib/providers/mockProvider.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MockImageProvider",
    ()=>MockImageProvider
]);
class MockImageProvider {
    id = "mock";
    model = "mock-svg-v1";
    async healthCheck() {
        return true;
    }
    async generate(input) {
        const seed = input.seed ?? String(Math.floor(100000 + Math.random() * 899999));
        const variables = input.metadata?.variables;
        const templateName = input.metadata?.templateName ?? "AI 摄影棚";
        const svg = mockSvg({
            seed,
            templateName,
            season: variables?.season.label ?? "季节",
            time: variables?.timeOfDay.label ?? "时间",
            angle: variables?.angle.label ?? "角度",
            lens: variables?.lens.label ?? "镜头",
            filmLook: variables?.filmLook.label ?? "胶片感"
        });
        return [
            {
                buffer: Buffer.from(svg, "utf8"),
                mimeType: "image/svg+xml",
                width: 900,
                height: 1125,
                seed,
                providerRaw: {
                    provider: "mock"
                }
            }
        ];
    }
}
function mockSvg(input) {
    const palettes = [
        [
            "#263a30",
            "#d38b32",
            "#9d3027",
            "#10222d"
        ],
        [
            "#16324f",
            "#f49b38",
            "#10211f",
            "#f6c47c"
        ],
        [
            "#f3b6c5",
            "#f7f0e1",
            "#8fb6d8",
            "#7b925d"
        ]
    ];
    const palette = palettes[Number(input.seed.slice(-1)) % palettes.length];
    const [a, b, c, d] = palette;
    const offset = Number(input.seed.slice(-2)) % 28 - 14;
    const label = `${input.season} · ${input.time} · ${input.angle}`;
    const sublabel = `${input.lens} · ${input.filmLook} · seed ${input.seed}`;
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125">
      <defs>
        <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${a}"/>
          <stop offset="0.52" stop-color="${b}"/>
          <stop offset="1" stop-color="${c}"/>
        </linearGradient>
        <radialGradient id="lamp" cx="66%" cy="18%" r="45%">
          <stop offset="0" stop-color="#fff5cc" stop-opacity="0.95"/>
          <stop offset="1" stop-color="#fff5cc" stop-opacity="0"/>
        </radialGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="${Number(input.seed) % 97}"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="table" tableValues="0 0.12"/></feComponentTransfer>
        </filter>
      </defs>
      <rect width="900" height="1125" fill="url(#sky)"/>
      <rect width="900" height="1125" fill="url(#lamp)"/>
      <path d="M0 850 C180 760 260 830 390 775 C520 715 650 740 900 650 L900 1125 L0 1125 Z" fill="${d}" opacity="0.72"/>
      <path d="M0 982 L900 862 L900 1125 L0 1125 Z" fill="#111d19" opacity="0.46"/>
      <g opacity="0.48">
        <path d="M70 820 L230 460 L360 820 Z" fill="#1c2924"/>
        <path d="M650 790 L725 360 L815 790 Z" fill="#182621"/>
        <rect x="72" y="736" width="720" height="16" fill="#f6d38a" opacity="0.52"/>
        <rect x="120" y="780" width="560" height="12" fill="#ffffff" opacity="0.3"/>
      </g>
      <g transform="translate(${450 + offset} 560)">
        <ellipse cx="0" cy="354" rx="132" ry="36" fill="#101916" opacity="0.28"/>
        <path d="M-118 322 C-92 178 -76 82 -22 22 L22 22 C76 82 92 178 118 322 Z" fill="#151d1a"/>
        <path d="M-72 170 C-116 224 -136 262 -154 328" fill="none" stroke="#151d1a" stroke-width="34" stroke-linecap="round"/>
        <path d="M72 170 C116 224 136 262 154 328" fill="none" stroke="#151d1a" stroke-width="34" stroke-linecap="round"/>
        <circle cx="0" cy="-48" r="78" fill="#ddb38e"/>
        <path d="M-78 -50 C-72 -138 70 -158 86 -40 C56 -72 30 -88 -6 -88 C-44 -88 -62 -70 -78 -50 Z" fill="#241a16"/>
        <path d="M-28 -26 Q0 -10 28 -26" fill="none" stroke="#7a4d3d" stroke-width="8" stroke-linecap="round"/>
        <circle cx="-27" cy="-51" r="7" fill="#231918"/>
        <circle cx="27" cy="-51" r="7" fill="#231918"/>
      </g>
      <rect x="32" y="32" width="500" height="164" rx="14" fill="#101916" opacity="0.66"/>
      <text x="58" y="76" fill="#ffffff" font-size="34" font-family="Arial, sans-serif" font-weight="700">${escapeXml(input.templateName)}</text>
      <text x="58" y="114" fill="#fff2c2" font-size="25" font-family="Arial, sans-serif">${escapeXml(label)}</text>
      <text x="58" y="151" fill="#e6f1eb" font-size="22" font-family="Arial, sans-serif">${escapeXml(sublabel)}</text>
      <rect width="900" height="1125" filter="url(#grain)" opacity="0.46"/>
    </svg>
  `;
}
function escapeXml(value) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
}),
"[project]/src/lib/providers/openaiProvider.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OpenAIImageProvider",
    ()=>OpenAIImageProvider
]);
class OpenAIImageProvider {
    id = "openai";
    model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
    async healthCheck() {
        return Boolean(process.env.OPENAI_API_KEY);
    }
    async generate(input) {
        void input;
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY is required when IMAGE_PROVIDER=openai");
        }
        throw new Error("OpenAI image provider adapter is isolated for production integration; use IMAGE_PROVIDER=mock for local MVP.");
    }
}
}),
"[project]/src/lib/providers/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getImageProvider",
    ()=>getImageProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$providers$2f$mockProvider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/providers/mockProvider.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$providers$2f$openaiProvider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/providers/openaiProvider.ts [app-route] (ecmascript)");
;
;
function getImageProvider() {
    const provider = process.env.IMAGE_PROVIDER ?? "mock";
    if (provider === "openai") return new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$providers$2f$openaiProvider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpenAIImageProvider"]();
    return new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$providers$2f$mockProvider$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MockImageProvider"]();
}
}),
"[project]/src/lib/prompt/variables.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "angleOptions",
    ()=>angleOptions,
    "defaultTemplateVariables",
    ()=>defaultTemplateVariables,
    "filmLookOptions",
    ()=>filmLookOptions,
    "lensOptions",
    ()=>lensOptions,
    "moodOptions",
    ()=>moodOptions,
    "outfitOptions",
    ()=>outfitOptions,
    "seasonOptions",
    ()=>seasonOptions,
    "timeOptions",
    ()=>timeOptions
]);
const seasonOptions = [
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
];
const timeOptions = [
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
];
const angleOptions = [
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
];
const lensOptions = [
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
];
const filmLookOptions = [
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
];
const outfitOptions = [
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
];
const moodOptions = [
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
];
const defaultTemplateVariables = {
    seasons: seasonOptions,
    times: timeOptions,
    angles: angleOptions,
    lenses: lensOptions,
    filmLooks: filmLookOptions,
    outfits: outfitOptions,
    moods: moodOptions
};
}),
"[project]/src/server/data/seedTemplates.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "seedTemplates",
    ()=>seedTemplates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prompt$2f$variables$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prompt/variables.ts [app-route] (ecmascript)");
;
const now = new Date().toISOString();
const baseSettings = {
    identityStrength: "strong",
    locationConsistency: "strong",
    creativity: "balanced",
    customNote: "服装偏黑色简洁，整体更像时尚街拍。",
    negativePrompt: ""
};
const promptBase = "Create a realistic editorial portrait photo based on the uploaded person reference.";
const seedTemplates = [
    {
        id: "tpl_tokyo",
        slug: "tokyo-tower-night-street",
        name: "东京塔夜景街拍",
        category: "城市街拍",
        description: "以东京塔为远景锚点，适合蓝调时刻、夜景、雨后反光街道的人像写真。",
        coverPalette: [
            "#16324f",
            "#f49b38",
            "#10211f",
            "#f6c47c"
        ],
        tags: [
            "夜景",
            "城市",
            "反光街道"
        ],
        locationAnchor: {
            placeName: "Tokyo Tower street viewpoint",
            stableElements: [
                "Tokyo Tower clearly visible in the background",
                "urban street perspective",
                "wet pavement or reflective road surface when rainy",
                "warm tower lights contrasting with blue evening sky"
            ],
            foreground: [
                "street railing",
                "sidewalk edge",
                "subtle city lights"
            ],
            background: [
                "Tokyo Tower",
                "distant high-rise buildings",
                "street lamps and traffic bokeh"
            ],
            lighting: [
                "mixed ambient city light",
                "soft key light on face",
                "warm backlight from street lamps"
            ],
            colorPalette: [
                "deep blue",
                "warm orange",
                "black",
                "muted skin tone"
            ],
            avoidElements: [
                "crowded tourists",
                "random large text signs blocking the landmark"
            ]
        },
        promptBase,
        negativePrompt: "crowded tourists, blocked landmark, aggressive signage",
        variables: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prompt$2f$variables$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultTemplateVariables"],
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
        coverPalette: [
            "#263a30",
            "#d38b32",
            "#9d3027",
            "#10222d"
        ],
        tags: [
            "烟火气",
            "坡道",
            "暖灯"
        ],
        locationAnchor: {
            placeName: "Chongqing mountain city alley",
            stableElements: [
                "steep narrow alley",
                "layered buildings on a hillside",
                "warm storefront lights",
                "wet stone pavement",
                "red lanterns or subtle local street details"
            ],
            foreground: [
                "stone steps",
                "old railing",
                "soft steam from street food stall"
            ],
            background: [
                "stacked residential buildings",
                "neon signs in soft bokeh",
                "distant bridge lights"
            ],
            lighting: [
                "warm shop light on one side of face",
                "cool blue ambient night light",
                "soft reflections on wet ground"
            ],
            colorPalette: [
                "warm amber",
                "deep blue",
                "dark green",
                "brick red"
            ],
            avoidElements: [
                "overcrowded tourists",
                "messy large text signs"
            ]
        },
        promptBase,
        negativePrompt: "flat modern mall, empty studio background, harsh white light",
        variables: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prompt$2f$variables$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultTemplateVariables"],
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
        coverPalette: [
            "#f3b6c5",
            "#f7f0e1",
            "#8fb6d8",
            "#7b925d"
        ],
        tags: [
            "樱花",
            "清晨",
            "柔和逆光"
        ],
        locationAnchor: {
            placeName: "quiet sakura slope street",
            stableElements: [
                "gentle sloped street",
                "sakura trees along both sides",
                "soft petals in the air",
                "small residential walls and railings"
            ],
            foreground: [
                "fallen petals",
                "white railing",
                "soft shadow pattern"
            ],
            background: [
                "blurred houses",
                "sakura canopy",
                "pale blue sky"
            ],
            lighting: [
                "soft morning backlight",
                "gentle fill light",
                "low contrast pastel shadows"
            ],
            colorPalette: [
                "pale pink",
                "cream white",
                "soft blue",
                "light green"
            ],
            avoidElements: [
                "heavy traffic",
                "dark cyberpunk mood"
            ]
        },
        promptBase,
        negativePrompt: "overly saturated neon, crowded road, harsh contrast",
        variables: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prompt$2f$variables$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultTemplateVariables"],
        defaultSettings: baseSettings,
        isActive: true,
        version: 1,
        createdAt: now,
        updatedAt: now
    }
];
}),
"[project]/src/server/data/store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_USER_ID",
    ()=>DEFAULT_USER_ID,
    "getJobRuns",
    ()=>getJobRuns,
    "getStore",
    ()=>getStore,
    "id",
    ()=>id,
    "nowIso",
    ()=>nowIso
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$seedTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/data/seedTemplates.ts [app-route] (ecmascript)");
;
const DEFAULT_USER_ID = "demo_user";
const globalStudio = globalThis;
function getStore() {
    if (!globalStudio.__studioStore) {
        globalStudio.__studioStore = {
            assets: [],
            templates: structuredClone(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$seedTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["seedTemplates"]),
            jobs: [],
            images: []
        };
    }
    return globalStudio.__studioStore;
}
function getJobRuns() {
    if (!globalStudio.__studioJobRuns) {
        globalStudio.__studioJobRuns = new Map();
    }
    return globalStudio.__studioJobRuns;
}
function id(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${crypto.randomUUID().slice(0, 8)}`;
}
function nowIso() {
    return new Date().toISOString();
}
}),
"[project]/src/server/services/assetService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAsset",
    ()=>createAsset,
    "getAssetsByIds",
    ()=>getAssetsByIds
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/data/store.ts [app-route] (ecmascript)");
;
function createAsset(input) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
    const asset = {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"])("asset"),
        userId: input.userId ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_USER_ID"],
        type: input.type,
        url: input.url,
        thumbUrl: input.thumbUrl,
        mimeType: input.mimeType,
        size: input.size,
        width: input.width,
        height: input.height,
        metadata: input.metadata,
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nowIso"])()
    };
    store.assets.push(asset);
    return asset;
}
function getAssetsByIds(assetIds, userId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_USER_ID"]) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
    return assetIds.map((assetId)=>store.assets.find((asset)=>asset.id === assetId && asset.userId === userId && !asset.deletedAt)).filter((asset)=>Boolean(asset));
}
}),
"[project]/src/server/services/templateService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTemplate",
    ()=>getTemplate,
    "listTemplates",
    ()=>listTemplates,
    "upsertTemplate",
    ()=>upsertTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/data/store.ts [app-route] (ecmascript)");
;
function listTemplates(category) {
    const templates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().templates;
    return templates.filter((template)=>!category || template.category === category);
}
function getTemplate(templateIdOrSlug) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().templates.find((template)=>template.id === templateIdOrSlug || template.slug === templateIdOrSlug);
}
function upsertTemplate(input) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
    const existingIndex = input.id ? store.templates.findIndex((template)=>template.id === input.id) : -1;
    const existing = existingIndex >= 0 ? store.templates[existingIndex] : undefined;
    const timestamp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nowIso"])();
    const template = {
        id: existing?.id ?? input.id ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"])("tpl"),
        slug: input.slug,
        name: input.name,
        category: input.category,
        description: input.description,
        coverUrl: input.coverUrl,
        coverPalette: input.coverPalette ?? existing?.coverPalette ?? [
            "#0f766e",
            "#c88925",
            "#e75f48",
            "#416b4a"
        ],
        tags: input.tags ?? existing?.tags ?? [
            input.category
        ],
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
}),
"[project]/src/lib/queue/generationQueue.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enqueueGenerationJob",
    ()=>enqueueGenerationJob
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prompt$2f$composePrompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prompt/composePrompt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$providers$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/providers/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/data/store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$assetService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/assetService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$templateService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/templateService.ts [app-route] (ecmascript)");
;
;
;
;
;
function enqueueGenerationJob(jobId) {
    const runs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getJobRuns"])();
    if (runs.has(jobId)) return;
    const run = runGenerationJob(jobId).finally(()=>{
        runs.delete(jobId);
    });
    runs.set(jobId, run);
}
async function runGenerationJob(jobId) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
    const job = store.jobs.find((item)=>item.id === jobId);
    if (!job || job.status === "CANCELED") return;
    job.status = "RUNNING";
    job.startedAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nowIso"])();
    const template = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$templateService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTemplate"])(job.templateId);
    if (!template) {
        failJob(job, "Template not found");
        return;
    }
    const provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$providers$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getImageProvider"])();
    const references = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$assetService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAssetsByIds"])(job.referenceAssetIds, job.userId);
    for (const variables of job.promptMatrix){
        const latestJob = store.jobs.find((item)=>item.id === jobId);
        if (latestJob?.status === "CANCELED") return;
        await delay(420);
        try {
            const composed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prompt$2f$composePrompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["composePrompt"])({
                template,
                variables,
                settings: job.settings
            });
            const [result] = await provider.generate({
                referenceImages: references.map((asset)=>({
                        url: asset.url,
                        mimeType: asset.mimeType
                    })),
                prompt: composed.prompt,
                negativePrompt: composed.negativePrompt,
                width: 900,
                height: 1125,
                metadata: {
                    templateName: template.name,
                    variables
                }
            });
            const url = `data:${result.mimeType};base64,${result.buffer.toString("base64")}`;
            const asset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$assetService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAsset"])({
                userId: job.userId,
                type: "GENERATED_IMAGE",
                url,
                thumbUrl: url,
                mimeType: result.mimeType,
                size: result.buffer.byteLength,
                width: result.width,
                height: result.height,
                metadata: {
                    jobId: job.id,
                    provider: provider.id,
                    providerModel: provider.model
                }
            });
            const image = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"])("img"),
                userId: job.userId,
                jobId: job.id,
                assetId: asset.id,
                url,
                thumbUrl: url,
                prompt: composed.prompt,
                negativePrompt: composed.negativePrompt,
                variables,
                provider: provider.id,
                providerModel: provider.model,
                seed: result.seed,
                width: result.width,
                height: result.height,
                isFavorite: false,
                createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nowIso"])()
            };
            store.images.push(image);
        } catch (error) {
            job.errorMessage = error instanceof Error ? error.message : "Unknown generation error";
        }
    }
    const imageCount = store.images.filter((image)=>image.jobId === job.id && !image.deletedAt).length;
    job.status = imageCount > 0 ? "SUCCEEDED" : "FAILED";
    job.completedAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nowIso"])();
}
function failJob(job, message) {
    job.status = "FAILED";
    job.errorMessage = message;
    job.completedAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nowIso"])();
}
function delay(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
}),
"[project]/src/server/services/generationJobService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createGenerationJob",
    ()=>createGenerationJob,
    "getJobDetail",
    ()=>getJobDetail,
    "listJobs",
    ()=>listJobs,
    "regenerateImageJob",
    ()=>regenerateImageJob
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prompt$2f$buildPromptMatrix$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prompt/buildPromptMatrix.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$queue$2f$generationQueue$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/queue/generationQueue.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/data/store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$assetService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/assetService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$templateService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/templateService.ts [app-route] (ecmascript)");
;
;
;
;
;
function createGenerationJob(input) {
    const userId = input.userId ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_USER_ID"];
    const template = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$templateService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTemplate"])(input.templateId);
    if (!template || !template.isActive) {
        throw new Error("Template not found or inactive");
    }
    const references = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$assetService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAssetsByIds"])(input.referenceAssetIds, userId);
    if (references.length !== input.referenceAssetIds.length) {
        throw new Error("Reference asset not found");
    }
    const promptMatrix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prompt$2f$buildPromptMatrix$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildPromptMatrix"])({
        template,
        selectedVariables: input.selectedVariables,
        count: input.requestedCount
    });
    const job = {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"])("job"),
        userId,
        templateId: template.id,
        status: "QUEUED",
        referenceAssetIds: input.referenceAssetIds,
        requestedCount: input.requestedCount,
        settings: input.settings,
        promptMatrix,
        provider: process.env.IMAGE_PROVIDER ?? "mock",
        providerModel: process.env.IMAGE_PROVIDER === "openai" ? process.env.OPENAI_IMAGE_MODEL : "mock-svg-v1",
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nowIso"])()
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().jobs.unshift(job);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$queue$2f$generationQueue$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enqueueGenerationJob"])(job.id);
    return job;
}
function listJobs(userId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_USER_ID"]) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().jobs.filter((job)=>job.userId === userId).map((job)=>getJobDetail(job.id, userId)).filter((job)=>Boolean(job));
}
function getJobDetail(jobId, userId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_USER_ID"]) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
    const job = store.jobs.find((item)=>item.id === jobId && item.userId === userId);
    if (!job) return undefined;
    const images = store.images.filter((image)=>image.jobId === job.id && !image.deletedAt);
    const failed = job.status === "FAILED" ? Math.max(job.requestedCount - images.length, 1) : 0;
    return {
        ...job,
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$templateService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTemplate"])(job.templateId),
        progress: {
            total: job.requestedCount,
            completed: images.length,
            failed
        },
        images
    };
}
function regenerateImageJob(imageId, userId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_USER_ID"], settingsPatch) {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
    const source = store.images.find((image)=>image.id === imageId && image.userId === userId && !image.deletedAt);
    if (!source) throw new Error("Image not found");
    const sourceJob = store.jobs.find((job)=>job.id === source.jobId);
    if (!sourceJob) throw new Error("Source job not found");
    const job = {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["id"])("job"),
        userId,
        templateId: sourceJob.templateId,
        status: "QUEUED",
        referenceAssetIds: sourceJob.referenceAssetIds,
        requestedCount: 1,
        settings: {
            ...sourceJob.settings,
            ...settingsPatch
        },
        promptMatrix: [
            source.variables
        ],
        provider: process.env.IMAGE_PROVIDER ?? "mock",
        providerModel: process.env.IMAGE_PROVIDER === "openai" ? process.env.OPENAI_IMAGE_MODEL : "mock-svg-v1",
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$data$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nowIso"])()
    };
    store.jobs.unshift(job);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$queue$2f$generationQueue$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enqueueGenerationJob"])(job.id);
    return job;
}
}),
"[project]/src/server/services/validation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createGenerationJobSchema",
    ()=>createGenerationJobSchema,
    "favoriteSchema",
    ()=>favoriteSchema,
    "generationSettingsSchema",
    ()=>generationSettingsSchema,
    "regenerateSchema",
    ()=>regenerateSchema,
    "selectedVariablesSchema",
    ()=>selectedVariablesSchema,
    "templateSchema",
    ()=>templateSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const generationSettingsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    identityStrength: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "normal",
        "strong"
    ]).default("strong"),
    locationConsistency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "normal",
        "strong"
    ]).default("strong"),
    creativity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "safe",
        "balanced",
        "wild"
    ]).default("balanced"),
    customNote: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(1200).optional(),
    negativePrompt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(1200).optional()
});
const selectedVariablesSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    seasons: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    times: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    angles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    lenses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    filmLooks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    outfits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    moods: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
}).default({});
const createGenerationJobSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    templateId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    referenceAssetIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1).max(3),
    requestedCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(4),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(6),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(9),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(12)
    ]),
    settings: generationSettingsSchema,
    selectedVariables: selectedVariablesSchema.optional()
});
const variableOptionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    prompt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
});
const templateVariablesSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    seasons: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(variableOptionSchema).min(1),
    times: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(variableOptionSchema).min(1),
    angles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(variableOptionSchema).min(1),
    lenses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(variableOptionSchema).min(1),
    filmLooks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(variableOptionSchema).min(1),
    outfits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(variableOptionSchema).min(1),
    moods: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(variableOptionSchema).min(1)
});
const templateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    coverUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    coverPalette: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1).default([
        "#0f766e",
        "#c88925",
        "#e75f48",
        "#416b4a"
    ]),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).default([]),
    locationAnchor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        placeName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        stableElements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1),
        foreground: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1),
        background: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1),
        lighting: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1),
        colorPalette: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).min(1),
        avoidElements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
    }),
    promptBase: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    negativePrompt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    variables: templateVariablesSchema,
    defaultSettings: generationSettingsSchema.optional(),
    isActive: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true)
});
const favoriteSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    isFavorite: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean()
});
const regenerateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    creativity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "safe",
        "balanced",
        "wild"
    ]).optional(),
    customNote: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(1200).optional()
});
}),
"[project]/src/app/api/generation-jobs/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$2_b2b5bf9f887181a2984b81848e41da58$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_@babel+core@7.2_b2b5bf9f887181a2984b81848e41da58/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$generationJobService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/generationJobService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/validation.ts [app-route] (ecmascript)");
;
;
;
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$2_b2b5bf9f887181a2984b81848e41da58$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        items: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$generationJobService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listJobs"])()
    });
}
async function POST(request) {
    const payload = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createGenerationJobSchema"].parse(await request.json());
    const job = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$generationJobService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createGenerationJob"])(payload);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$2_b2b5bf9f887181a2984b81848e41da58$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        jobId: job.id,
        status: job.status
    }, {
        status: 201
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0tl7up5._.js.map