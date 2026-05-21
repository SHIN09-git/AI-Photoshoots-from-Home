"use client";

import type { JobDetail } from "@/types/studio";

type JobProgressProps = {
  job?: JobDetail | null;
};

export function JobProgress({ job }: JobProgressProps) {
  const percent = job ? Math.round((job.progress.completed / job.progress.total) * 100) : 0;
  return (
    <div className="job-bar">
      <div>
        <div className="progress-meta">
          <span>{job ? statusText(job.status) : "等待创建任务"}</span>
          <span>{job ? `${job.progress.completed}/${job.progress.total}` : "0/0"}</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
      </div>
      <span className="tag">{job?.status ?? "READY"}</span>
    </div>
  );
}

function statusText(status: string): string {
  return {
    QUEUED: "排队中",
    RUNNING: "生成中",
    SUCCEEDED: "完成",
    FAILED: "失败",
    CANCELED: "已取消"
  }[status] ?? "等待中";
}
