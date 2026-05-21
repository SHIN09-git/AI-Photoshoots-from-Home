"use client";

import type { SelectedVariableInput, StudioTemplate } from "@/types/studio";

type VariablePanelProps = {
  template?: StudioTemplate;
  selectedVariables: SelectedVariableInput;
  count: number;
  onCountChange: (count: 4 | 6 | 9 | 12) => void;
  onToggle: (key: keyof SelectedVariableInput, value: string) => void;
};

const groupLabels: Array<[keyof SelectedVariableInput, string, keyof StudioTemplate["variables"]]> = [
  ["seasons", "季节", "seasons"],
  ["times", "时间", "times"],
  ["angles", "角度", "angles"],
  ["lenses", "镜头", "lenses"],
  ["filmLooks", "胶片感", "filmLooks"]
];

export function VariablePanel({ template, selectedVariables, count, onCountChange, onToggle }: VariablePanelProps) {
  if (!template) return null;

  return (
    <section className="rail-section">
      <div className="section-head">
        <h2 className="section-title">变量矩阵</h2>
        <span className="section-kicker">均衡采样</span>
      </div>
      <div className="option-group">
        <div className="option-label"><span>张数</span><span>{count}</span></div>
        <div className="segmented">
          {[4, 6, 9, 12].map((option) => (
            <button
              className={option === count ? "active" : ""}
              key={option}
              type="button"
              onClick={() => onCountChange(option as 4 | 6 | 9 | 12)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {groupLabels.map(([stateKey, label, templateKey]) => {
        const activeIds = selectedVariables[stateKey] ?? [];
        return (
          <div className="option-group" key={stateKey}>
            <div className="option-label"><span>{label}</span><span>{activeIds.length}</span></div>
            <div className="chip-grid">
              {template.variables[templateKey].map((option) => (
                <button
                  className={`chip ${activeIds.includes(option.id) ? "active" : ""}`}
                  key={option.id}
                  type="button"
                  onClick={() => onToggle(stateKey, option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
