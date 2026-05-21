import { NextResponse } from "next/server";
import { softDeleteGeneratedImage } from "@/server/services/generatedImageService";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const deleted = await softDeleteGeneratedImage(id);
  if (!deleted) return NextResponse.json({ error: "image not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
