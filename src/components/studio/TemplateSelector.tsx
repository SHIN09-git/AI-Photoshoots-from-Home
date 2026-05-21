"use client";

import { templateCoverUrl } from "@/lib/templateCover";
import type { StudioTemplate } from "@/types/studio";

type TemplateSelectorProps = {
  templates: StudioTemplate[];
  selectedTemplateId?: string;
  onSelect: (templateId: string) => void;
};

export function TemplateSelector({ templates, selectedTemplateId, onSelect }: TemplateSelectorProps) {
  return (
    <section className="rail-section">
      <div className="section-head">
        <h2 className="section-title">地点摄影棚</h2>
        <span className="section-kicker">{templates.length} 个启用</span>
      </div>
      <div className="template-list">
        {templates.map((template) => (
          <button
            className={`template-card ${template.id === selectedTemplateId ? "selected" : ""}`}
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
          >
            <span className="template-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={templateCoverUrl(template)} alt={template.name} />
            </span>
            <span className="template-meta">
              <span className="template-name">{template.name}</span>
              <span className="template-desc">{template.description}</span>
              <span className="tag-row">
                {template.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
