"use client";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { addDays, iso, money, toDate } from "@/lib/rates";
import { QuotePanel } from "@/components/quote-panel";
import { booking } from "@/lib/booking";
import { newId, upsertContact } from "@/lib/pipeline";
import { property } from "@/data/property";

/** Next Friday (or today if Friday) as a sensible default. */
function presetDates(preset: string | null) {
  const today = toDate(iso(new Date()));
  let start = addDays(today, 14);
  while (start.getUTCDay() !== 5) start = addDays(start, 1);
  if (preset === "week") return [iso(addDays(start, 1)), iso(addDays(start, 8))]; // Sat to Sat
  if (preset === "month") return ["2027-01-04", "2027-02-01"];
  return [iso(start), iso(addDays(start, 2))];
}

export function BookForm({ preset, checkIn: inProp, checkOut: outProp }: { preset: string | null; checkIn?: string; checkOut?: string }) {
  const router = useRouter();
  const [defIn, defOut] = useMemo(() => (inProp && outProp ? [inProp, outProp] : presetDates(preset)), [preset, inProp, outProp]);
  const [checkIn, setCheckIn] = useState(defIn);
  const [checkOut, setCheckOut] = useState(defOut);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // Today's date for the min attribute, client-only to avoid a hydration mismatch at midnight.
  const today = useSyncExternalStore(() => () => {}, () => iso(new Date()), () => undefined);

  const q = booking.quote(checkIn, checkOut);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.ok) return setError(q.problem ?? "Check the dates.");
    if (!name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Add your name and a working email so we can confirm.");
    setBusy(true);
    setError("");
    const id = newId();
    const result = await booking.request({ id, checkIn, checkOut, guests, name, email, phone, note, source: "direct", createdAt: new Date().toISOString() });
    await upsertContact({ id, kind: "booking", name, email, phone, checkIn, checkOut, guests, note: `${note}\nQuote ${money(q.total)} (${q.count} nights)`.trim() });
    try {
      sessionStorage.setItem("gcs:last-request", JSON.stringify({ reference: result.reference, message: result.message, checkIn, checkOut, total: q.total, count: q.count }));
    } catch {}
    router.push("/thanks");
  }

  return (
    <form onSubmit={submit} className="grid grid-2" style={{ marginTop: "1.25rem", alignItems: "start" }} noValidate>
      <div className="grid">
        <div className="grid grid-2">
          <label className="field">
            <span>Check-in</span>
            <input type="date" value={checkIn} min={today} onChange={(e) => setCheckIn(e.target.value)} required />
          </label>
          <label className="field">
            <span>Check-out</span>
            <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} required />
          </label>
        </div>
        <label className="field">
          <span>Guests (up to {property.sleeps})</span>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {Array.from({ length: property.sleeps }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Name</span>
          <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <div className="grid grid-2">
          <label className="field">
            <span>Email</span>
            <input type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>Phone (optional)</span>
            <input type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
        </div>
        <label className="field">
          <span>Anything we should know?</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Arrival time, a birthday, a boat on a trailer…" />
        </label>
      </div>

      <div className="grid">
        <QuotePanel q={q} />
        {!q.ok && q.count > 0 ? <p className="notice" role="status">{q.problem}</p> : null}
        {error ? <p className="notice notice-err" role="alert">{error}</p> : null}
        <button type="submit" className="button button-orange button-lg button-block" disabled={busy || !q.ok}>
          {busy ? "Sending…" : "Request these dates"}
        </button>
        <p className="small" style={{ margin: 0 }}>
          <CheckCircle2 size={14} style={{ display: "inline", verticalAlign: "-2px", color: "var(--ok)" }} /> No charge now. We confirm availability and send a secure payment link by email. Live calendar and instant booking arrive with StayOS.
        </p>
      </div>
    </form>
  );
}
