import { pub } from "@/lib/pub";
import Link from "next/link";
import { brand } from "@/lib/site";

export const metadata = {
  title: "About Gulf Coast Stays | Real homes on the Emerald Coast",
  description: "A small, owner-run collection of vacation homes on Florida's Gulf Coast, starting with Island Retreat in Fort Walton Beach. Direct booking, straight talk.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section-tight">
        <div className="wrap grid grid-2" style={{ alignItems: "center" }}>
          <div>
            <p className="eyebrow">Who we are</p>
            <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Gulf Coast <span className="script" style={{ fontSize: "0.55em" }}>Stays</span></h1>
            <p className="lede">A family-run collection of real homes on the Emerald Coast. We manage them ourselves, answer our own email, and price under the towers because we are not one.</p>
            <p>Island Retreat in Fort Walton Beach is the first. More homes along the coast will follow, with the same standards and the same direct booking.</p>
            <Link href="/island-retreat" className="button">Island Retreat</Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/gcs-badge.webp" alt={`${brand.name} pelican badge`} width={360} height={360} style={{ width: "min(360px, 70%)", margin: "0 auto" }} />
        </div>
      </section>
      <section className="section">
        <div className="wrap grid grid-3">
          {[
            ["Book direct", "No platform service fee. The same home, and the person who manages it on the other end of the email."],
            ["Straight talk", "No \"luxury\", no \"paradise\", no views we don't have. Real distances, real photos."],
            ["Fishing and fun first", "Where to launch a kayak, who fries the catch, when the sun sets. We live here."],
          ].map(([t, d]) => (
            <div key={t}>
              <hr className="rule-orange" />
              <h2 style={{ fontSize: "1.5rem" }}>{t}</h2>
              <p className="muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="band section-tight">
        <div className="wrap">
          <p className="eyebrow">Coming next</p>
          <h2>More homes on the way</h2>
          <p className="small">Destin and Gulf Shores are next. Want to hear when a home opens? <Link href="/contact" style={{ color: "#fff" }}>Leave your email</Link>.</p>
          <p className="small">{pub(brand.legal)}</p>
        </div>
      </section>
    </>
  );
}
