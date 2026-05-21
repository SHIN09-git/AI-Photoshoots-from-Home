"use client";

import { X } from "lucide-react";
import type { GeneratedImage } from "@/types/studio";

type PromptPreviewDrawerProps = {
  image?: GeneratedImage | null;
  onClose: () => void;
};

export function PromptPreviewDrawer({ image, onClose }: PromptPreviewDrawerProps) {
  if (!image) return null;
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="提示词详情" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <strong>{image.variables.season.label} · {image.variables.timeOfDay.label}</strong>
            <div className="tiny-note">{image.variables.angle.label} · {image.variables.lens.label}</div>
          </div>
          <button className="tool-button" type="button" onClick={onClose} aria-label="关闭"><X size={16} /></button>
        </div>
        <div className="drawer-body">
          <div className="prompt-summary">
            <span>Provider: {image.provider}{image.providerModel ? ` / ${image.providerModel}` : ""}</span>
            <span>Seed: {image.seed ?? "-"}</span>
            <span>Scores: I {image.scoreIdentity ?? "-"} · L {image.scoreLocation ?? "-"} · C {image.scoreComposition ?? "-"}</span>
          </div>
          <div className="field">
            <label>Prompt</label>
            <pre className="prompt-box">{image.prompt}</pre>
          </div>
          <div className="field">
            <label>Negative Prompt</label>
            <pre className="prompt-box">{image.negativePrompt}</pre>
          </div>
        </div>
      </aside>
    </div>
  );
}
