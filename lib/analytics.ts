/** Sends a GA4 event when the tag is loaded (production with NEXT_PUBLIC_GA_ID set); a no-op everywhere else. No personal data. */
export function track(event: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", event, params ?? {});
}
