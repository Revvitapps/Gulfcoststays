import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { allFaqs, faqGroups } from "@/lib/faq";
import { pub } from "@/lib/pub";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/faq");

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(allFaqs)} />
      <JsonLd data={breadcrumbJsonLd("/faq")} />
      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">Good to know</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Questions guests ask</h1>
          <p className="lede">Straight answers about Island Retreat on Okaloosa Island. Anything else, email us and a person answers.</p>
        </div>
      </section>
      {faqGroups.map((g) => (
        <section key={g.heading} className="section-tight">
          <div className="wrap grid grid-2">
            <div>
              <h2>{g.heading}</h2>
            </div>
            <div>
              {g.items.map((f) => (
                <details key={f.q} className="card" style={{ marginBottom: "0.5rem" }}>
                  <summary style={{ cursor: "pointer", fontWeight: 600 }}>{f.q}</summary>
                  <p style={{ margin: "0.5rem 0 0" }}>{pub(f.a)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="section">
        <div className="wrap row">
          <Link href="/book" className="button button-orange button-lg">Check my dates</Link>
          <Link href="/contact" className="button button-ghost">Ask us something else</Link>
        </div>
      </section>
    </>
  );
}
