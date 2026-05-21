import { NextResponse } from "next/server";
import { updateQualityScores } from "@/server/services/generatedImageService";
import { qualityScoreSchema } from "@/server/services/validation";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const payload = qualityScoreSchema.parse(await request.json());
  const image = await updateQualityScores(id, payload);
  if (!image) return NextResponse.json({ error: "image not found" }, { status: 404 });
  return NextResponse.json(image);
}
