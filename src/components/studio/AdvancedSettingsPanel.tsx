"use client";

import type { GenerationSettings } from "@/types/studio";

type AdvancedSettingsPanelProps = {
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
};

export function AdvancedSettingsPanel({ settings, onChange }: AdvancedSettingsPanelProps) {
  return (
    <section className="rail-section">
      <div className="section-head">
        <h2 className="section-title">高级设置</h2>
        <span className="section-kicker">Prompt</span>
      </div>
      <div className="field">
        <label>脸部相似度</label>
        <select value={settings.identityStrength} onChange={(event) => onChange({ ...settings, identityStrength: event.target.value as GenerationSettings["identityStrength"] })}>
          <option value="normal">标准</option>
          <option value="strong">强</option>
        </select>
      </div>
      <div className="field">
        <label>地点一致性</label>
        <select value={settings.locationConsistency} onChange={(event) => onChange({ ...settings, locationConsistency: event.target.value as GenerationSettings["locationConsistency"] })}>
          <option value="normal">标准</option>
          <option value="strong">强</option>
        </select>
      </div>
      <div className="field">
        <label>创意强度</label>
        <select value={settings.creativity} onChange={(event) => onChange({ ...settings, creativity: event.target.value as GenerationSettings["creativity"] })}>
          <option value="safe">保守</option>
          <option value="balanced">平衡</option>
          <option value="wild">放飞</option>
        </select>
      </div>
      <div className="field">
        <label>自定义补充提示词</label>
        <textarea value={settings.customNote ?? ""} onChange={(event) => onChange({ ...settings, customNote: event.target.value })} />
      </div>
      <div className="field">
        <label>负面提示词补充</label>
        <textarea value={settings.negativePrompt ?? ""} onChange={(event) => onChange({ ...settings, negativePrompt: event.target.value })} />
      </div>
    </section>
  );
}
