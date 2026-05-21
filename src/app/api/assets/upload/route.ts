import { NextResponse } from "next/server";
import { z } from "zod";
import { getStorageProvider } from "@/lib/storage";
import { createAsset } from "@/server/services/assetService";

export const runtime = "nodejs";

const uploadTypeSchema = z.enum(["PERSON_REFERENCE", "LOCATION_REFERENCE", "TEMPLATE_COVER"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const type = uploadTypeSchema.parse(formData.get("type") ?? "PERSON_REFERENCE");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (!["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type)) {
    return NextResponse.json({ error: "unsupported image type" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "file too large" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await getStorageProvider().putObject({
    buffer,
    mimeType: file.type,
    prefix: type === "TEMPLATE_COVER" ? "templates" : "references",
    filename: file.name
  });
  const asset = await createAsset({
    type,
    ...stored
  });

  return NextResponse.json(asset);
}
