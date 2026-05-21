import type { StudioTemplate } from "@/types/studio";

export function templateCoverUrl(template: Pick<StudioTemplate, "coverUrl" | "coverPalette" | "name">): string {
  if (template.coverUrl) return template.coverUrl;
  const [a, b, c, d] = template.coverPalette.length >= 4
    ? template.coverPalette
    : ["#0f766e", "#c88925", "#e75f48", "#416b4a"];

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
      <text x="34" y="55" fill="#17201b" font-size="20" font-family="Arial, sans-serif" font-weight="700">${escapeXml(template.name)}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
