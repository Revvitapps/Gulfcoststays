"use client";
import { useEffect, useState } from "react";
import { Share, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "gcs:install-dismissed";
const VISITS_KEY = "gcs:visits";
const COUNTED_KEY = "gcs:visit-counted";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosSafari() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

/**
 * "Add to home screen" banner. Uses the native install prompt where the
 * browser offers one (Android Chrome, desktop Chromium) and shows the Share →
 * Add to Home Screen steps on iOS Safari, which has no prompt API. Appears
 * from the second visit or after a report is filed, never inside the installed
 * app, and stays dismissed once closed. Adapted from the Revvit PWA shell.
 */
export function InstallPrompt() {
  const [mode, setMode] = useState<"hidden" | "native" | "ios">("hidden");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    let visits = 0;
    let dismissed = false;
    try {
      visits = Number(localStorage.getItem(VISITS_KEY) ?? 0);
      if (!sessionStorage.getItem(COUNTED_KEY)) {
        visits += 1;
        localStorage.setItem(VISITS_KEY, String(visits));
        sessionStorage.setItem(COUNTED_KEY, "1");
      }
      dismissed = localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      return;
    }
    // A booking request or inquiry also unlocks the prompt on the first visit.
    let hasContact = false;
    try {
      hasContact = (JSON.parse(localStorage.getItem("gcs:contacts") ?? "[]") as unknown[]).length > 0;
    } catch {}
    if (dismissed || (visits < 2 && !hasContact) || isStandalone()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setMode("native");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    const iosTimer = isIosSafari() ? window.setTimeout(() => setMode("ios"), 1500) : 0;
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.clearTimeout(iosTimer);
    };
  }, []);

  if (mode === "hidden") return null;

  const dismiss = () => {
    setMode("hidden");
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setMode("hidden");
    else dismiss();
  };

  return (
    <div className="install-banner" role="dialog" aria-labelledby="install-title">
      <div>
        <p id="install-title">
          <strong>Keep Island Retreat on your home screen</strong>
        </p>
        {mode === "ios" ? (
          <p className="small">
            Tap <Share size={14} aria-label="Share" /> Share, then “Add to Home Screen”.
          </p>
        ) : (
          <p className="small">Rates, directions and your booking, even on the beach with one bar.</p>
        )}
      </div>
      {mode === "native" ? (
        <button type="button" className="button" onClick={install}>
          Install
        </button>
      ) : null}
      <button type="button" className="icon-button" onClick={dismiss} aria-label="Not now">
        <X size={20} />
      </button>
    </div>
  );
}
