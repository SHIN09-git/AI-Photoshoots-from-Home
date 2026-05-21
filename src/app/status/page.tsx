import { getSystemStatus } from "@/server/services/systemStatusService";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const status = await getSystemStatus();

  return (
    <section className="page-panel">
      <div className="gallery-toolbar">
        <div>
          <h1 className="workspace-title">Alpha 状态</h1>
          <p className="workspace-subtitle">最近检查：{new Date(status.checkedAt).toLocaleString("zh-CN")}</p>
        </div>
      </div>
      <div className="status-grid">
        {status.items.map((item) => (
          <article className="status-card" key={item.name}>
            <span className={`health-dot ${item.ok ? "ok" : "bad"}`} />
            <div>
              <strong>{statusLabel(item.name)}</strong>
              <p>{item.label}</p>
              <span>{item.detail ?? "no detail"}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function statusLabel(name: string): string {
  return {
    database: "Database",
    storage: "Storage",
    provider: "Provider"
  }[name] ?? name;
}
