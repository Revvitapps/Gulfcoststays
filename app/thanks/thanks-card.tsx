"use client";
import { useSyncExternalStore } from "react";
import { money } from "@/lib/rates";
import { contact } from "@/lib/site";

type Last = { reference: string; message: string; checkIn: string; checkOut: string; total: number; count: number };

const noop = () => () => {};
function readLast() {
  try {
    return sessionStorage.getItem("gcs:last-request");
  } catch {
    return null;
  }
}

export function ThanksCard() {
  const raw = useSyncExternalStore(noop, readLast, () => null);
  let last: Last | null = null;
  try {
    last = raw ? (JSON.parse(raw) as Last) : null;
  } catch {}
  return (
    <div className="card">
      {last ? (
        <>
          <p className="small">Reference {last.reference}</p>
          <p><strong>{last.checkIn} → {last.checkOut}</strong>, {last.count} nights, {money(last.total)} before tax.</p>
          <p style={{ margin: 0 }}>{last.message}</p>
        </>
      ) : (
        <p style={{ margin: 0 }}>We confirm by email within a few hours, usually faster.</p>
      )}
      <p className="small" style={{ marginTop: "0.75rem" }}>Questions meanwhile: <a className="link" href={`mailto:${contact.email}`}>{contact.email}</a></p>
    </div>
  );
}
