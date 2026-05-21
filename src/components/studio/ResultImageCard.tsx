"use client";

import { Download, Eye, Heart, RefreshCw, Trash2 } from "lucide-react";
import { QualityScoreControls } from "@/components/studio/QualityScoreControls";
import type { GeneratedImage } from "@/types/studio";

type ResultImageCardProps = {
  image: GeneratedImage;
  index: number;
  onFavorite: (image: GeneratedImage) => void;
  onDelete: (image: GeneratedImage) => void;
  onRegenerate: (image: GeneratedImage) => void;
  onOpenPrompt: (image: GeneratedImage) => void;
  onRate?: (image: GeneratedImage, scores: Partial<Pick<GeneratedImage, "scoreIdentity" | "scoreLocation" | "scoreComposition">>) => void;
  isSelected?: boolean;
  onToggleCompare?: (image: GeneratedImage) => void;
};

export function ResultImageCard({ image, index, onFavorite, onDelete, onRegenerate, onOpenPrompt, onRate, isSelected, onToggleCompare }: ResultImageCardProps) {
  function download() {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = `${image.id}.svg`;
    link.click();
  }

  return (
    <article className="result-card">
      <div className="result-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt={`生成结果 ${index + 1}`} />
        <span className="result-index">#{index + 1}</span>
      </div>
      <div className="result-body">
        <div className="result-title">
          <strong>{image.variables.season.label} · {image.variables.timeOfDay.label}</strong>
          <span className="tag">{image.seed}</span>
        </div>
        <div className="tag-row">
          <span className="tag">{image.variables.angle.label}</span>
          <span className="tag">{image.variables.lens.label}</span>
          <span className="tag">{image.variables.filmLook.label}</span>
        </div>
        <div className="result-actions">
          {onToggleCompare ? (
            <button className={`tool-button ${isSelected ? "active" : ""}`} type="button" title="加入对比" onClick={() => onToggleCompare(image)}>VS</button>
          ) : null}
          <button className={`tool-button ${image.isFavorite ? "active" : ""}`} type="button" title="收藏" onClick={() => onFavorite(image)}><Heart size={15} /></button>
          <button className="tool-button" type="button" title="下载" onClick={download}><Download size={15} /></button>
          <button className="tool-button" type="button" title="重做" onClick={() => onRegenerate(image)}><RefreshCw size={15} /></button>
          <button className="tool-button" type="button" title="查看提示词" onClick={() => onOpenPrompt(image)}><Eye size={15} /></button>
          <button className="tool-button danger" type="button" title="删除" onClick={() => onDelete(image)}><Trash2 size={15} /></button>
        </div>
        {onRate ? <QualityScoreControls image={image} onRate={onRate} /> : null}
      </div>
    </article>
  );
}
