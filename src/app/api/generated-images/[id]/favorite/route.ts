import { NextResponse } from "next/server";
import { setFavorite } from "@/server/services/generatedImageService";
import { favoriteSchema } from "@/server/services/validation";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { isFavorite } = favoriteSchema.parse(await request.json());
  const image = setFavorite(id, isFavorite);
  if (!image) return NextResponse.json({ error: "image not found" }, { status: 404 });
  return NextResponse.json(image);
}
