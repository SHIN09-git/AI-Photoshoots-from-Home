import { NextResponse } from "next/server";
import { createGenerationJob, listJobs } from "@/server/services/generationJobService";
import { createGenerationJobSchema } from "@/server/services/validation";

export async function GET() {
  return NextResponse.json({ items: listJobs() });
}

export async function POST(request: Request) {
  const payload = createGenerationJobSchema.parse(await request.json());
  const job = createGenerationJob(payload);
  return NextResponse.json({ jobId: job.id, status: job.status }, { status: 201 });
}
