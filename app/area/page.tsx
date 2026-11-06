import Link from "next/link";
import { RevealCard } from "@/components/sketch-reveal";
import { JsonLd } from "@/components/json-ld";
import { faqs, kinds, spots } from "@/lib/area";
import { pub } from "@/lib/pub";
import { faqJsonLd } from "@/lib/seo";
import { sketchFor, type PhotoKey } from "@/lib/photos";

export const metadata = {
  title: "Okaloosa Island guide | Beach, bay, Gulfarium, pier and where to eat",
  description: "What's around Island Retreat on Okaloosa Island: the beach across the street, the boat basin, Gulfarium, the pier and Boardwalk, Stewby's, and downtown Fort Walton Beach.",
};

export default function AreaPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">Okaloosa Island</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Talk like the dock</h1>
          <p className="lede">Real distances, no brochure. Where to launch a kayak, who fries the catch, when the sun sets over the bay.</p>
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap grid grid-2 grid-3">
          {spots.map((s) => (
            <article key={s.name} className="card" style={{ padding: 0, overflow: "hidden" }}>
              {s.photo && sketchFor(s.photo as PhotoKey) ? <RevealCard k={sketchFor(s.photo as PhotoKey)!.key} title={false} className="reveal-card-top" sizes="(min-width: 1024px) 33vw, (min-width: 720px) 50vw, 100vw" /> : null}
              <div style={{ padding: "1rem 1.1rem" }}>
                <div className="row between">
                  <span className="chip chip-orange">{kinds[s.kind]}</span>
                  <span className="small">{s.distance}</span>
                </div>
                <h2 style={{ marginTop: "0.6rem", fontSize: "1.5rem" }}>{s.name}</h2>
                <p style={{ margin: 0 }}>{s.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="wrap grid grid-2">
          <div>
            <p className="eyebrow">Good to know</p>
            <h2>Questions guests ask</h2>
          </div>
          <div>
            {faqs.map((f) => (
              <details key={f.q} className="card" style={{ marginBottom: "0.5rem" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>{f.q}</summary>
                <p style={{ margin: "0.5rem 0 0" }}>{pub(f.a)}</p>
              </details>
            ))}
            <Link href="/book" className="button button-orange" style={{ marginTop: "0.75rem" }}>Check my dates</Link>
          </div>
        </div>
      </section>
    </>
  );
}
