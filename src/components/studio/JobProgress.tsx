"use client";

import type { JobDetail } from "@/types/studio";

type JobProgressProps = {
  job?: JobDetail | null;
};

export function JobProgress({ job }: JobProgressProps) {
  const finished = job ? job.progress.completed + job.progress.failed : 0;
  const percent = job ? Math.round((finished / job.progress.total) * 100) : 0;
  return (
    <div className="job-bar">
      <div>
        <div className="progress-meta">
          <span>{job ? statusText(job.status) : "等待创建任务"}</span>
          <span>{job ? `${job.progress.completed}/${job.progress.total}${job.progress.failed ? ` · 失败 ${job.progress.failed}` : ""}` : "0/0"}</span>
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
