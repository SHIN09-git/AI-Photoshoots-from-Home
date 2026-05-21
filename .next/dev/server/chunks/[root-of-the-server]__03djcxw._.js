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
"[project]/src/app/api/assets/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$2_b2b5bf9f887181a2984b81848e41da58$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_@babel+core@7.2_b2b5bf9f887181a2984b81848e41da58/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$assetService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/assetService.ts [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
const uploadTypeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "PERSON_REFERENCE",
    "LOCATION_REFERENCE",
    "TEMPLATE_COVER"
]);
async function POST(request) {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = uploadTypeSchema.parse(formData.get("type") ?? "PERSON_REFERENCE");
    if (!(file instanceof File)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$2_b2b5bf9f887181a2984b81848e41da58$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "file is required"
        }, {
            status: 400
        });
    }
    if (![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg+xml"
    ].includes(file.type)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$2_b2b5bf9f887181a2984b81848e41da58$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "unsupported image type"
        }, {
            status: 400
        });
    }
    if (file.size > 10 * 1024 * 1024) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$2_b2b5bf9f887181a2984b81848e41da58$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "file too large"
        }, {
            status: 400
        });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    const asset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$assetService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAsset"])({
        type,
        url: dataUrl,
        thumbUrl: dataUrl,
        mimeType: file.type,
        size: file.size,
        metadata: {
            originalName: file.name
        }
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_$40$babel$2b$core$40$7$2e$2_b2b5bf9f887181a2984b81848e41da58$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(asset);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__03djcxw._.js.map