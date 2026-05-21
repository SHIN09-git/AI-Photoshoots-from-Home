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

const baseTemplates = [
  {
    id: "tpl_tokyo",
    slug: "tokyo-tower-night-street",
    name: "东京塔夜景街拍",
    category: "城市街拍",
    description: "以东京塔为远景锚点，适合蓝调时刻、夜景、雨后反光街道的人像写真。",
    enabled: true,
    version: 1,
    tags: ["夜景", "城市", "反光街道"],
    coverPalette: ["#16324f", "#f49b38", "#10211f", "#f6c47c"],
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
    negativePrompt: "crowded tourists, blocked landmark, aggressive signage"
  },
  {
    id: "tpl_chongqing",
    slug: "chongqing-mountain-city-night-alley",
    name: "重庆山城夜巷",
    category: "川渝烟火",
    description: "潮湿石板路、暖色小店灯、坡道和层叠楼宇，适合烟火气街拍。",
    enabled: true,
    version: 1,
    tags: ["烟火气", "坡道", "暖灯"],
    coverPalette: ["#263a30", "#d38b32", "#9d3027", "#10222d"],
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
    negativePrompt: "flat modern mall, empty studio background, harsh white light"
  },
  {
    id: "tpl_sakura",
    slug: "spring-sakura-slope",
    name: "春日樱花坡道",
    category: "日系清新",
    description: "坡道、樱花、柔和逆光，适合清爽日常写真。",
    enabled: true,
    version: 1,
    tags: ["樱花", "清晨", "柔和逆光"],
    coverPalette: ["#f3b6c5", "#f7f0e1", "#8fb6d8", "#7b925d"],
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
    negativePrompt: "overly saturated neon, crowded road, harsh contrast"
  }
];

const variableSets = {
  seasons: [
    { id: "spring", label: "春", prompt: "spring atmosphere, fresh air, soft blossoms, gentle colors, subtle seasonal details" },
    { id: "summer", label: "夏", prompt: "summer evening, humid air, slightly glowing skin, vivid city colors, light breathable outfit" },
    { id: "autumn", label: "秋", prompt: "autumn mood, golden leaves, dry crisp air, warm earthy palette, elegant calm atmosphere" },
    { id: "winter", label: "冬", prompt: "winter atmosphere, cold air, layered outfit, subtle breath mist, cool shadows, warm lights" },
    { id: "rainy", label: "雨季", prompt: "rainy season, wet pavement, reflections, umbrella optional, moody cinematic atmosphere" },
    { id: "snow", label: "雪天", prompt: "light snow, clean air, soft flakes, quiet street, cool highlights and warm practical lights" }
  ],
  times: [
    { id: "morning", label: "清晨", prompt: "early morning soft light, gentle shadows, quiet street, fresh and clean atmosphere" },
    { id: "afternoon", label: "午后", prompt: "afternoon natural light, clear details, balanced contrast, relaxed daily portrait feeling" },
    { id: "golden-hour", label: "黄昏", prompt: "golden hour warm sunlight, long shadows, glowing rim light, romantic cinematic warmth" },
    { id: "blue-hour", label: "蓝调时刻", prompt: "blue hour sky, city lights just turned on, elegant contrast between cool ambient light and warm lamps" },
    { id: "night", label: "夜晚", prompt: "night street photography, neon bokeh, warm practical lights, controlled face lighting" },
    { id: "late-night", label: "深夜", prompt: "late night quiet mood, sparse practical lights, calm cinematic darkness, clean subject lighting" }
  ],
  angles: [
    { id: "front-half-body", label: "正面半身", prompt: "front-facing half-body portrait, subject looking naturally toward camera, balanced composition" },
    { id: "over-shoulder", label: "侧身回眸", prompt: "over-the-shoulder pose, subject turning back naturally, dynamic candid moment" },
    { id: "low-angle", label: "低机位", prompt: "low-angle environmental portrait, confident posture, landmark rising behind subject" },
    { id: "high-angle", label: "高机位", prompt: "slightly high camera angle, elegant framing, visible ground texture and layered background" },
    { id: "wide-environment", label: "远景环境人像", prompt: "wide environmental portrait, full body visible, strong sense of place, subject integrated into the scene" },
    { id: "close-up", label: "近景特写", prompt: "close-up portrait, shallow depth of field, expressive eyes, background landmark softly blurred" }
  ],
  lenses: [
    { id: "35mm", label: "35mm", prompt: "35mm lens look, environmental context, natural perspective, moderate depth of field" },
    { id: "50mm", label: "50mm", prompt: "50mm lens look, natural perspective, balanced subject and background separation" },
    { id: "85mm", label: "85mm", prompt: "85mm portrait lens look, shallow depth of field, compressed background, creamy bokeh" },
    { id: "wide", label: "广角环境", prompt: "wide-angle street photography, dynamic perspective, strong leading lines, no face distortion" },
    { id: "tele", label: "长焦压缩", prompt: "telephoto compressed background, elegant layering, strong subject isolation, natural face shape" }
  ],
  filmLooks: [
    { id: "warm-portrait-film", label: "暖调人像", prompt: "warm portrait film color, soft highlight rolloff, fine grain, flattering but natural skin tone" },
    { id: "high-iso-night-grain", label: "高感颗粒", prompt: "high ISO night film grain, rich shadows, slight halation around lights, documentary street feeling" },
    { id: "cinematic-daylight", label: "电影日光", prompt: "cinematic daylight color grading, clean contrast, subtle film grain, natural dynamic range" },
    { id: "neon-night", label: "霓虹夜景", prompt: "neon night color finish, controlled saturated practical lights, clean face exposure, rich dark tones" },
    { id: "classic-bw", label: "经典黑白", prompt: "classic black and white photography, strong tonal contrast, rich midtones, timeless portrait mood" }
  ],
  outfits: [
    { id: "minimal-black", label: "黑色简洁", prompt: "minimal black outfit, clean silhouette, understated styling, contemporary editorial feeling" },
    { id: "light-coat", label: "浅色外套", prompt: "light neutral coat, soft fabric texture, simple layered outfit, natural daily styling" },
    { id: "street-layer", label: "街头层次", prompt: "streetwear layered outfit, relaxed fit, practical texture, not too flashy" }
  ],
  moods: [
    { id: "calm", label: "安静", prompt: "calm expression, natural posture, introspective but approachable mood" },
    { id: "candid", label: "抓拍", prompt: "candid moment, slight movement, natural micro-expression, documentary realism" },
    { id: "confident", label: "自信", prompt: "confident posture, composed expression, editorial presence without exaggeration" }
  ]
};

const defaultState = {
  view: "studio",
  selectedTemplateSlug: "chongqing-mountain-city-night-alley",
  selectedCount: 6,
  selectedVariables: {
    seasons: ["spring", "summer", "autumn", "winter", "rainy"],
    times: ["blue-hour", "night"],
    angles: ["front-half-body", "over-shoulder", "low-angle", "wide-environment", "close-up"],
    lenses: ["35mm", "50mm", "85mm"],
    filmLooks: ["warm-portrait-film", "high-iso-night-grain", "cinematic-daylight"],
    outfits: ["minimal-black"],
    moods: ["candid"]
  },
  settings: {
    identityStrength: "strong",
    locationConsistency: "strong",
    creativity: "balanced",
    customNote: "服装偏黑色简洁，整体更像时尚街拍。",
    negativePrompt: ""
  },
  consent: false,
  references: [],
  templates: [],
  jobs: [],
  activeJobId: null,
  promptDrawerImageId: null,
  galleryFilter: "all",
  editingTemplateId: null,
  jobTimer: null
};

let state = structuredClone(defaultState);

const app = document.querySelector("#app");
const toastEl = document.querySelector("#toast");

function bootstrap() {
  const storedTemplates = load("ai-photo-studio-templates");
  const storedJobs = load("ai-photo-studio-jobs");
  state.templates = Array.isArray(storedTemplates) && storedTemplates.length ? storedTemplates : structuredClone(baseTemplates);
  state.jobs = Array.isArray(storedJobs) ? storedJobs : [];
  state.view = normalizeHash(location.hash.replace("#", "")) || "studio";
  window.addEventListener("hashchange", () => {
    state.view = normalizeHash(location.hash.replace("#", "")) || "studio";
    render();
  });
  render();
}

function normalizeHash(hash) {
  return ["studio", "gallery", "templates", "admin", "settings"].includes(hash) ? hash : "";
}

function saveTemplates() {
  localStorage.setItem("ai-photo-studio-templates", JSON.stringify(state.templates));
}

function saveJobs() {
  const serializableJobs = state.jobs.map((job) => ({ ...job, timer: undefined }));
  localStorage.setItem("ai-photo-studio-jobs", JSON.stringify(serializableJobs));
}

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function render() {
  app.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">AI</span>
        <span>AI 摄影棚</span>
      </div>
      <nav class="nav" aria-label="主导航">
        ${navButton("studio", "摄影棚")}
        ${navButton("gallery", "画廊")}
        ${navButton("templates", "模板")}
        ${navButton("admin", "后台")}
        ${navButton("settings", "设置")}
      </nav>
      <div class="status-strip">
        <span class="status-dot"></span>
        <span>Provider: Mock</span>
      </div>
    </header>
    <main class="page">
      ${renderCurrentView()}
    </main>
    ${renderDrawer()}
  `;
  bindEvents();
}

function navButton(view, label) {
  return `<button type="button" data-nav="${view}" aria-current="${state.view === view ? "page" : "false"}">${label}</button>`;
}

function renderCurrentView() {
  if (state.view === "gallery") return renderGallery();
  if (state.view === "templates") return renderTemplateBrowser();
  if (state.view === "admin") return renderAdmin();
  if (state.view === "settings") return renderSettings();
  return renderStudio();
}

function renderStudio() {
  const activeJob = getActiveJob();
  const selectedTemplate = getSelectedTemplate();
  return `
    <section class="studio-grid">
      <aside class="rail">
        ${renderUploader()}
        ${renderTemplateSelector()}
        ${renderVariablePanel()}
        ${renderAdvancedSettings()}
      </aside>
      <section class="workspace-panel">
        <div class="workspace-head">
          <div>
            <h1 class="workspace-title">摄影棚工作台</h1>
            <p class="workspace-subtitle">${selectedTemplate ? selectedTemplate.name : "选择一个启用中的摄影棚模板"} · ${state.selectedCount} 张 · ${selectedTemplate?.category || "未分类"}</p>
          </div>
          <div class="stack">
            <button class="primary-button" type="button" data-action="generate" ${canGenerate() ? "" : "disabled"}>${generateButtonLabel(activeJob)}</button>
            <button class="ghost-button" type="button" data-action="regenerate-group" ${activeJob?.images?.length ? "" : "disabled"}>重做整组</button>
          </div>
        </div>
        ${renderJobBar(activeJob)}
        <div class="results-wrap">
          ${activeJob && activeJob.images.length ? renderResultGrid(activeJob.images, activeJob) : renderEmptyResults()}
        </div>
      </section>
    </section>
  `;
}

function renderUploader() {
  const refs = state.references.map((ref) => `
    <div class="reference-card">
      <img src="${ref.dataUrl}" alt="${escapeHtml(ref.name)}" />
      <button class="tool-button danger" type="button" title="删除参考图" data-action="remove-reference" data-ref-id="${ref.id}">×</button>
    </div>
  `).join("");

  return `
    <section class="rail-section">
      <div class="section-head">
        <h2 class="section-title">人像参考</h2>
        <span class="section-kicker">${state.references.length}/3</span>
      </div>
      <div class="dropzone" data-dropzone>
        <div class="dropzone-main">
          <div class="upload-icon">+</div>
          <div>
            <strong>上传 JPG / PNG / WEBP</strong>
            <div class="tiny-note">单张最大 10MB</div>
          </div>
          <label class="small-button">
            选择
            <input class="file-input" type="file" accept="image/jpeg,image/png,image/webp" multiple data-file-input />
          </label>
        </div>
        ${state.references.length ? `<div class="reference-list">${refs}</div>` : ""}
      </div>
      <label class="consent-row">
        <input type="checkbox" data-field="consent" ${state.consent ? "checked" : ""} />
        <span>我确认上传的是本人照片，或我已获得照片中人物的明确授权。</span>
      </label>
    </section>
  `;
}

function renderTemplateSelector() {
  const activeTemplates = state.templates.filter((template) => template.enabled);
  const cards = activeTemplates.map((template) => `
    <button type="button" class="template-card ${template.slug === state.selectedTemplateSlug ? "selected" : ""}" data-action="select-template" data-template-slug="${template.slug}">
      <span class="template-cover"><img src="${coverSvg(template)}" alt="${escapeHtml(template.name)}" /></span>
      <span class="template-meta">
        <span class="template-name">${escapeHtml(template.name)}</span>
        <span class="template-desc">${escapeHtml(template.description)}</span>
        <span class="tag-row">${template.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</span>
      </span>
    </button>
  `).join("");

  return `
    <section class="rail-section">
      <div class="section-head">
        <h2 class="section-title">地点摄影棚</h2>
        <span class="section-kicker">${activeTemplates.length} 个启用</span>
      </div>
      <div class="template-list">${cards}</div>
    </section>
  `;
}

function renderVariablePanel() {
  return `
    <section class="rail-section">
      <div class="section-head">
        <h2 class="section-title">变量矩阵</h2>
        <span class="section-kicker">均衡采样</span>
      </div>
      ${renderCountSelector()}
      ${renderChipGroup("seasons", "季节")}
      ${renderChipGroup("times", "时间")}
      ${renderChipGroup("angles", "角度")}
      ${renderChipGroup("lenses", "镜头")}
      ${renderChipGroup("filmLooks", "胶片感")}
    </section>
  `;
}

function renderCountSelector() {
  return `
    <div class="option-group">
      <div class="option-label"><span>张数</span><span>${state.selectedCount}</span></div>
      <div class="segmented">
        ${[4, 6, 9, 12].map((count) => `<button type="button" data-action="set-count" data-count="${count}" class="${count === state.selectedCount ? "active" : ""}">${count}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderChipGroup(key, label) {
  const activeIds = state.selectedVariables[key] || [];
  const chips = variableSets[key].map((option) => `
    <button type="button" class="chip ${activeIds.includes(option.id) ? "active" : ""}" data-action="toggle-variable" data-key="${key}" data-value="${option.id}">
      ${escapeHtml(option.label)}
    </button>
  `).join("");
  return `
    <div class="option-group">
      <div class="option-label"><span>${label}</span><span>${activeIds.length}</span></div>
      <div class="chip-grid">${chips}</div>
    </div>
  `;
}

function renderAdvancedSettings() {
  return `
    <section class="rail-section">
      <div class="section-head">
        <h2 class="section-title">高级设置</h2>
        <span class="section-kicker">Prompt</span>
      </div>
      <div class="field">
        <label>脸部相似度</label>
        <select data-setting="identityStrength">
          <option value="normal" ${state.settings.identityStrength === "normal" ? "selected" : ""}>标准</option>
          <option value="strong" ${state.settings.identityStrength === "strong" ? "selected" : ""}>强</option>
        </select>
      </div>
      <div class="field">
        <label>地点一致性</label>
        <select data-setting="locationConsistency">
          <option value="normal" ${state.settings.locationConsistency === "normal" ? "selected" : ""}>标准</option>
          <option value="strong" ${state.settings.locationConsistency === "strong" ? "selected" : ""}>强</option>
        </select>
      </div>
      <div class="field">
        <label>创意强度</label>
        <select data-setting="creativity">
          <option value="safe" ${state.settings.creativity === "safe" ? "selected" : ""}>保守</option>
          <option value="balanced" ${state.settings.creativity === "balanced" ? "selected" : ""}>平衡</option>
          <option value="wild" ${state.settings.creativity === "wild" ? "selected" : ""}>放飞</option>
        </select>
      </div>
      <div class="field">
        <label>自定义补充提示词</label>
        <textarea data-setting="customNote">${escapeHtml(state.settings.customNote)}</textarea>
      </div>
      <div class="field">
        <label>负面提示词补充</label>
        <textarea data-setting="negativePrompt">${escapeHtml(state.settings.negativePrompt)}</textarea>
      </div>
    </section>
  `;
}

function renderJobBar(job) {
  if (!job) {
    return `
      <div class="job-bar">
        <div>
          <div class="progress-meta"><span>等待创建任务</span><span>0/0</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: 0%"></div></div>
        </div>
        <span class="tag">QUEUED</span>
      </div>
    `;
  }
  const percent = job.requestedCount ? Math.round((job.progress.completed / job.requestedCount) * 100) : 0;
  return `
    <div class="job-bar">
      <div>
        <div class="progress-meta">
          <span>${statusText(job.status)}</span>
          <span>${job.progress.completed}/${job.requestedCount}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div>
      </div>
      <span class="tag">${job.status}</span>
    </div>
  `;
}

function renderEmptyResults() {
  return `
    <div class="empty-state">
      <div class="empty-state-inner">
        <div class="empty-art">6</div>
        <h2>上传一张人像，选择一个摄影棚。</h2>
        <p>我会帮你在同一地点生成不同季节、时间和角度的写真。</p>
      </div>
    </div>
  `;
}

function renderResultGrid(images, job) {
  return `<div class="result-grid">${images.filter((image) => !image.deleted).map((image, index) => renderResultCard(image, job, index)).join("")}</div>`;
}

function renderResultCard(image, job, displayIndex) {
  return `
    <article class="result-card">
      <div class="result-image">
        <img src="${image.url}" alt="${escapeHtml(image.templateName)} ${displayIndex + 1}" />
        <span class="result-index">#${displayIndex + 1}</span>
      </div>
      <div class="result-body">
        <div class="result-title">
          <strong>${escapeHtml(image.templateName)}</strong>
          <span class="tag">${escapeHtml(image.seed)}</span>
        </div>
        <div class="tag-row">
          <span class="tag">${escapeHtml(image.variables.season.label)}</span>
          <span class="tag">${escapeHtml(image.variables.timeOfDay.label)}</span>
          <span class="tag">${escapeHtml(image.variables.lens.label)}</span>
          <span class="tag">${escapeHtml(image.variables.angle.label)}</span>
        </div>
        <div class="result-actions">
          <button class="tool-button ${image.isFavorite ? "active" : ""}" type="button" title="收藏" data-action="favorite-image" data-image-id="${image.id}">♡</button>
          <button class="tool-button" type="button" title="下载" data-action="download-image" data-image-id="${image.id}">↓</button>
          <button class="tool-button" type="button" title="重做" data-action="regenerate-image" data-image-id="${image.id}">↻</button>
          <button class="tool-button" type="button" title="查看提示词" data-action="open-prompt" data-image-id="${image.id}">≡</button>
          <button class="tool-button danger" type="button" title="删除" data-action="delete-image" data-image-id="${image.id}">×</button>
        </div>
      </div>
    </article>
  `;
}

function renderGallery() {
  const images = allImages().filter((image) => !image.deleted);
  const filtered = state.galleryFilter === "favorites" ? images.filter((image) => image.isFavorite) : images;
  return `
    <section class="page-panel">
      <div class="gallery-toolbar">
        <div>
          <h1 class="workspace-title">我的作品</h1>
          <p class="workspace-subtitle">${state.jobs.length} 个任务 · ${images.length} 张图片 · ${images.filter((image) => image.isFavorite).length} 个收藏</p>
        </div>
        <div class="segmented" style="width: 220px;">
          <button type="button" data-action="set-gallery-filter" data-filter="all" class="${state.galleryFilter === "all" ? "active" : ""}">全部</button>
          <button type="button" data-action="set-gallery-filter" data-filter="favorites" class="${state.galleryFilter === "favorites" ? "active" : ""}">收藏</button>
        </div>
      </div>
      ${filtered.length ? `<div class="gallery-grid">${filtered.map((image, index) => renderGalleryCard(image, index)).join("")}</div>` : renderGalleryEmpty()}
    </section>
  `;
}

function renderGalleryCard(image, index) {
  return `
    <article class="gallery-card">
      <div class="result-image">
        <img src="${image.url}" alt="${escapeHtml(image.templateName)}" />
        <span class="result-index">#${index + 1}</span>
      </div>
      <div class="result-body">
        <div class="result-title">
          <strong>${escapeHtml(image.templateName)}</strong>
          <span class="tag">${image.isFavorite ? "已收藏" : "历史"}</span>
        </div>
        <div class="tag-row">
          <span class="tag">${escapeHtml(image.variables.season.label)}</span>
          <span class="tag">${escapeHtml(image.variables.timeOfDay.label)}</span>
          <span class="tag">${escapeHtml(image.variables.angle.label)}</span>
        </div>
        <div class="result-actions">
          <button class="tool-button ${image.isFavorite ? "active" : ""}" type="button" title="收藏" data-action="favorite-image" data-image-id="${image.id}">♡</button>
          <button class="tool-button" type="button" title="下载" data-action="download-image" data-image-id="${image.id}">↓</button>
          <button class="tool-button" type="button" title="查看提示词" data-action="open-prompt" data-image-id="${image.id}">≡</button>
          <button class="tool-button danger" type="button" title="删除" data-action="delete-image" data-image-id="${image.id}">×</button>
        </div>
      </div>
    </article>
  `;
}

function renderGalleryEmpty() {
  return `
    <div class="empty-state">
      <div class="empty-state-inner">
        <div class="empty-art">0</div>
        <h2>还没有作品</h2>
        <p>完成一次 Mock 批量生成后，历史任务和收藏会出现在这里。</p>
      </div>
    </div>
  `;
}

function renderTemplateBrowser() {
  const cards = state.templates.map((template) => `
    <article class="template-browser-card">
      <div class="template-cover"><img src="${coverSvg(template)}" alt="${escapeHtml(template.name)}" /></div>
      <div class="result-body">
        <div class="result-title">
          <strong>${escapeHtml(template.name)}</strong>
          <span class="tag">v${template.version}</span>
        </div>
        <p class="template-desc" style="-webkit-line-clamp: 3;">${escapeHtml(template.description)}</p>
        <div class="tag-row">
          <span class="tag">${escapeHtml(template.category)}</span>
          ${template.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
    </article>
  `).join("");
  return `
    <section class="page-panel">
      <div class="gallery-toolbar">
        <div>
          <h1 class="workspace-title">模板浏览</h1>
          <p class="workspace-subtitle">${state.templates.length} 个地点摄影棚</p>
        </div>
        <button class="ghost-button" type="button" data-nav="admin">管理模板</button>
      </div>
      <div class="template-browser-grid">${cards}</div>
    </section>
  `;
}

function renderAdmin() {
  const editing = state.templates.find((template) => template.id === state.editingTemplateId) || null;
  return `
    <section class="two-col">
      <div class="page-panel">
        <div class="admin-toolbar">
          <div>
            <h1 class="workspace-title">模板后台</h1>
            <p class="workspace-subtitle">${state.templates.filter((template) => template.enabled).length} 个启用中</p>
          </div>
          <button class="primary-button" type="button" data-action="new-template">新建</button>
        </div>
        <div class="admin-list">
          ${state.templates.map((template) => renderAdminTemplateCard(template)).join("")}
        </div>
      </div>
      <div class="page-panel">
        <h2>${editing ? "编辑模板" : "新建模板"}</h2>
        ${renderTemplateForm(editing)}
      </div>
    </section>
  `;
}

function renderAdminTemplateCard(template) {
  return `
    <article class="admin-card">
      <div class="template-cover"><img src="${coverSvg(template)}" alt="${escapeHtml(template.name)}" /></div>
      <div>
        <div class="result-title">
          <strong>${escapeHtml(template.name)}</strong>
          <span class="tag">${template.enabled ? "启用" : "禁用"}</span>
        </div>
        <p class="template-desc">${escapeHtml(template.description)}</p>
      </div>
      <div class="stack">
        <button class="small-button" type="button" data-action="edit-template" data-template-id="${template.id}">编辑</button>
        <button class="small-button" type="button" data-action="duplicate-template" data-template-id="${template.id}">复制</button>
        <button class="small-button" type="button" data-action="toggle-template-enabled" data-template-id="${template.id}">${template.enabled ? "禁用" : "启用"}</button>
      </div>
    </article>
  `;
}

function renderTemplateForm(template) {
  const value = template || {
    name: "",
    slug: "",
    category: "",
    description: "",
    enabled: true,
    tags: [],
    coverPalette: ["#0f766e", "#c88925", "#e75f48", "#416b4a"],
    locationAnchor: {
      placeName: "",
      stableElements: [],
      foreground: [],
      background: [],
      lighting: [],
      colorPalette: [],
      avoidElements: []
    },
    negativePrompt: ""
  };
  return `
    <form data-template-form>
      <input type="hidden" name="id" value="${escapeHtml(value.id || "")}" />
      <div class="form-grid">
        ${formField("name", "名称", value.name)}
        ${formField("slug", "Slug", value.slug)}
        ${formField("category", "分类", value.category)}
        ${formField("tags", "标签（逗号分隔）", value.tags.join(", "))}
        <div class="field full">
          <label>说明</label>
          <textarea name="description">${escapeHtml(value.description)}</textarea>
        </div>
        ${formField("placeName", "地点名称", value.locationAnchor.placeName)}
        ${formField("colorPalette", "地点色彩（逗号分隔）", value.locationAnchor.colorPalette.join(", "))}
        <div class="field full">
          <label>稳定空间锚点（每行一条）</label>
          <textarea name="stableElements">${escapeHtml(value.locationAnchor.stableElements.join("\n"))}</textarea>
        </div>
        <div class="field full">
          <label>前景元素（每行一条）</label>
          <textarea name="foreground">${escapeHtml(value.locationAnchor.foreground.join("\n"))}</textarea>
        </div>
        <div class="field full">
          <label>背景元素（每行一条）</label>
          <textarea name="background">${escapeHtml(value.locationAnchor.background.join("\n"))}</textarea>
        </div>
        <div class="field full">
          <label>光线（每行一条）</label>
          <textarea name="lighting">${escapeHtml(value.locationAnchor.lighting.join("\n"))}</textarea>
        </div>
        <div class="field full">
          <label>负面提示词</label>
          <textarea name="negativePrompt">${escapeHtml(value.negativePrompt || "")}</textarea>
        </div>
        <label class="switch-row">
          <input type="checkbox" name="enabled" ${value.enabled ? "checked" : ""} />
          启用模板
        </label>
      </div>
      <div class="divider"></div>
      <button class="primary-button" type="submit">${template ? "保存模板" : "创建模板"}</button>
    </form>
  `;
}

function formField(name, label, value) {
  return `
    <div class="field">
      <label>${label}</label>
      <input name="${name}" value="${escapeHtml(value || "")}" />
    </div>
  `;
}

function renderSettings() {
  const images = allImages();
  const storageSize = JSON.stringify(state.jobs).length + JSON.stringify(state.templates).length;
  return `
    <section class="page-grid">
      <div class="page-panel">
        <h1 class="workspace-title">设置</h1>
        <p class="workspace-subtitle">Mock Provider · 本地存储 · 无外部 API key</p>
      </div>
      <div class="page-panel" style="grid-column: span 6;">
        <h2>API 状态</h2>
        <div class="tag-row">
          <span class="tag">IMAGE_PROVIDER=mock</span>
          <span class="tag">${state.jobs.length} jobs</span>
          <span class="tag">${images.length} images</span>
          <span class="tag">${Math.ceil(storageSize / 1024)} KB</span>
        </div>
      </div>
      <div class="page-panel" style="grid-column: span 6;">
        <h2>数据删除</h2>
        <div class="tag-row">
          <button class="danger-button" type="button" data-action="clear-jobs">删除全部生成结果</button>
          <button class="ghost-button" type="button" data-action="reset-templates">恢复内置模板</button>
        </div>
      </div>
    </section>
  `;
}

function renderDrawer() {
  if (!state.promptDrawerImageId) return "";
  const image = findImage(state.promptDrawerImageId);
  if (!image) return "";
  return `
    <div class="drawer-backdrop" data-action="close-prompt">
      <aside class="drawer" role="dialog" aria-modal="true" aria-label="提示词详情" data-drawer>
        <div class="drawer-head">
          <div>
            <strong>${escapeHtml(image.templateName)}</strong>
            <div class="tiny-note">${escapeHtml(image.variables.season.label)} · ${escapeHtml(image.variables.timeOfDay.label)} · ${escapeHtml(image.variables.angle.label)}</div>
          </div>
          <button class="tool-button" type="button" title="关闭" data-action="close-prompt">×</button>
        </div>
        <div class="drawer-body">
          <div class="field">
            <label>Prompt</label>
            <div class="prompt-box">${escapeHtml(image.prompt)}</div>
          </div>
          <div class="field">
            <label>Negative Prompt</label>
            <div class="prompt-box">${escapeHtml(image.negativePrompt)}</div>
          </div>
        </div>
      </aside>
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      location.hash = button.dataset.nav;
    });
  });

  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", handleAction);
  });

  document.querySelectorAll("[data-setting]").forEach((field) => {
    field.addEventListener("input", () => {
      state.settings[field.dataset.setting] = field.value;
    });
  });

  const consent = document.querySelector("[data-field='consent']");
  if (consent) {
    consent.addEventListener("change", () => {
      state.consent = consent.checked;
      render();
    });
  }

  const input = document.querySelector("[data-file-input]");
  if (input) {
    input.addEventListener("change", (event) => handleFiles(event.target.files));
  }

  const dropzone = document.querySelector("[data-dropzone]");
  if (dropzone) {
    dropzone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropzone.classList.add("dragging");
    });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragging"));
    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropzone.classList.remove("dragging");
      handleFiles(event.dataTransfer.files);
    });
  }

  const form = document.querySelector("[data-template-form]");
  if (form) {
    form.addEventListener("submit", handleTemplateSubmit);
  }

  const drawer = document.querySelector("[data-drawer]");
  if (drawer) {
    drawer.addEventListener("click", (event) => event.stopPropagation());
  }
}

function handleAction(event) {
  const target = event.currentTarget;
  const action = target.dataset.action;

  if (action === "select-template") {
    state.selectedTemplateSlug = target.dataset.templateSlug;
    render();
  }

  if (action === "set-count") {
    state.selectedCount = Number(target.dataset.count);
    render();
  }

  if (action === "toggle-variable") {
    toggleVariable(target.dataset.key, target.dataset.value);
    render();
  }

  if (action === "generate") startGeneration();
  if (action === "regenerate-group") startGeneration(true);
  if (action === "remove-reference") removeReference(target.dataset.refId);
  if (action === "favorite-image") toggleFavorite(target.dataset.imageId);
  if (action === "download-image") downloadImage(target.dataset.imageId);
  if (action === "regenerate-image") regenerateImage(target.dataset.imageId);
  if (action === "open-prompt") {
    state.promptDrawerImageId = target.dataset.imageId;
    render();
  }
  if (action === "close-prompt") {
    state.promptDrawerImageId = null;
    render();
  }
  if (action === "delete-image") deleteImage(target.dataset.imageId);
  if (action === "set-gallery-filter") {
    state.galleryFilter = target.dataset.filter;
    render();
  }
  if (action === "new-template") {
    state.editingTemplateId = null;
    render();
  }
  if (action === "edit-template") {
    state.editingTemplateId = target.dataset.templateId;
    render();
  }
  if (action === "duplicate-template") duplicateTemplate(target.dataset.templateId);
  if (action === "toggle-template-enabled") toggleTemplateEnabled(target.dataset.templateId);
  if (action === "clear-jobs") clearJobs();
  if (action === "reset-templates") resetTemplates();
}

async function handleFiles(fileList) {
  const files = Array.from(fileList || []);
  for (const file of files) {
    if (state.references.length >= 3) {
      notify("最多上传 3 张人像参考。");
      break;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      notify(`${file.name} 不是支持的图片格式。`);
      continue;
    }
    if (file.size > 10 * 1024 * 1024) {
      notify(`${file.name} 超过 10MB。`);
      continue;
    }
    const dataUrl = await readAsDataUrl(file);
    state.references.push({
      id: id("asset"),
      name: file.name,
      mimeType: file.type,
      size: file.size,
      dataUrl
    });
  }
  render();
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function removeReference(refId) {
  state.references = state.references.filter((ref) => ref.id !== refId);
  render();
}

function toggleVariable(key, value) {
  const list = state.selectedVariables[key] || [];
  if (list.includes(value)) {
    if (list.length === 1) {
      notify("每组变量至少保留 1 个选项。");
      return;
    }
    state.selectedVariables[key] = list.filter((item) => item !== value);
  } else {
    state.selectedVariables[key] = [...list, value];
  }
}

function canGenerate() {
  return Boolean(state.references.length && state.consent && getSelectedTemplate());
}

function generateButtonLabel(job) {
  if (job?.status === "RUNNING" || job?.status === "QUEUED") {
    return `正在生成 ${job.progress.completed}/${job.requestedCount}`;
  }
  if (!state.references.length) return "先上传人像";
  if (!state.consent) return "确认授权后生成";
  if (!getSelectedTemplate()) return "选择摄影棚模板";
  return `生成 ${state.selectedCount} 张写真`;
}

function startGeneration(replace = false) {
  if (!canGenerate()) {
    notify(generateButtonLabel(getActiveJob()));
    return;
  }
  const template = getSelectedTemplate();
  const promptMatrix = buildPromptMatrix(state.selectedVariables, state.selectedCount);
  const job = {
    id: id("job"),
    templateId: template.id,
    templateName: template.name,
    status: "QUEUED",
    requestedCount: state.selectedCount,
    progress: { completed: 0, failed: 0, total: state.selectedCount },
    promptMatrix,
    provider: "mock",
    providerModel: "mock-svg-v1",
    settings: structuredClone(state.settings),
    createdAt: new Date().toISOString(),
    images: []
  };

  if (replace && state.activeJobId) {
    state.jobs = state.jobs.filter((item) => item.id !== state.activeJobId);
  }
  state.jobs.unshift(job);
  state.activeJobId = job.id;
  saveJobs();
  render();

  window.setTimeout(() => {
    job.status = "RUNNING";
    runMockJob(job.id);
    saveJobs();
    render();
  }, 260);
}

function runMockJob(jobId) {
  if (state.jobTimer) {
    window.clearInterval(state.jobTimer);
  }
  state.jobTimer = window.setInterval(() => {
    const job = state.jobs.find((item) => item.id === jobId);
    if (!job || job.status !== "RUNNING") {
      window.clearInterval(state.jobTimer);
      state.jobTimer = null;
      return;
    }
    const template = state.templates.find((item) => item.id === job.templateId);
    const nextIndex = job.images.length;
    const variables = job.promptMatrix[nextIndex];
    const composed = composePrompt(template, variables, job.settings);
    const image = {
      id: id("img"),
      jobId: job.id,
      templateId: template.id,
      templateName: template.name,
      variables,
      prompt: composed.prompt,
      negativePrompt: composed.negativePrompt,
      seed: String(Math.floor(100000 + Math.random() * 899999)),
      provider: "mock",
      providerModel: "mock-svg-v1",
      isFavorite: false,
      deleted: false,
      createdAt: new Date().toISOString()
    };
    image.url = resultSvg(template, image, nextIndex);
    job.images.push(image);
    job.progress.completed = job.images.length;

    if (job.images.length >= job.requestedCount) {
      job.status = "SUCCEEDED";
      job.completedAt = new Date().toISOString();
      window.clearInterval(state.jobTimer);
      state.jobTimer = null;
      notify(`已生成 ${job.requestedCount} 张 Mock 写真。`);
    }
    saveJobs();
    render();
  }, 620);
}

function buildPromptMatrix(selected, count) {
  const pick = (key, index) => {
    const ids = selected[key] && selected[key].length ? selected[key] : [variableSets[key][0].id];
    const idValue = ids[index % ids.length];
    return variableSets[key].find((option) => option.id === idValue) || variableSets[key][0];
  };
  const makeItem = (i) => ({
    season: pick("seasons", i),
    timeOfDay: pick("times", i),
    angle: pick("angles", i),
    lens: pick("lenses", i + Math.floor(i / 2)),
    filmLook: pick("filmLooks", i + Math.floor(i / 3)),
    outfit: pick("outfits", i),
    mood: pick("moods", i)
  });
  const result = [];
  const used = new Set();
  for (let i = 0; result.length < count && i < count * 8; i += 1) {
    const item = makeItem(i);
    const key = JSON.stringify(Object.fromEntries(Object.entries(item).map(([name, option]) => [name, option.id])));
    if (!used.has(key)) {
      used.add(key);
      result.push(item);
    }
  }
  for (let i = 0; result.length < count; i += 1) {
    result.push(makeItem(i));
  }
  return result;
}

function composePrompt(template, variables, settings) {
  const anchor = [
    `Place: ${template.locationAnchor.placeName}`,
    `Stable elements: ${template.locationAnchor.stableElements.join("; ")}`,
    `Foreground: ${template.locationAnchor.foreground.join("; ")}`,
    `Background: ${template.locationAnchor.background.join("; ")}`,
    `Lighting: ${template.locationAnchor.lighting.join("; ")}`,
    `Color palette: ${template.locationAnchor.colorPalette.join(", ")}`,
    template.locationAnchor.avoidElements?.length ? `Avoid: ${template.locationAnchor.avoidElements.join("; ")}` : ""
  ].filter(Boolean).join("\n");

  const identity = settings.identityStrength === "strong"
    ? "Preserve the uploaded person's facial identity with high priority: face shape, facial feature proportions, hairstyle impression, natural skin texture, and overall temperament."
    : "Preserve the uploaded person's facial identity, natural proportions, hairstyle impression, and overall temperament.";

  const locationConsistency = settings.locationConsistency === "strong"
    ? "Keep the same location anchor highly consistent across the batch. Do not replace the place with a generic street or studio."
    : "Keep the location anchor recognizable and coherent.";

  const creativity = {
    safe: "Use conservative realistic variation. Prioritize identity and location stability over novelty.",
    balanced: "Use balanced creative variation while preserving identity and location consistency.",
    wild: "Allow bolder styling and composition while keeping the same person and place recognizable."
  }[settings.creativity];

  const prompt = [
    "Create a realistic editorial portrait photo based on the uploaded person reference.",
    identity,
    "Do not over-beautify or change the person's age, face shape, body shape, or skin texture unnaturally.",
    "",
    "Location anchor:",
    anchor,
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
    settings.customNote || "none"
  ].join("\n");

  const negativePrompt = [GENERAL_NEGATIVE_PROMPT, template.negativePrompt, settings.negativePrompt]
    .filter(Boolean)
    .join(", ");

  return { prompt, negativePrompt };
}

function toggleFavorite(imageId) {
  const image = findImage(imageId);
  if (!image) return;
  image.isFavorite = !image.isFavorite;
  saveJobs();
  render();
}

function deleteImage(imageId) {
  const image = findImage(imageId);
  if (!image) return;
  image.deleted = true;
  if (state.promptDrawerImageId === imageId) state.promptDrawerImageId = null;
  saveJobs();
  render();
}

function regenerateImage(imageId) {
  const image = findImage(imageId);
  const job = state.jobs.find((item) => item.id === image?.jobId);
  const template = state.templates.find((item) => item.id === image?.templateId);
  if (!image || !job || !template) return;
  const composed = composePrompt(template, image.variables, job.settings);
  image.seed = String(Math.floor(100000 + Math.random() * 899999));
  image.prompt = `${composed.prompt}\n\nRegeneration note:\nRefresh this single frame while preserving the same variable combination.`;
  image.negativePrompt = composed.negativePrompt;
  image.url = resultSvg(template, image, Number(image.seed.slice(-2)));
  image.createdAt = new Date().toISOString();
  image.deleted = false;
  saveJobs();
  render();
}

function downloadImage(imageId) {
  const image = findImage(imageId);
  if (!image) return;
  const link = document.createElement("a");
  link.href = image.url;
  link.download = `${image.templateName}-${image.seed}.svg`;
  document.body.append(link);
  link.click();
  link.remove();
}

function handleTemplateSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const idValue = String(formData.get("id") || "");
  const template = {
    id: idValue || id("tpl"),
    slug: String(formData.get("slug") || "").trim() || `custom-${Date.now()}`,
    name: String(formData.get("name") || "").trim() || "未命名摄影棚",
    category: String(formData.get("category") || "").trim() || "自定义",
    description: String(formData.get("description") || "").trim() || "自定义地点摄影棚",
    enabled: formData.get("enabled") === "on",
    version: idValue ? ((state.templates.find((item) => item.id === idValue)?.version || 1) + 1) : 1,
    tags: splitComma(formData.get("tags")),
    coverPalette: paletteFromText(formData.get("colorPalette")),
    locationAnchor: {
      placeName: String(formData.get("placeName") || "").trim() || "custom portrait location",
      stableElements: splitLines(formData.get("stableElements")),
      foreground: splitLines(formData.get("foreground")),
      background: splitLines(formData.get("background")),
      lighting: splitLines(formData.get("lighting")),
      colorPalette: splitComma(formData.get("colorPalette")),
      avoidElements: []
    },
    negativePrompt: String(formData.get("negativePrompt") || "").trim()
  };

  if (!template.locationAnchor.stableElements.length) {
    template.locationAnchor.stableElements = ["consistent location anchor", "recognizable spatial structure"];
  }
  if (!template.locationAnchor.foreground.length) template.locationAnchor.foreground = ["subtle foreground detail"];
  if (!template.locationAnchor.background.length) template.locationAnchor.background = ["layered background"];
  if (!template.locationAnchor.lighting.length) template.locationAnchor.lighting = ["coherent natural portrait lighting"];
  if (!template.locationAnchor.colorPalette.length) template.locationAnchor.colorPalette = ["natural color palette"];
  if (!template.tags.length) template.tags = [template.category];

  const existingIndex = state.templates.findIndex((item) => item.id === template.id);
  if (existingIndex >= 0) {
    state.templates.splice(existingIndex, 1, template);
  } else {
    state.templates.unshift(template);
  }
  state.editingTemplateId = template.id;
  saveTemplates();
  notify("模板已保存。");
  render();
}

function duplicateTemplate(templateId) {
  const template = state.templates.find((item) => item.id === templateId);
  if (!template) return;
  const copy = structuredClone(template);
  copy.id = id("tpl");
  copy.slug = `${copy.slug}-copy-${Date.now().toString().slice(-4)}`;
  copy.name = `${copy.name} 副本`;
  copy.version = 1;
  state.templates.unshift(copy);
  state.editingTemplateId = copy.id;
  saveTemplates();
  render();
}

function toggleTemplateEnabled(templateId) {
  const template = state.templates.find((item) => item.id === templateId);
  if (!template) return;
  template.enabled = !template.enabled;
  template.version = (template.version || 1) + 1;
  saveTemplates();
  render();
}

function clearJobs() {
  state.jobs = [];
  state.activeJobId = null;
  state.promptDrawerImageId = null;
  saveJobs();
  notify("已删除全部生成结果。");
  render();
}

function resetTemplates() {
  state.templates = structuredClone(baseTemplates);
  state.selectedTemplateSlug = "chongqing-mountain-city-night-alley";
  state.editingTemplateId = null;
  saveTemplates();
  notify("已恢复内置模板。");
  render();
}

function getSelectedTemplate() {
  return state.templates.find((template) => template.slug === state.selectedTemplateSlug && template.enabled);
}

function getActiveJob() {
  if (state.activeJobId) return state.jobs.find((job) => job.id === state.activeJobId) || null;
  return state.jobs[0] || null;
}

function allImages() {
  return state.jobs.flatMap((job) => job.images || []);
}

function findImage(imageId) {
  return allImages().find((image) => image.id === imageId);
}

function statusText(status) {
  return {
    QUEUED: "排队中",
    RUNNING: "生成中",
    SUCCEEDED: "完成",
    FAILED: "失败",
    CANCELED: "已取消"
  }[status] || "等待中";
}

function splitLines(value) {
  return String(value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function splitComma(value) {
  return String(value || "").split(/[，,]/).map((item) => item.trim()).filter(Boolean);
}

function paletteFromText(value) {
  const parsed = splitComma(value).filter((item) => /^#[0-9a-f]{6}$/i.test(item));
  return parsed.length ? parsed.slice(0, 4) : ["#0f766e", "#c88925", "#e75f48", "#416b4a"];
}

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function notify(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toastEl.classList.remove("show"), 2600);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function coverSvg(template) {
  const [a, b, c, d] = template.coverPalette || ["#0f766e", "#c88925", "#e75f48", "#416b4a"];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="520" height="390" viewBox="0 0 520 390">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${a}"/>
          <stop offset="0.58" stop-color="${b}"/>
          <stop offset="1" stop-color="${c}"/>
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="10"/></filter>
      </defs>
      <rect width="520" height="390" fill="url(#bg)"/>
      <path d="M0 280 C90 240 120 330 210 282 C310 230 355 256 520 206 L520 390 L0 390 Z" fill="${d}" opacity="0.56"/>
      <path d="M55 320 L145 160 L230 320 Z" fill="#111d19" opacity="0.36"/>
      <path d="M320 322 L382 120 L448 322 Z" fill="#ffffff" opacity="0.16"/>
      <circle cx="370" cy="92" r="46" fill="#fff4d3" opacity="0.78" filter="url(#soft)"/>
      <rect x="34" y="31" width="190" height="28" rx="6" fill="#ffffff" opacity="0.82"/>
      <rect x="34" y="70" width="292" height="18" rx="5" fill="#ffffff" opacity="0.46"/>
      <text x="34" y="55" fill="#17201b" font-size="20" font-family="Arial, sans-serif" font-weight="700">${escapeSvg(template.name)}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function resultSvg(template, image, index) {
  const [a, b, c, d] = template.coverPalette || ["#0f766e", "#c88925", "#e75f48", "#416b4a"];
  const vars = image.variables;
  const offset = (Number(image.seed || index) % 28) - 14;
  const svg = `
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
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="${index + 4}"/>
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
      <rect x="32" y="32" width="430" height="162" rx="14" fill="#101916" opacity="0.66"/>
      <text x="58" y="76" fill="#ffffff" font-size="34" font-family="Arial, sans-serif" font-weight="700">${escapeSvg(template.name)}</text>
      <text x="58" y="114" fill="#fff2c2" font-size="25" font-family="Arial, sans-serif">${escapeSvg(vars.season.label)} · ${escapeSvg(vars.timeOfDay.label)} · ${escapeSvg(vars.angle.label)}</text>
      <text x="58" y="151" fill="#e6f1eb" font-size="22" font-family="Arial, sans-serif">${escapeSvg(vars.lens.label)} · ${escapeSvg(vars.filmLook.label)} · seed ${escapeSvg(image.seed || "")}</text>
      <rect width="900" height="1125" filter="url(#grain)" opacity="0.46"/>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeSvg(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

bootstrap();
