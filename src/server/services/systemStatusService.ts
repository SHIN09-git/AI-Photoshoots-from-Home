import { prisma } from "@/lib/prisma";
import { getImageProvider } from "@/lib/providers";
import { getStorageProvider } from "@/lib/storage";

export type SystemStatusItem = {
  name: "database" | "storage" | "provider";
  ok: boolean;
  label: string;
  detail?: string;
};

export type SystemStatus = {
  checkedAt: string;
  items: SystemStatusItem[];
};

export async function getSystemStatus(): Promise<SystemStatus> {
  const [database, storage, provider] = await Promise.all([
    check("database", "SQLite / Prisma", async () => {
      await prisma.$queryRaw`SELECT 1`;
      return "query ok";
    }),
    check("storage", "Local uploads", async () => {
      const ok = await getStorageProvider().healthCheck();
      return ok ? "read/write ok" : "read/write failed";
    }),
    check("provider", process.env.IMAGE_PROVIDER ?? "mock", async () => {
      const activeProvider = getImageProvider();
      const ok = await activeProvider.healthCheck();
      return ok ? `${activeProvider.id}:${activeProvider.model}` : `${activeProvider.id} not ready`;
    })
  ]);

  return {
    checkedAt: new Date().toISOString(),
    items: [database, storage, provider]
  };
}

async function check(
  name: SystemStatusItem["name"],
  label: string,
  fn: () => Promise<string>
): Promise<SystemStatusItem> {
  try {
    const detail = await fn();
    return { name, ok: true, label, detail };
  } catch (error) {
    return {
      name,
      ok: false,
      label,
      detail: error instanceof Error ? error.message : "unknown error"
    };
  }
}
