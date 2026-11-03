"use client";
import { useEffect, useSyncExternalStore } from "react";
import { flush } from "@/lib/pipeline";

function subscribe(listener: () => void) {
  window.addEventListener("online", listener);
  window.addEventListener("offline", listener);
  return () => {
    window.removeEventListener("online", listener);
    window.removeEventListener("offline", listener);
  };
}

/** Registers the service worker in production and flushes queued requests when back online. */
export function Pwa() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  }, []);
  useEffect(() => {
    if (online) flush();
  }, [online]);
  if (online) return null;
  return (
    <p className="offline-banner" role="status">
      No signal. Rates and the home still work; a booking request sends when you&apos;re back online.
    </p>
  );
}
