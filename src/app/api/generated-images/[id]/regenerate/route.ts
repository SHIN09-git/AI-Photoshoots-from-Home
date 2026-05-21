import { NextResponse } from "next/server";
import { regenerateImageJob } from "@/server/services/generationJobService";
import { regenerateSchema } from "@/server/services/validation";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const payload = regenerateSchema.parse(await request.json().catch(() => ({})));
  const job = await regenerateImageJob(id, undefined, payload);
  return NextResponse.json({ jobId: job.id, status: job.status }, { status: 201 });
}
