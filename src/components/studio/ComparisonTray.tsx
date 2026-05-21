"use client";

import { X } from "lucide-react";
import type { GeneratedImage } from "@/types/studio";

type ComparisonTrayProps = {
  images: GeneratedImage[];
  onRemove: (imageId: string) => void;
  onClear: () => void;
};

export function ComparisonTray({ images, onRemove, onClear }: ComparisonTrayProps) {
  if (!images.length) return null;

  return (
    <section className="compare-panel" aria-label="批量对比">
      <div className="compare-head">
        <div>
          <strong>对比浏览</strong>
          <span>{images.length} 张</span>
        </div>
        <button className="small-button" type="button" onClick={onClear}>清空</button>
      </div>
      <div className="compare-grid">
        {images.map((image) => (
          <article className="compare-card" key={image.id}>
            <button className="tool-button compare-remove" type="button" aria-label="移出对比" onClick={() => onRemove(image.id)}><X size={14} /></button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt="对比图" />
            <div className="compare-meta">
              <strong>{image.variables.season.label} · {image.variables.timeOfDay.label}</strong>
              <span>{image.variables.angle.label} · {image.variables.lens.label} · {image.variables.filmLook.label}</span>
              <span>I {image.scoreIdentity ?? "-"} / L {image.scoreLocation ?? "-"} / C {image.scoreComposition ?? "-"}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
