"use client";
import { useEffect, useState } from "react";

/**
 * Booked nights from /api/availability (Airbnb, Vrbo, Booking.com and direct
 * stays combined on the server). One fetch per page load, shared by every
 * component that asks.
 */
export type Availability = { configured: boolean; complete: boolean; booked: Set<string>; loaded: boolean };

const empty: Availability = { configured: false, complete: false, booked: new Set(), loaded: false };
let pending: Promise<Availability> | null = null;

function load() {
  pending ??= fetch("/api/availability", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((j: { configured: boolean; complete: boolean; booked: string[] }) => ({
      configured: Boolean(j.configured),
      complete: Boolean(j.complete),
      booked: new Set(j.booked ?? []),
      loaded: true,
    }))
    .catch(() => {
      pending = null; // offline or failed: try again on the next page
      return { ...empty, loaded: true };
    });
  return pending;
}

export function useAvailability() {
  const [state, setState] = useState<Availability>(empty);
  useEffect(() => {
    let live = true;
    load().then((a) => live && setState(a));
    return () => {
      live = false;
    };
  }, []);
  return state;
}

/** Booked nights inside a stay (check-in through the night before check-out). */
export function clashesIn(booked: Set<string>, checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut || checkOut <= checkIn) return [];
  const out: string[] = [];
  const d = new Date(`${checkIn}T00:00:00Z`);
  for (let s = checkIn; s < checkOut; d.setUTCDate(d.getUTCDate() + 1), s = d.toISOString().slice(0, 10)) {
    if (booked.has(s)) out.push(s);
  }
  return out;
}

export const OVERLAP = "Those dates overlap a stay that's already booked. Pick dates that are open on the calendar.";
