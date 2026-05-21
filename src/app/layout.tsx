import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 摄影棚",
  description: "上传人像并批量生成地点一致的人像写真"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="topbar">
          <Link className="brand" href="/studio">
            <span className="brand-mark">AI</span>
            <span>AI 摄影棚</span>
          </Link>
          <nav className="nav" aria-label="主导航">
            <Link href="/studio">摄影棚</Link>
            <Link href="/gallery">画廊</Link>
            <Link href="/templates">模板</Link>
            <Link href="/admin/templates">后台</Link>
            <Link href="/status">状态</Link>
          </nav>
          <div className="status-strip">
            <span className="status-dot" />
            <span>Provider: {process.env.IMAGE_PROVIDER ?? "mock"}</span>
          </div>
        </header>
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
