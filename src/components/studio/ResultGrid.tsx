"use client";

import { ResultImageCard } from "@/components/studio/ResultImageCard";
import type { GeneratedImage } from "@/types/studio";

type ResultGridProps = {
  images: GeneratedImage[];
  onFavorite: (image: GeneratedImage) => void;
  onDelete: (image: GeneratedImage) => void;
  onRegenerate: (image: GeneratedImage) => void;
  onOpenPrompt: (image: GeneratedImage) => void;
  onRate?: (image: GeneratedImage, scores: Partial<Pick<GeneratedImage, "scoreIdentity" | "scoreLocation" | "scoreComposition">>) => void;
  selectedImageIds?: string[];
  onToggleCompare?: (image: GeneratedImage) => void;
};

export function ResultGrid(props: ResultGridProps) {
  if (!props.images.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-inner">
          <div className="empty-art">6</div>
          <h2>上传一张人像，选择一个摄影棚。</h2>
          <p>我会帮你在同一地点生成不同季节、时间和角度的写真。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-grid">
      {props.images.map((image, index) => (
        <ResultImageCard
          image={image}
          index={index}
          key={image.id}
          onDelete={props.onDelete}
          onFavorite={props.onFavorite}
          onOpenPrompt={props.onOpenPrompt}
          onRate={props.onRate}
          onRegenerate={props.onRegenerate}
          isSelected={props.selectedImageIds?.includes(image.id)}
          onToggleCompare={props.onToggleCompare}
        />
      ))}
    </div>
  );
}
