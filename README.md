# AI 摄影棚本地 Alpha

基于 Next.js App Router + TypeScript 的 AI 摄影棚本地 Alpha。旧静态 HTML Demo 只保留为 UI 参考，当前应用入口是 Next.js。

## 运行

```bash
pnpm install
cp .env.example .env.local
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
```

`pnpm prisma:migrate` 内置了 `RUST_LOG=trace`，用于绕过 Prisma 7 在 Windows 首次创建 SQLite 数据库时偶发的空白 schema-engine 错误。
需要重置本地库时运行 `pnpm db:reset`，它会重新应用 migration 并执行 seed。

打开：

- `http://localhost:3000/studio`
- `http://localhost:3000/gallery`
- `http://localhost:3000/templates`
- `http://localhost:3000/admin/templates`
- `http://localhost:3000/status`

## 环境变量

默认使用 Mock Provider，本地不需要 API key：

```env
DATABASE_URL="file:./prisma/dev.db"
IMAGE_PROVIDER="mock"
```

切换真实 OpenAI 出图：

```env
IMAGE_PROVIDER="openai"
OPENAI_API_KEY="sk-..."
OPENAI_IMAGE_MODEL="gpt-image-1"
OPENAI_IMAGE_SIZE="1024x1536"
OPENAI_IMAGE_OUTPUT_FORMAT="png"
```

所有生成都通过 `src/lib/providers` 的统一 Provider Adapter。UI 只创建任务，不直接生成图片。

状态检查接口：

- `GET /api/status`
- 页面：`/status`

## 数据与存储

- Prisma + SQLite：`prisma/schema.prisma`
- 本地开发库：`prisma/dev.db`
- Seed 模板：东京塔夜拍、重庆山城夜巷、春日樱花坡道
- 上传图和生成图：`uploads/`
- API 只返回 `/api/storage/...` 图片 URL，不返回大体积 data URL
- 重启服务后，只要 `prisma/dev.db` 和 `uploads/` 保留，历史任务和本地图片仍可访问

核心模型：

- `Asset`
- `StudioTemplate`
- `GenerationJob`
- `GeneratedImage`

## 任务执行

生成任务由服务端本地队列执行，状态流转为 `QUEUED -> RUNNING -> SUCCEEDED/FAILED`。每个 job 独立运行，不共享全局 timer；失败会记录 `providerError`，部分成功会保留成功图片并记录失败数量。后续迁移 BullMQ 时可沿用现有 API 形态。

## 质量工作台

画廊页支持：

- 单张 prompt 快照查看
- 单张重新生成
- 批量对比浏览
- 手动评分：identity / location / composition

## 验证

```bash
pnpm lint
pnpm test
pnpm build
```

Vitest 覆盖：

- `composePrompt`
- `buildPromptMatrix`
- matrix 防重复
- 变量锁定
- negative prompt 合并
- count=6/9/12 均衡覆盖
- 默认 3 个 lens 时覆盖 `85mm`
