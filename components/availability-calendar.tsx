"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];
const pad = (n: number) => String(n).padStart(2, "0");
const isoOf = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const longDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric", year: "numeric" });
};

type Props = {
  booked: Set<string>;
  today: string;
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
};

/**
 * Two months of open and booked nights. Tap a check-in, then a check-out.
 * A booked night can still be a check-out day (the other guest arrives that afternoon).
 */
export function AvailabilityCalendar({ booked, today, checkIn, checkOut, onChange }: Props) {
  const start = checkIn && checkIn >= today ? checkIn : today;
  const [view, setView] = useState(() => {
    const [y, m] = start.split("-").map(Number);
    return { y, m: m - 1 };
  });
  const [picking, setPicking] = useState<"in" | "out">(checkIn && !checkOut ? "out" : "in");
  const [ty, tm] = today.split("-").map(Number);
  const atStart = view.y === ty && view.m === tm - 1;
  // While choosing a check-out, nothing past the next booked night can be picked.
  const limit = picking === "out" && checkIn ? [...booked].filter((d) => d >= checkIn).sort()[0] : undefined;

  const shift = (n: number) =>
    setView((v) => {
      const d = new Date(Date.UTC(v.y, v.m + n, 1));
      return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
    });

  function pick(day: string) {
    if (picking === "out" && checkIn && day > checkIn) {
      onChange(checkIn, day);
      setPicking("in");
      return;
    }
    if (booked.has(day)) return;
    onChange(day, "");
    setPicking("out");
  }

  const months = [0, 1].map((k) => {
    const d = new Date(Date.UTC(view.y, view.m + k, 1));
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
  });

  return (
    <div className="cal" aria-label="Availability calendar">
      <div className="cal-head">
        <button type="button" className="cal-nav" onClick={() => shift(-1)} disabled={atStart} aria-label="Earlier months">
          <ChevronLeft size={18} />
        </button>
        <p className="small" style={{ margin: 0 }} aria-live="polite">
          {picking === "out" && checkIn ? "Now tap your check-out day." : "Tap your check-in day."}
        </p>
        <button type="button" className="cal-nav" onClick={() => shift(1)} aria-label="Later months">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="cal-months">
        {months.map(({ y, m }) => {
          const first = new Date(Date.UTC(y, m, 1)).getUTCDay();
          const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
          return (
            <div key={`${y}-${m}`} className="cal-month">
              <p className="cal-title">{MONTHS[m]} {y}</p>
              <div className="cal-grid">
                {DOW.map((d, i) => (
                  <span key={i} className="cal-dow" aria-hidden="true">{d}</span>
                ))}
                {Array.from({ length: first }, (_, i) => <span key={`b${i}`} />)}
                {Array.from({ length: days }, (_, i) => {
                  const day = isoOf(y, m, i + 1);
                  const past = day < today;
                  const taken = booked.has(day);
                  const inRange = checkIn && checkOut && day > checkIn && day < checkOut;
                  const isEnd = day === checkIn || day === checkOut;
                  const canOut = picking === "out" && checkIn && day > checkIn && (!limit || day <= limit);
                  const blocked = Boolean(picking === "out" && checkIn && limit && day > limit);
                  const disabled = past || (taken && !canOut) || blocked;
                  const cls = ["cal-day", taken && "is-booked", inRange && "is-range", isEnd && "is-end"].filter(Boolean).join(" ");
                  return (
                    <button
                      key={day}
                      type="button"
                      className={cls}
                      disabled={disabled}
                      aria-pressed={isEnd ? true : undefined}
                      aria-label={`${longDate(day)}${taken ? ", booked" : past ? "" : ", open"}`}
                      onClick={() => pick(day)}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="cal-key small">
        <span className="cal-swatch" /> Open <span className="cal-swatch is-booked" /> Booked <span className="cal-swatch is-end" /> Your stay
      </p>
    </div>
  );
}
