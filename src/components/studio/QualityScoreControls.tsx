"use client";

import type { GeneratedImage } from "@/types/studio";

type QualityScoreControlsProps = {
  image: GeneratedImage;
  disabled?: boolean;
  onRate: (image: GeneratedImage, scores: Partial<Pick<GeneratedImage, "scoreIdentity" | "scoreLocation" | "scoreComposition">>) => void;
};

const fields = [
  { key: "scoreIdentity", label: "Identity" },
  { key: "scoreLocation", label: "Location" },
  { key: "scoreComposition", label: "Composition" }
] as const;

export function QualityScoreControls({ image, disabled, onRate }: QualityScoreControlsProps) {
  return (
    <div className="quality-scores">
      {fields.map((field) => (
        <label className="score-field" key={field.key}>
          <span>{field.label}</span>
          <select
            value={image[field.key] ?? ""}
            disabled={disabled}
            onChange={(event) => onRate(image, { [field.key]: event.target.value ? Number(event.target.value) : null })}
            aria-label={`${field.label} score`}
          >
            <option value="">-</option>
            {[1, 2, 3, 4, 5].map((score) => (
              <option value={score} key={score}>{score}</option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
