import { money, type Quote } from "@/lib/rates";

/**
 * The price breakdown for a chosen stay. Numbers appear only here, after the
 * guest has picked dates. Same nightly price as the listing sites (Matthew,
 * Nov 10 2026), so no savings line: just the fact that nothing is added.
 */
export function QuotePanel({ q, title = "Your price" }: { q: Quote; title?: string }) {
  return (
    <div className="quote" aria-live="polite">
      <p className="eyebrow" style={{ margin: 0 }}>{title}</p>
      {q.count > 0 ? (
        <>
          <div className="line"><span>{q.count} night{q.count === 1 ? "" : "s"} × avg {money(q.average)}</span><span>{money(q.subtotal)}</span></div>
          {q.lengthDiscount ? <div className="line"><span>{q.lengthLabel}</span><span>−{money(q.lengthDiscount)}</span></div> : null}
          {q.launchDiscount ? <div className="line"><span>Launch pricing, 10% off</span><span>−{money(q.launchDiscount)}</span></div> : null}
          <div className="line"><span>Cleaning fee</span><span>{money(q.cleaning)}</span></div>
          <div className="line total"><span>Total before tax</span><span>{money(q.total)}</span></div>
          <div className="line saves"><span>Booking or service fee</span><span>{money(0)}</span></div>
          <p className="small" style={{ margin: 0 }}>
            {[...new Set(q.nights.map((n) => n.event ?? `${n.season} season`))].join(" · ")}. Florida and Okaloosa County lodging taxes are added on the confirmation.
          </p>
        </>
      ) : (
        <p className="small" style={{ margin: 0 }}>Pick your dates to see the price.</p>
      )}
    </div>
  );
}
