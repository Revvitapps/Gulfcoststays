import Link from "next/link";
import { ThanksCard } from "./thanks-card";

export const metadata = { title: "Request received", robots: { index: false, follow: false } };

export default function ThanksPage() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 640 }}>
        <p className="eyebrow">Got it</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4rem)" }}>Request received</h1>
        <ThanksCard />
        <div className="row" style={{ marginTop: "1.25rem" }}>
          <Link href="/area" className="button">Plan the days</Link>
          <Link href="/" className="button button-ghost">Home</Link>
        </div>
      </div>
    </section>
  );
}
