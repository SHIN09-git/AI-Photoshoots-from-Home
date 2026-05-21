"use client";

import { useEffect, useState } from "react";
import { PromptPreviewDrawer } from "@/components/studio/PromptPreviewDrawer";
import { ResultGrid } from "@/components/studio/ResultGrid";
import type { GeneratedImage, JobDetail } from "@/types/studio";

export default function GalleryPage() {
  const [jobs, setJobs] = useState<JobDetail[]>([]);
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [drawerImage, setDrawerImage] = useState<GeneratedImage | null>(null);

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
    await fetch(`/api/generated-images/${image.id}/regenerate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    await refresh();
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
          onRegenerate={(image) => void regenerateImage(image)}
        />
      </section>
      <PromptPreviewDrawer image={drawerImage} onClose={() => setDrawerImage(null)} />
    </>
  );
}
