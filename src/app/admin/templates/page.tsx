"use client";

import { useCallback, useEffect, useState } from "react";
import { TemplateForm } from "@/components/admin/TemplateForm";
import { templateCoverUrl } from "@/lib/templateCover";
import type { StudioTemplate } from "@/types/studio";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<StudioTemplate[]>([]);
  const [editing, setEditing] = useState<StudioTemplate | undefined>();

  const refresh = useCallback(async () => {
    const response = await fetch("/api/templates");
    if (response.ok) {
      const data = await response.json() as { items: StudioTemplate[] };
      setTemplates(data.items);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <section className="two-col">
      <div className="page-panel">
        <div className="admin-toolbar">
          <div>
            <h1 className="workspace-title">模板后台</h1>
            <p className="workspace-subtitle">{templates.filter((template) => template.isActive).length} 个启用中</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setEditing(undefined)}>新建</button>
        </div>
        <div className="admin-list">
          {templates.map((template) => (
            <article className="admin-card" key={template.id}>
              <div className="template-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={templateCoverUrl(template)} alt={template.name} />
              </div>
              <div>
                <div className="result-title">
                  <strong>{template.name}</strong>
                  <span className="tag">{template.isActive ? "启用" : "禁用"}</span>
                </div>
                <p className="template-desc">{template.description}</p>
              </div>
              <button className="small-button" type="button" onClick={() => setEditing(template)}>编辑</button>
            </article>
          ))}
        </div>
      </div>
      <div className="page-panel">
        <h2>{editing ? "编辑模板" : "新建模板"}</h2>
        <TemplateForm key={editing?.id ?? "new"} template={editing} onSaved={(template) => {
          setEditing(template);
          void refresh();
        }} />
      </div>
    </section>
  );
}
