import { templateCoverUrl } from "@/lib/templateCover";
import { listTemplates } from "@/server/services/templateService";

export default function TemplatesPage() {
  const templates = listTemplates();

  return (
    <section className="page-panel">
      <div className="gallery-toolbar">
        <div>
          <h1 className="workspace-title">模板浏览</h1>
          <p className="workspace-subtitle">{templates.length} 个地点摄影棚</p>
        </div>
      </div>
      <div className="template-browser-grid">
        {templates.map((template) => (
          <article className="template-browser-card" key={template.id}>
            <div className="template-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={templateCoverUrl(template)} alt={template.name} />
            </div>
            <div className="result-body">
              <div className="result-title">
                <strong>{template.name}</strong>
                <span className="tag">v{template.version}</span>
              </div>
              <p className="template-desc">{template.description}</p>
              <div className="tag-row">
                <span className="tag">{template.category}</span>
                {template.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
