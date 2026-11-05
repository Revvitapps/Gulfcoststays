"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { addDays, iso, toDate } from "@/lib/rates";
import { booking } from "@/lib/booking";
import { QuotePanel } from "@/components/quote-panel";

function nextFriday() {
  const today = toDate(iso(new Date()));
  let d = addDays(today, 14);
  while (d.getUTCDay() !== 5) d = addDays(d, 1);
  return d;
}

/** Dates in, price out. The only place on the public site that shows a rate, and it needs dates first. */
export function QuoteWidget() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const today = useSyncExternalStore(() => () => {}, () => iso(new Date()), () => undefined);
  const q = checkIn && checkOut ? booking.quote(checkIn, checkOut) : null;
  const suggest = () => {
    const f = nextFriday();
    setCheckIn(iso(f));
    setCheckOut(iso(addDays(f, 2)));
  };
  return (
    <div className="grid grid-2" style={{ alignItems: "start" }}>
      <div className="grid">
        <div className="grid grid-2">
          <label className="field">
            <span>Check-in</span>
            <input type="date" value={checkIn} min={today} onChange={(e) => setCheckIn(e.target.value)} />
          </label>
          <label className="field">
            <span>Check-out</span>
            <input type="date" value={checkOut} min={checkIn || today} onChange={(e) => setCheckOut(e.target.value)} />
          </label>
        </div>
        {!q ? (
          <button type="button" className="button button-ghost" onClick={suggest}>Try a weekend two weeks out</button>
        ) : null}
        <p className="small" style={{ margin: 0 }}>Fri and Sat nights carry the weekend rate. Seven nights takes 10% off, twenty-eight takes 25% off, and launch pricing takes another 10% off through Jan 31, 2027.</p>
      </div>
      <div className="grid">
        {q ? <QuotePanel q={q} /> : (
          <div className="quote"><p className="eyebrow" style={{ margin: 0 }}>Your price</p><p className="small" style={{ margin: 0 }}>Pick your dates to see the price, the cleaning fee, and what you save by booking direct.</p></div>
        )}
        {q && !q.ok ? <p className="notice" role="status">{q.problem}</p> : null}
        {q?.ok ? (
          <Link href={`/book?in=${checkIn}&out=${checkOut}`} className="button button-orange button-lg button-block">
            Request these dates <ArrowRight size={20} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
