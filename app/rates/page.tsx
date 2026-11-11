import Link from "next/link";
import { seasonTable } from "@/lib/rates";
import { QuoteWidget } from "@/components/quote-widget";
import { DirectBenefits } from "@/components/direct";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/rates");

export default function RatesPage() {
  const seasons = seasonTable();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("/rates")} />
      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">No login, no surprise fees</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Your dates, your price</h1>
          <p className="lede">Pick dates and the exact price shows: nightly, any discounts, and the cleaning fee. Nothing is charged until a person confirms.</p>
        </div>
      </section>

      <section className="section-tight" id="quote">
        <div className="wrap">
          <QuoteWidget />
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap grid grid-2">
          <div className="card">
            <h2 style={{ fontSize: "1.5rem" }}>How the year runs</h2>
            <div className="season-bar" aria-hidden style={{ marginTop: "0.75rem" }}>
              {seasons.map((s) => (
                <div key={s.month} className={`season-${s.season}`}>{s.month.slice(0, 3)}</div>
              ))}
            </div>
            <p className="small" style={{ marginTop: "0.5rem" }}>Seafoam quiet · sand busy · orange peak. Minimum stays run two to four nights by season; holiday weekends ask a little more.</p>
            <ul className="list" style={{ marginTop: "0.5rem" }}>
              <li><span>Weekly stays 10% off, monthly stays 25% off.</span></li>
              <li><span>Launch pricing: another 10% off every stay through Jan 31, 2027.</span></li>
              <li><span>One cleaning fee per stay. Lodging taxes added on the confirmation, as Florida and Okaloosa County require.</span></li>
            </ul>
          </div>
          <div className="card card-dark" id="monthly">
            <h2 style={{ fontSize: "1.5rem" }}>Snowbird months</h2>
            <p>January and February go by the month: 28-night minimum, one cleaning fee, the bay for a morning walk and the Gulf for the afternoon. They go first.</p>
            <Link href="/book?preset=month" className="button button-orange button-block">Ask about a month</Link>
          </div>
        </div>
      </section>

      <DirectBenefits cta={false} />
    </>
  );
}
