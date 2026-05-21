import { NextResponse } from "next/server";
import { templateSchema } from "@/server/services/validation";
import { listTemplates, upsertTemplate } from "@/server/services/templateService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  return NextResponse.json({ items: await listTemplates(category) });
}

export async function POST(request: Request) {
  const payload = templateSchema.parse(await request.json());
  const template = await upsertTemplate(payload);
  return NextResponse.json(template, { status: 201 });
}
