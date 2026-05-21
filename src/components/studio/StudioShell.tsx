"use client";

import { useEffect, useMemo, useState } from "react";
import { AdvancedSettingsPanel } from "@/components/studio/AdvancedSettingsPanel";
import { JobProgress } from "@/components/studio/JobProgress";
import { PromptPreviewDrawer } from "@/components/studio/PromptPreviewDrawer";
import { ResultGrid } from "@/components/studio/ResultGrid";
import { TemplateSelector } from "@/components/studio/TemplateSelector";
import { VariablePanel } from "@/components/studio/VariablePanel";
import { PersonReferenceUploader } from "@/components/upload/PersonReferenceUploader";
import type { Asset, GeneratedImage, GenerationSettings, JobDetail, SelectedVariableInput, StudioTemplate } from "@/types/studio";

const defaultSelectedVariables: SelectedVariableInput = {
  seasons: ["spring", "summer", "autumn", "winter", "rainy"],
  times: ["blue-hour", "night"],
  angles: ["front-half-body", "over-shoulder", "low-angle", "wide-environment", "close-up"],
  lenses: ["35mm", "50mm", "85mm"],
  filmLooks: ["warm-portrait-film", "high-iso-night-grain", "cinematic-daylight"],
  outfits: ["minimal-black"],
  moods: ["candid"]
};

const defaultSettings: GenerationSettings = {
  identityStrength: "strong",
  locationConsistency: "strong",
  creativity: "balanced",
  customNote: "服装偏黑色简洁，整体更像时尚街拍。",
  negativePrompt: ""
};

export function StudioShell() {
  const [templates, setTemplates] = useState<StudioTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const [references, setReferences] = useState<Asset[]>([]);
  const [consent, setConsent] = useState(false);
  const [count, setCount] = useState<4 | 6 | 9 | 12>(6);
  const [selectedVariables, setSelectedVariables] = useState<SelectedVariableInput>(defaultSelectedVariables);
  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);
  const [activeJobId, setActiveJobId] = useState<string>();
  const [activeJob, setActiveJob] = useState<JobDetail | null>(null);
  const [drawerImage, setDrawerImage] = useState<GeneratedImage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    void fetch("/api/templates")
      .then((response) => response.json())
      .then((data: { items: StudioTemplate[] }) => {
        const active = data.items.filter((template) => template.isActive);
        setTemplates(active);
        setSelectedTemplateId(active.find((template) => template.slug === "chongqing-mountain-city-night-alley")?.id ?? active[0]?.id);
      })
      .catch((reason) => setError(String(reason)));
  }, []);

  useEffect(() => {
    if (!activeJobId) return;
    let closed = false;

    async function refresh() {
      const response = await fetch(`/api/generation-jobs/${activeJobId}`);
      if (!response.ok) throw new Error(await response.text());
      const job = await response.json() as JobDetail;
      if (!closed) {
        setActiveJob(job);
        setIsSubmitting(false);
      }
    }

    void refresh().catch((reason) => setError(String(reason)));
    const interval = window.setInterval(() => {
      void refresh().catch((reason) => setError(String(reason)));
    }, 800);

    return () => {
      closed = true;
      window.clearInterval(interval);
    };
  }, [activeJobId]);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );

  const isRunning = activeJob?.status === "QUEUED" || activeJob?.status === "RUNNING";
  const canGenerate = Boolean(references.length && consent && selectedTemplate && !isRunning && !isSubmitting);

  function toggleVariable(key: keyof SelectedVariableInput, value: string) {
    setSelectedVariables((current) => {
      const values = current[key] ?? [];
      if (values.includes(value)) {
        if (values.length <= 1) return current;
        return { ...current, [key]: values.filter((item) => item !== value) };
      }
      return { ...current, [key]: [...values, value] };
    });
  }

  async function generate() {
    if (!selectedTemplate || !canGenerate) return;
    setError(undefined);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/generation-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          referenceAssetIds: references.map((asset) => asset.id),
          requestedCount: count,
          settings,
          selectedVariables
        })
      });
      if (!response.ok) {
        setError(await response.text());
        setIsSubmitting(false);
        return;
      }
      const payload = await response.json() as { jobId: string };
      setActiveJobId(payload.jobId);
    } catch (reason) {
      setError(String(reason));
      setIsSubmitting(false);
    }
  }

  async function refreshActiveJob() {
    if (!activeJobId) return;
    const response = await fetch(`/api/generation-jobs/${activeJobId}`);
    if (response.ok) setActiveJob(await response.json());
  }

  async function favoriteImage(image: GeneratedImage) {
    await fetch(`/api/generated-images/${image.id}/favorite`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !image.isFavorite })
    });
    await refreshActiveJob();
  }

  async function deleteImage(image: GeneratedImage) {
    await fetch(`/api/generated-images/${image.id}`, { method: "DELETE" });
    if (drawerImage?.id === image.id) setDrawerImage(null);
    await refreshActiveJob();
  }

  async function regenerateImage(image: GeneratedImage) {
    const response = await fetch(`/api/generated-images/${image.id}/regenerate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customNote: "保持地点和变量组合，刷新这一张。" })
    });
    if (response.ok) {
      const payload = await response.json() as { jobId: string };
      setActiveJobId(payload.jobId);
    }
  }

  return (
    <>
      <section className="studio-grid">
        <aside className="rail">
          <PersonReferenceUploader
            assets={references}
            consent={consent}
            disabled={isRunning || isSubmitting}
            onConsentChange={setConsent}
            onRemove={(assetId) => setReferences((current) => current.filter((asset) => asset.id !== assetId))}
            onUploaded={(asset) => setReferences((current) => [...current, asset].slice(0, 3))}
          />
          <TemplateSelector templates={templates} selectedTemplateId={selectedTemplateId} onSelect={setSelectedTemplateId} />
          <VariablePanel
            template={selectedTemplate}
            selectedVariables={selectedVariables}
            count={count}
            onCountChange={setCount}
            onToggle={toggleVariable}
          />
          <AdvancedSettingsPanel settings={settings} onChange={setSettings} />
        </aside>
        <section className="workspace-panel">
          <div className="workspace-head">
            <div>
              <h1 className="workspace-title">摄影棚工作台</h1>
              <p className="workspace-subtitle">{selectedTemplate?.name ?? "选择一个启用中的摄影棚模板"} · {count} 张 · {selectedTemplate?.category ?? "未分类"}</p>
            </div>
            <div className="stack">
              <button className="primary-button" type="button" disabled={!canGenerate} onClick={() => void generate()}>
                {buttonLabel({ references: references.length, consent, selectedTemplate: Boolean(selectedTemplate), isRunning, isSubmitting, count, activeJob })}
              </button>
            </div>
          </div>
          <JobProgress job={activeJob} />
          {error ? <div className="error-strip">{error}</div> : null}
          {activeJob?.providerError ? <div className="error-strip">{activeJob.providerError}</div> : null}
          <div className="results-wrap">
            <ResultGrid
              images={activeJob?.images ?? []}
              onDelete={(image) => void deleteImage(image)}
              onFavorite={(image) => void favoriteImage(image)}
              onOpenPrompt={setDrawerImage}
              onRegenerate={(image) => void regenerateImage(image)}
            />
          </div>
        </section>
      </section>
      <PromptPreviewDrawer image={drawerImage} onClose={() => setDrawerImage(null)} />
    </>
  );
}

function buttonLabel(input: {
  references: number;
  consent: boolean;
  selectedTemplate: boolean;
  isRunning: boolean;
  isSubmitting: boolean;
  count: number;
  activeJob: JobDetail | null;
}): string {
  if (input.isSubmitting) return "正在提交任务";
  if (input.isRunning) return `正在生成 ${input.activeJob?.progress.completed ?? 0}/${input.activeJob?.progress.total ?? input.count}`;
  if (!input.references) return "先上传人像";
  if (!input.consent) return "确认授权后生成";
  if (!input.selectedTemplate) return "选择摄影棚模板";
  return `生成 ${input.count} 张写真`;
}
