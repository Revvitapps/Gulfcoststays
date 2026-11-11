import Link from "next/link";
import { BadgePercent, KeyRound, MessageSquareText } from "lucide-react";

/** The three reasons to book here instead of a listing site. Shown on every page that sells. */
export const directReasons = [
  { icon: BadgePercent, title: "No booking fee", detail: "You pay the nightly rate, one cleaning fee and lodging tax. No service fee is added at checkout." },
  { icon: MessageSquareText, title: "A person, not a platform", detail: "You write to the owner. Early check-in, a boat on a trailer, a birthday on the table: ask." },
  { icon: KeyRound, title: "Same home, same calendar", detail: "It is the same Island Retreat you see on the listing sites. Booking here just skips the middleman." },
];

export function DirectBenefits({ heading = "Why book direct", cta = true }: { heading?: string; cta?: boolean }) {
  return (
    <section className="section band-sea" aria-labelledby="why-direct">
      <div className="wrap">
        <p className="eyebrow">Book direct</p>
        <h2 id="why-direct">{heading}</h2>
        <div className="grid grid-3" style={{ marginTop: "1rem" }}>
          {directReasons.map(({ icon: Icon, title, detail }) => (
            <div key={title} className="card">
              <Icon size={26} aria-hidden style={{ color: "var(--orange-deep)" }} />
              <h3 style={{ marginTop: "0.5rem" }}>{title}</h3>
              <p style={{ margin: 0 }}>{detail}</p>
            </div>
          ))}
        </div>
        {cta ? (
          <div className="row" style={{ marginTop: "1.25rem" }}>
            <Link href="/book" className="button button-orange button-lg">Check my dates</Link>
            <span className="small">Pick dates, see the exact price. No account, no charge until we confirm.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
