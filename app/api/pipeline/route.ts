import { NextResponse } from "next/server";

/**
 * Receives contacts from lib/pipeline.ts. Validates, forwards to
 * PIPELINE_WEBHOOK_URL when set (Slack incoming webhook or any JSON endpoint),
 * otherwise logs on the server. Idempotent on `id` at the receiver's side.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const kinds = ["booking", "inquiry", "ask", "newsletter"];
  if (typeof body.id !== "string" || !kinds.includes(String(body.kind))) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }
  if (body.email !== undefined && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(body.email))) {
    return NextResponse.json({ ok: false, error: "email" }, { status: 422 });
  }
  const url = process.env.PIPELINE_WEBHOOK_URL;
  if (url) {
    const text = `New ${body.kind}: ${body.name ?? "no name"} ${body.email ?? ""} ${body.checkIn ?? ""}${body.checkOut ? ` → ${body.checkOut}` : ""} ${body.guests ? `${body.guests} guests` : ""}\n${body.note ?? ""}`.trim();
    try {
      const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, contact: body }) });
      if (!res.ok) return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    } catch {
      return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    }
  } else {
    console.log("[pipeline]", JSON.stringify(body));
  }
  return NextResponse.json({ ok: true, id: body.id }, { status: 201 });
}
