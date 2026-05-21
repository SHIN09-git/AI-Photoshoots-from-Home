"use client";

import { useMemo, useState } from "react";
import { defaultTemplateVariables } from "@/lib/prompt/variables";
import type { LocationAnchor, StudioTemplate, StudioTemplateVariables } from "@/types/studio";

type TemplateFormProps = {
  template?: StudioTemplate;
  onSaved: (template: StudioTemplate) => void;
};

type TemplateDraft = Omit<StudioTemplate, "id" | "createdAt" | "updatedAt" | "version"> & {
  id?: string;
};

const emptyAnchor: LocationAnchor = {
  placeName: "",
  stableElements: [],
  foreground: [],
  background: [],
  lighting: [],
  colorPalette: [],
  avoidElements: []
};

export function TemplateForm({ template, onSaved }: TemplateFormProps) {
  const initial = useMemo<TemplateDraft>(() => template ?? {
    id: undefined,
    slug: "",
    name: "",
    category: "",
    description: "",
    coverPalette: ["#0f766e", "#c88925", "#e75f48", "#416b4a"],
    tags: [],
    locationAnchor: emptyAnchor,
    promptBase: "Create a realistic editorial portrait photo based on the uploaded person reference.",
    negativePrompt: "",
    variables: defaultTemplateVariables,
    defaultSettings: {
      identityStrength: "strong",
      locationConsistency: "strong",
      creativity: "balanced",
      customNote: "",
      negativePrompt: ""
    },
    isActive: true
  }, [template]);

  const [form, setForm] = useState<TemplateDraft>(initial);
  const [variableJson, setVariableJson] = useState<Record<keyof StudioTemplateVariables, string>>({
    seasons: JSON.stringify(initial.variables.seasons, null, 2),
    times: JSON.stringify(initial.variables.times, null, 2),
    angles: JSON.stringify(initial.variables.angles, null, 2),
    lenses: JSON.stringify(initial.variables.lenses, null, 2),
    filmLooks: JSON.stringify(initial.variables.filmLooks, null, 2),
    outfits: JSON.stringify(initial.variables.outfits, null, 2),
    moods: JSON.stringify(initial.variables.moods, null, 2)
  });
  const [error, setError] = useState<string>();

  async function submit() {
    try {
      const variables = Object.fromEntries(
        Object.entries(variableJson).map(([key, value]) => [key, JSON.parse(value)])
      ) as StudioTemplateVariables;
      const payload = {
        ...form,
        tags: normalizeList(form.tags),
        coverPalette: normalizeList(form.coverPalette),
        locationAnchor: {
          ...form.locationAnchor,
          stableElements: normalizeList(form.locationAnchor.stableElements),
          foreground: normalizeList(form.locationAnchor.foreground),
          background: normalizeList(form.locationAnchor.background),
          lighting: normalizeList(form.locationAnchor.lighting),
          colorPalette: normalizeList(form.locationAnchor.colorPalette),
          avoidElements: normalizeList(form.locationAnchor.avoidElements ?? [])
        },
        variables
      };
      const response = await fetch(payload.id ? `/api/templates/${payload.id}` : "/api/templates", {
        method: payload.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(await response.text());
      onSaved(await response.json());
      setError(undefined);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  }

  return (
    <div className="template-form stack">
      {error ? <div className="error-strip">{error}</div> : null}
      <div className="form-grid">
        <Field label="名称" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Field label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} />
        <Field label="分类" value={form.category} onChange={(value) => setForm({ ...form, category: value })} />
        <Field label="标签（逗号分隔）" value={form.tags.join(", ")} onChange={(value) => setForm({ ...form, tags: splitComma(value) })} />
        <Field wide label="说明" textarea value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
        <Field wide label="Prompt Base" textarea value={form.promptBase} onChange={(value) => setForm({ ...form, promptBase: value })} />
        <Field wide label="Negative Prompt" textarea value={form.negativePrompt ?? ""} onChange={(value) => setForm({ ...form, negativePrompt: value })} />
        <Field label="地点名称" value={form.locationAnchor.placeName} onChange={(value) => setForm({ ...form, locationAnchor: { ...form.locationAnchor, placeName: value } })} />
        <Field label="封面色板" value={form.coverPalette.join(", ")} onChange={(value) => setForm({ ...form, coverPalette: splitComma(value) })} />
        <Field wide label="稳定空间锚点（每行一条）" textarea value={form.locationAnchor.stableElements.join("\n")} onChange={(value) => setForm({ ...form, locationAnchor: { ...form.locationAnchor, stableElements: splitLines(value) } })} />
        <Field wide label="前景元素（每行一条）" textarea value={form.locationAnchor.foreground.join("\n")} onChange={(value) => setForm({ ...form, locationAnchor: { ...form.locationAnchor, foreground: splitLines(value) } })} />
        <Field wide label="背景元素（每行一条）" textarea value={form.locationAnchor.background.join("\n")} onChange={(value) => setForm({ ...form, locationAnchor: { ...form.locationAnchor, background: splitLines(value) } })} />
        <Field wide label="光线（每行一条）" textarea value={form.locationAnchor.lighting.join("\n")} onChange={(value) => setForm({ ...form, locationAnchor: { ...form.locationAnchor, lighting: splitLines(value) } })} />
        <Field wide label="地点色彩（逗号分隔）" value={form.locationAnchor.colorPalette.join(", ")} onChange={(value) => setForm({ ...form, locationAnchor: { ...form.locationAnchor, colorPalette: splitComma(value) } })} />
        {Object.entries(variableJson).map(([key, value]) => (
          <Field
            wide
            textarea
            key={key}
            label={`变量选项 ${key}（JSON 数组）`}
            value={value}
            onChange={(next) => setVariableJson({ ...variableJson, [key]: next })}
          />
        ))}
      </div>
      <label className="switch-row">
        <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />
        启用模板
      </label>
      <button className="primary-button" type="button" onClick={() => void submit()}>
        {form.id ? "保存模板" : "创建模板"}
      </button>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  textarea?: boolean;
  wide?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className={`field ${props.wide ? "full" : ""}`}>
      <label>{props.label}</label>
      {props.textarea ? (
        <textarea value={props.value} onChange={(event) => props.onChange(event.target.value)} />
      ) : (
        <input value={props.value} onChange={(event) => props.onChange(event.target.value)} />
      )}
    </div>
  );
}

function splitLines(value: string): string[] {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function splitComma(value: string): string[] {
  return value.split(/[，,]/).map((item) => item.trim()).filter(Boolean);
}

function normalizeList(value: string[] | undefined): string[] {
  return Array.isArray(value) ? value.map((item) => item.trim()).filter(Boolean) : [];
}
