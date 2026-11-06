import Link from "next/link";
import { BedDouble, Check, Clock, Footprints, Palmtree, X } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { property } from "@/data/property";
import { pub } from "@/lib/pub";
import { DirectBenefits } from "@/components/direct";
import { SketchReveal } from "@/components/sketch-reveal";
import { lodgingJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Island Retreat | 2-bedroom Fort Walton Beach condo on Okaloosa Island",
  description: "Island Retreat: a raised two-bedroom condo on Okaloosa Island. Public beach access across the street, the boat basin a short walk, Gulfarium minutes away. Book direct.",
};

const Flag = ({ text }: { text: string }) => <>{pub(text)}</>;
/** A labelled fact row that disappears while the fact is still unconfirmed. */
const Fact = ({ label, text }: { label: string; text: string }) => (pub(text) ? <li><span>{label}: {pub(text)}</span></li> : null);

export default function HomeDetailPage() {
  return (
    <>
      <JsonLd data={lodgingJsonLd()} />
      <section className="section-tight">
        <div className="wrap">
          <div className="row between" style={{ alignItems: "flex-end" }}>
            <div>
              <p className="eyebrow">{property.collection} collection</p>
              <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Island Retreat</h1>
              <p className="lede">{property.tagline}</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/island-retreat-badge.webp" alt="" width={110} height={110} style={{ width: 110, height: 110 }} />
          </div>
          <div className="row" style={{ marginTop: "0.5rem" }}>
            <span className="chip chip-sea"><BedDouble size={14} /> {property.bedrooms} bedrooms</span>
            <span className="chip"><Footprints size={14} /> Beach across the street</span>
            <span className="chip"><Palmtree size={14} /> On stilts</span>
            <span className="chip"><Clock size={14} /> In 4 pm · out 10 am</span>
          </div>
        </div>
      </section>

      <SketchReveal />


      <section className="section">
        <div className="wrap grid grid-2">
          <div>
            <p className="eyebrow">The home</p>
            <h2>Two real bedrooms, a breeze, and the water both ways</h2>
            <p>{property.summary}</p>
            <ul className="list">
              {property.features.map((f) => (
                <li key={f.title}>
                  <Check size={18} aria-hidden />
                  <span>
                    <strong>{f.title}.</strong> <Flag text={f.detail} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid">
            <div className="card">
              <h3>Sleeps and spaces</h3>
              <ul className="list">
                <li><span>Bedrooms: {property.bedrooms}</span></li>
                <Fact label="Bathrooms" text={property.bathrooms} />
                <li><span>Sleeps: up to {property.sleeps} <Flag text={property.sleepsNote} /></span></li>
                <li><span>Parking: <Flag text={property.parking} /></span></li>
                <Fact label="Wi-Fi" text={property.wifi} />
                <li><span>Laundry: none in the unit. Coin laundry and a laundromat are a short drive.</span></li>
              </ul>
            </div>
            <div className="card card-dark">
              <h3>House rules</h3>
              <ul className="list">
                <li><X size={18} aria-hidden style={{ color: "var(--orange)" }} /> <span>No pets, no smoking, no parties</span></li>
                <li><Clock size={18} aria-hidden style={{ color: "var(--orange)" }} /> <span>Check-in 4 pm, check-out 10 am</span></li>
                <li><Check size={18} aria-hidden style={{ color: "var(--orange)" }} /> <span>Minimum 2 to 4 nights by season</span></li>
              </ul>
              <p className="small" style={{ marginTop: "0.5rem" }}>One cleaning fee per stay and lodging taxes are shown in your price before you book.</p>
            </div>
            <div className="card card-sea">
              <h3>Straight talk</h3>
              {property.honest.map((h) => (
                <p key={h} style={{ margin: "0 0 0.35rem" }}>{h}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DirectBenefits />

      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">Steps away</p>
          <h2>What&apos;s nearby</h2>
          <div className="grid grid-3">
            {property.nearby.map((n) => (
              <div key={n.name} className="tile" style={{ transform: "none" }}>
                <strong>{n.name}</strong>
                <span className="small">{n.distance}</span>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: "1.25rem" }}>
            <Link href="/book" className="button button-orange button-lg">Check my dates</Link>
            <Link href="/area" className="button button-ghost">Area guide</Link>
          </div>
        </div>
      </section>
    </>
  );
}
