import { NextResponse } from "next/server";
import { z } from "zod";
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
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
  const asset = createAsset({
    type,
    url: dataUrl,
    thumbUrl: dataUrl,
    mimeType: file.type,
    size: file.size,
    metadata: {
      originalName: file.name
    }
  });

  return NextResponse.json(asset);
}
