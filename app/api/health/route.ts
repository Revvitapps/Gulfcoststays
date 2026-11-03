import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    indexing: process.env.SITE_INDEXING === "on",
    pipeline: Boolean(process.env.PIPELINE_WEBHOOK_URL),
    stayos: Boolean(process.env.STAYOS_API_URL),
  });
}
