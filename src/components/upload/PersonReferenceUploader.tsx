"use client";

import { Upload, X } from "lucide-react";
import type { Asset } from "@/types/studio";

type PersonReferenceUploaderProps = {
  assets: Asset[];
  consent: boolean;
  disabled?: boolean;
  onConsentChange: (value: boolean) => void;
  onUploaded: (asset: Asset) => void;
  onRemove: (assetId: string) => void;
};

export function PersonReferenceUploader({
  assets,
  consent,
  disabled,
  onConsentChange,
  onUploaded,
  onRemove
}: PersonReferenceUploaderProps) {
  async function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    let remaining = Math.max(0, 3 - assets.length);
    for (const file of files) {
      if (remaining <= 0) break;
      const formData = new FormData();
      formData.set("file", file);
      formData.set("type", "PERSON_REFERENCE");
      const response = await fetch("/api/assets/upload", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      onUploaded(await response.json());
      remaining -= 1;
    }
  }

  return (
    <section className="rail-section">
      <div className="section-head">
        <h2 className="section-title">人像参考</h2>
        <span className="section-kicker">{assets.length}/3</span>
      </div>
      <label className="dropzone">
        <span className="dropzone-main">
          <span className="upload-icon"><Upload size={20} /></span>
          <span>
            <strong>上传 JPG / PNG / WEBP</strong>
            <span className="tiny-note">单张最大 10MB</span>
          </span>
          <span className="small-button">选择</span>
        </span>
        <input
          className="file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled || assets.length >= 3}
          onChange={(event) => void handleFiles(event.currentTarget.files)}
        />
      </label>
      {assets.length > 0 ? (
        <div className="reference-list">
          {assets.map((asset) => (
            <div className="reference-card" key={asset.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.thumbUrl ?? asset.url} alt="人像参考" />
              <button className="tool-button danger" type="button" onClick={() => onRemove(asset.id)} aria-label="删除参考图">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <label className="consent-row">
        <input type="checkbox" checked={consent} onChange={(event) => onConsentChange(event.target.checked)} />
        <span>我确认上传的是本人照片，或我已获得照片中人物的明确授权。</span>
      </label>
    </section>
  );
}
