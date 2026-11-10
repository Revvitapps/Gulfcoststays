import { NextResponse } from "next/server";
import { indexable } from "@/lib/seo";

export function GET() {
  return NextResponse.json({
    ok: true,
    indexing: indexable,
    pipeline: Boolean(process.env.PIPELINE_WEBHOOK_URL),
    stayos: Boolean(process.env.STAYOS_API_URL),
  });
}
