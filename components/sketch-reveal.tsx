"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { photos, sketches, tour } from "@/lib/photos";

function subscribeHover(cb: () => void) {
  const mq = window.matchMedia("(hover: none)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * One place: the watercolor on top, the real photo underneath.
 * Hover or focus on a mouse; on phones it reveals as it scrolls through the middle of the screen, and a tap toggles.
 */
export function RevealCard({ k, wide, title = true, sizes, className = "" }: { k: string; wide?: boolean; title?: boolean; sizes?: string; className?: string }) {
  const art = sketches.find((a) => a.key === k)!;
  const photo = photos[art.photo];
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const touch = useSyncExternalStore(subscribeHover, () => window.matchMedia("(hover: none)").matches, () => false);

  useEffect(() => {
    if (!touch || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "-35% 0px -35% 0px", threshold: 0 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [touch]);

  const toggle = () => setOn((v) => !v);
  const sz = sizes ?? (wide ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, (min-width: 720px) 50vw, 100vw");
  return (
    <div
      ref={ref}
      className={`reveal ${wide ? "reveal-wide" : ""} ${on ? "is-on" : ""} ${className}`}
      role="button"
      tabIndex={0}
      aria-pressed={on}
      aria-label={`${art.title}. ${photo.alt}. ${touch ? "Tap" : "Hover"} to switch between the sketch and the photo.`}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
    >
      <Image className="reveal-sketch" src={art.src} alt="" fill sizes={sz} quality={85} />
      {photo.src ? <Image className="reveal-photo" src={photo.src} alt="" fill sizes={sz} quality={90} /> : null}
      {title ? <span className="reveal-title" aria-hidden>{art.title}</span> : null}
      <span className="reveal-hint" aria-hidden>{on ? "The real thing" : "Sketch"}</span>
      {photo.credit ? <span className="photo-credit reveal-credit" aria-hidden>{photo.credit}</span> : null}
    </div>
  );
}

/** A wall of places, each a sketch with the real photo behind it. */
export function SketchReveal({
  keys = tour,
  eyebrow = "Painted from the real thing",
  heading = "Dream it first. Then walk in and find it real.",
  lede = "Every watercolor here is painted from the home itself. Run your cursor over one, or scroll past it on your phone, and the real room shows through, just the way it will look when you open the door.",
  span = ["tables", "beachWalk"],
}: { keys?: string[]; eyebrow?: string; heading?: string; lede?: string; span?: string[] }) {
  const wideFirst = keys.length !== 3;
  return (
    <section className="section-tight" aria-label={heading}>
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2 style={{ marginTop: 0 }}>{heading}</h2>
        <p className="lede" style={{ maxWidth: "56ch" }}>{lede}</p>
      </div>
      <div className="reveal-grid">
        {keys.map((k, i) => <RevealCard key={k} k={k} wide={wideFirst && i === 0} className={span.includes(k) && keys.length > 3 ? "reveal-span" : ""} sizes={span.includes(k) && keys.length > 3 ? "(min-width: 720px) 50vw, 100vw" : undefined} />)}
      </div>
    </section>
  );
}
