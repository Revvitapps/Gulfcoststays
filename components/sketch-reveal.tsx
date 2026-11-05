"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { photos, sketches, type PhotoKey } from "@/lib/photos";

/** Which real photo sits behind each sketch. */
const pairs: Record<string, PhotoKey> = { courtyard: "deck", beachWalk: "beachWalk", kitchen: "kitchen", bed1: "bed1", tables: "tables" };

function subscribeHover(cb: () => void) {
  const mq = window.matchMedia("(hover: none)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function Card({ k, wide }: { k: string; wide?: boolean }) {
  const art = sketches.find((a) => a.key === k)!;
  const photo = photos[pairs[k]];
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const touch = useSyncExternalStore(subscribeHover, () => window.matchMedia("(hover: none)").matches, () => false);

  // Phones and tablets have no hover: reveal the photo as the card scrolls through the middle of the screen.
  useEffect(() => {
    if (!touch || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "-35% 0px -35% 0px", threshold: 0 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [touch]);

  const toggle = () => setOn((v) => !v);
  return (
    <div
      ref={ref}
      className={`reveal ${wide ? "reveal-wide" : ""} ${on ? "is-on" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={on}
      aria-label={`${photo.alt}. ${touch ? "Tap" : "Hover"} to switch between the sketch and the photo.`}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
    >
      <Image className="reveal-sketch" src={art.src} alt="" fill sizes={wide ? "(min-width: 900px) 66vw, 100vw" : "(min-width: 900px) 33vw, 100vw"} quality={85} />
      {photo.src ? <Image className="reveal-photo" src={photo.src} alt="" fill sizes={wide ? "(min-width: 900px) 66vw, 100vw" : "(min-width: 900px) 33vw, 100vw"} quality={90} /> : null}
      <span className="reveal-hint" aria-hidden>{on ? "Photo" : "Sketch"}</span>
    </div>
  );
}

/** Sketch first, photo underneath. Hover on a mouse, scroll or tap on a phone. */
export function SketchReveal({ keys = ["courtyard", "beachWalk", "kitchen", "bed1", "tables"], heading = "The home, drawn and then real", lede = "Every sketch is painted from the home itself. Run your cursor over one, or scroll past it on your phone, and the photo shows through." }: { keys?: string[]; heading?: string; lede?: string }) {
  return (
    <section className="section-tight" aria-label={heading}>
      <div className="wrap">
        <p className="eyebrow">In ink and watercolor</p>
        <h2 style={{ marginTop: 0 }}>{heading}</h2>
        <p className="lede" style={{ maxWidth: "52ch" }}>{lede}</p>
      </div>
      <div className="reveal-grid">
        {keys.map((k, i) => <Card key={k} k={k} wide={i === 0 && keys.length !== 3} />)}
      </div>
    </section>
  );
}
