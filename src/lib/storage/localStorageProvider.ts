import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LoadedObject, PutObjectInput, StorageProvider, StoredObject } from "@/lib/storage/types";

const mimeToExt: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg"
};

const extToMime: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

export class LocalStorageProvider implements StorageProvider {
  private root = path.join(process.cwd(), "uploads");

  async putObject(input: PutObjectInput): Promise<StoredObject> {
    const hash = createHash("sha256").update(input.buffer).digest("hex");
    const ext = extensionFor(input.mimeType, input.filename);
    const storageKey = `${input.prefix}/${new Date().toISOString().slice(0, 10)}/${hash.slice(0, 16)}-${crypto.randomUUID().slice(0, 8)}${ext}`;
    const filePath = this.resolve(storageKey);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, input.buffer);
    const dimensions = readImageDimensions(input.buffer, input.mimeType);

    return {
      storageKey,
      url: this.publicUrl(storageKey),
      mimeType: input.mimeType,
      sizeBytes: input.buffer.byteLength,
      hash,
      width: dimensions.width,
      height: dimensions.height
    };
  }

  async getObject(storageKey: string): Promise<LoadedObject> {
    const filePath = this.resolve(storageKey);
    const buffer = await readFile(filePath);
    return {
      buffer,
      mimeType: extToMime[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
      sizeBytes: buffer.byteLength
    };
  }

  async deleteObject(storageKey: string): Promise<void> {
    await rm(this.resolve(storageKey), { force: true });
  }

  publicUrl(storageKey: string): string {
    return `/api/storage/${storageKey.split("/").map(encodeURIComponent).join("/")}`;
  }

  async healthCheck(): Promise<boolean> {
    const key = `.health/${crypto.randomUUID()}.txt`;
    const filePath = this.resolve(key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, "ok", "utf8");
    const content = await readFile(filePath, "utf8");
    await rm(filePath, { force: true });
    return content === "ok";
  }

  private resolve(storageKey: string): string {
    const normalized = storageKey.replaceAll("\\", "/");
    const resolved = path.resolve(this.root, normalized);
    const root = path.resolve(this.root);
    if (resolved !== root && !resolved.startsWith(root + path.sep)) {
      throw new Error("Invalid storage key");
    }
    return resolved;
  }
}

function extensionFor(mimeType: string, filename?: string): string {
  if (mimeToExt[mimeType]) return mimeToExt[mimeType];
  if (filename) {
    const ext = path.extname(filename).toLowerCase();
    if (ext) return ext;
  }
  return ".bin";
}

function readImageDimensions(buffer: Buffer, mimeType: string): { width?: number; height?: number } {
  if (mimeType === "image/png" && buffer.length > 24) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (mimeType === "image/svg+xml") {
    const text = buffer.toString("utf8", 0, Math.min(buffer.length, 4096));
    const width = Number(text.match(/\bwidth=["']?(\d+)/i)?.[1]);
    const height = Number(text.match(/\bheight=["']?(\d+)/i)?.[1]);
    return {
      width: Number.isFinite(width) ? width : undefined,
      height: Number.isFinite(height) ? height : undefined
    };
  }

  return {};
}
