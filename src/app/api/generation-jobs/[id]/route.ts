import { NextResponse } from "next/server";
import { getJobDetail } from "@/server/services/generationJobService";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const job = await getJobDetail(id);
  if (!job) return NextResponse.json({ error: "job not found" }, { status: 404 });
  return NextResponse.json(job);
}
