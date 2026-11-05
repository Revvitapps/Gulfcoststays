import Image from "next/image";
import { sketches } from "@/lib/photos";

/** A strip of the ink-and-watercolor sketches. Pass keys to pick a few; default is all five. */
export function Sketchbook({ keys, heading = "From the sketchbook", note = "Painted from our own photos of the place. Sketches, not photos." }: { keys?: string[]; heading?: string; note?: string }) {
  const art = keys ? sketches.filter((a) => keys.includes(a.key)) : sketches;
  return (
    <section className="section-tight sketchbook" aria-label={heading}>
      <div className="wrap">
        <p className="eyebrow">{heading}</p>
        <p className="small" style={{ margin: "0 0 1rem" }}>{note}</p>
        <div className="sketch-strip">
          {art.map((a) => (
            <figure key={a.key} className={`sketch ${a.h > a.w ? "sketch-tall" : ""}`}>
              <Image src={a.src} alt={a.alt} width={a.w} height={a.h} sizes="(min-width: 900px) 33vw, 80vw" quality={85} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
