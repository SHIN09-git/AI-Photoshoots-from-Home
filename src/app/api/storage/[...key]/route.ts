import { NextResponse } from "next/server";
import { getStorageProvider } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key } = await context.params;
  const storageKey = key.join("/");
  const object = await getStorageProvider().getObject(storageKey);
  return new NextResponse(new Uint8Array(object.buffer), {
    headers: {
      "Content-Type": object.mimeType,
      "Content-Length": String(object.sizeBytes),
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
