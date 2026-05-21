import { NextResponse } from "next/server";
import { getTemplate, upsertTemplate } from "@/server/services/templateService";
import { templateSchema } from "@/server/services/validation";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const template = getTemplate(id);
  if (!template) return NextResponse.json({ error: "template not found" }, { status: 404 });
  return NextResponse.json(template);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const existing = getTemplate(id);
  if (!existing) return NextResponse.json({ error: "template not found" }, { status: 404 });
  const payload = templateSchema.parse({ ...(await request.json()), id: existing.id });
  return NextResponse.json(upsertTemplate(payload));
}
