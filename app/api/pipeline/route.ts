import { NextResponse } from "next/server";

/**
 * Receives contacts from lib/pipeline.ts. Validates, then delivers to every
 * configured destination:
 *  - PIPELINE_WEBHOOK_URL (Slack incoming webhook or any JSON endpoint)
 *  - email through Resend when RESEND_API_KEY is set (to PIPELINE_EMAIL_TO,
 *    reply-to the guest). Uses Revvit's verified documents.revvit.io sender
 *    until gulfcoaststays.co has its own Resend domain.
 * If nothing is configured it only logs. Returns 502 when a configured
 * destination fails, so the device keeps the contact and retries later.
 */
const EMAIL_TO = process.env.PIPELINE_EMAIL_TO || "bookings@gulfcoaststays.co";
const EMAIL_FROM = process.env.PIPELINE_EMAIL_FROM || "Gulf Coast Stays <bookings@documents.revvit.io>";

const LABELS: Record<string, string> = {
  booking: "Booking request",
  inquiry: "Inquiry",
  ask: "Question",
  newsletter: "Newsletter signup",
};

function summary(body: Record<string, unknown>) {
  const dates = body.checkIn ? `${body.checkIn}${body.checkOut ? ` → ${body.checkOut}` : ""}` : "";
  return `New ${body.kind}: ${body.name ?? "no name"} ${body.email ?? ""} ${dates} ${body.guests ? `${body.guests} guests` : ""}\n${body.note ?? ""}`.trim();
}

async function sendEmail(body: Record<string, unknown>, apiKey: string) {
  const label = LABELS[String(body.kind)] ?? "Message";
  const who = typeof body.name === "string" && body.name ? body.name : String(body.email ?? "a guest");
  const dates = body.checkIn ? ` · ${body.checkIn}${body.checkOut ? ` → ${body.checkOut}` : ""}` : "";
  const lines = [
    `${label} from gulfcoaststays.co`,
    "",
    `Name: ${body.name ?? "—"}`,
    `Email: ${body.email ?? "—"}`,
    `Phone: ${body.phone ?? "—"}`,
    body.checkIn ? `Check-in: ${body.checkIn}` : null,
    body.checkOut ? `Check-out: ${body.checkOut}` : null,
    body.guests ? `Guests: ${body.guests}` : null,
    `Page: ${body.page ?? "—"}`,
    `Sent: ${body.createdAt ?? new Date().toISOString()}`,
    "",
    "Message:",
    String(body.note ?? "(none)"),
    "",
    `Reply to this email to answer ${who} directly.`,
    `Reference: ${body.id}`,
  ].filter((l) => l !== null);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      // Retries from the device reuse the same id, so the guest never lands twice.
      "idempotency-key": `gcs-${String(body.id)}`,
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: EMAIL_TO.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: typeof body.email === "string" && body.email ? body.email : undefined,
      subject: `${label}: ${who}${dates}`,
      text: lines.join("\n"),
    }),
  });
  return res.ok;
}

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
  const resendKey = process.env.RESEND_API_KEY;
  let failed = false;

  if (url) {
    try {
      const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: summary(body), contact: body }) });
      if (!res.ok) failed = true;
    } catch {
      failed = true;
    }
  }
  if (resendKey) {
    try {
      if (!(await sendEmail(body, resendKey))) failed = true;
    } catch {
      failed = true;
    }
  }
  // Always keep a copy in the server log as a last-resort record.
  console.log("[pipeline]", JSON.stringify(body));

  if (failed) return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  return NextResponse.json({ ok: true, id: body.id }, { status: 201 });
}
