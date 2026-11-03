import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 560 }}>
        <p className="eyebrow">404</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4rem)" }}>Wrong turn at the bridge</h1>
        <p className="lede">That page isn&apos;t here. The home, the rates and the booking form are.</p>
        <div className="row">
          <Link href="/island-retreat" className="button">Island Retreat</Link>
          <Link href="/book" className="button button-orange">Book</Link>
        </div>
      </div>
    </section>
  );
}
