import type { GenerateImageInput, GeneratedImageResult, ImageGenerationProvider } from "@/lib/providers/types";

export class MockImageProvider implements ImageGenerationProvider {
  id = "mock";
  model = "mock-svg-v1";

  async healthCheck(): Promise<boolean> {
    return true;
  }

  async generate(input: GenerateImageInput): Promise<GeneratedImageResult[]> {
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
        providerRaw: { provider: "mock" }
      }
    ];
  }
}

function mockSvg(input: {
  seed: string;
  templateName: string;
  season: string;
  time: string;
  angle: string;
  lens: string;
  filmLook: string;
}): string {
  const palettes = [
    ["#263a30", "#d38b32", "#9d3027", "#10222d"],
    ["#16324f", "#f49b38", "#10211f", "#f6c47c"],
    ["#f3b6c5", "#f7f0e1", "#8fb6d8", "#7b925d"]
  ];
  const palette = palettes[Number(input.seed.slice(-1)) % palettes.length];
  const [a, b, c, d] = palette;
  const offset = (Number(input.seed.slice(-2)) % 28) - 14;
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

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
