"use client";

import { useEffect, useState } from "react";
import { ComparisonTray } from "@/components/studio/ComparisonTray";
import { PromptPreviewDrawer } from "@/components/studio/PromptPreviewDrawer";
import { ResultGrid } from "@/components/studio/ResultGrid";
import type { GeneratedImage, JobDetail } from "@/types/studio";

export default function GalleryPage() {
  const [jobs, setJobs] = useState<JobDetail[]>([]);
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [drawerImage, setDrawerImage] = useState<GeneratedImage | null>(null);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  async function refresh() {
    const response = await fetch("/api/generation-jobs");
    if (response.ok) {
      const data = await response.json() as { items: JobDetail[] };
      setJobs(data.items);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const images = jobs.flatMap((job) => job.images);
  const filtered = filter === "favorites" ? images.filter((image) => image.isFavorite) : images;
  const selectedImages = selectedImageIds
    .map((imageId) => images.find((image) => image.id === imageId))
    .filter((image): image is GeneratedImage => Boolean(image));

  async function favoriteImage(image: GeneratedImage) {
    await fetch(`/api/generated-images/${image.id}/favorite`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !image.isFavorite })
    });
    await refresh();
  }

  async function deleteImage(image: GeneratedImage) {
    await fetch(`/api/generated-images/${image.id}`, { method: "DELETE" });
    await refresh();
  }

  async function regenerateImage(image: GeneratedImage) {
    const response = await fetch(`/api/generated-images/${image.id}/regenerate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (response.ok) {
      await refresh();
    }
  }

  async function rateImage(image: GeneratedImage, scores: Partial<Pick<GeneratedImage, "scoreIdentity" | "scoreLocation" | "scoreComposition">>) {
    const response = await fetch(`/api/generated-images/${image.id}/quality`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scores)
    });
    if (response.ok) {
      const updated = await response.json() as GeneratedImage;
      setJobs((current) => current.map((job) => ({
        ...job,
        images: job.images.map((item) => item.id === updated.id ? updated : item)
      })));
    }
  }

  function toggleCompare(image: GeneratedImage) {
    setSelectedImageIds((current) => {
      if (current.includes(image.id)) return current.filter((imageId) => imageId !== image.id);
      return [...current, image.id].slice(-6);
    });
  }

  return (
    <>
      <section className="page-panel">
        <div className="gallery-toolbar">
          <div>
            <h1 className="workspace-title">我的作品</h1>
            <p className="workspace-subtitle">{jobs.length} 个任务 · {images.length} 张图片 · {images.filter((image) => image.isFavorite).length} 个收藏</p>
          </div>
          <div className="segmented segmented-narrow">
            <button className={filter === "all" ? "active" : ""} type="button" onClick={() => setFilter("all")}>全部</button>
            <button className={filter === "favorites" ? "active" : ""} type="button" onClick={() => setFilter("favorites")}>收藏</button>
          </div>
        </div>
        <ResultGrid
          images={filtered}
          onDelete={(image) => void deleteImage(image)}
          onFavorite={(image) => void favoriteImage(image)}
          onOpenPrompt={setDrawerImage}
          onRate={(image, scores) => void rateImage(image, scores)}
          onRegenerate={(image) => void regenerateImage(image)}
          selectedImageIds={selectedImageIds}
          onToggleCompare={toggleCompare}
        />
        <ComparisonTray
          images={selectedImages}
          onClear={() => setSelectedImageIds([])}
          onRemove={(imageId) => setSelectedImageIds((current) => current.filter((id) => id !== imageId))}
        />
      </section>
      <PromptPreviewDrawer image={drawerImage} onClose={() => setDrawerImage(null)} />
    </>
  );
}
