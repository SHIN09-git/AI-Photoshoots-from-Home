import { NextResponse } from "next/server";
import { getSystemStatus } from "@/server/services/systemStatusService";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getSystemStatus();
  const httpStatus = status.items.every((item) => item.ok) ? 200 : 503;
  return NextResponse.json(status, { status: httpStatus });
}
