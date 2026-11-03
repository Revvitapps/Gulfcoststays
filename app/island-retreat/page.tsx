import Link from "next/link";
import { BedDouble, Check, Clock, Footprints, Palmtree, X } from "lucide-react";
import { Photo } from "@/components/photo";
import { JsonLd } from "@/components/json-ld";
import { property } from "@/data/property";
import { gallery } from "@/lib/photos";
import { lodgingJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Island Retreat | 2-bedroom Fort Walton Beach condo on Okaloosa Island",
  description: "Island Retreat: a raised two-bedroom condo on Okaloosa Island. Public beach access across the street, the boat basin a short walk, Gulfarium minutes away. Book direct.",
};

const Flag = ({ text }: { text: string }) => {
  const m = text.match(/^(.*?)(\[PLACEHOLDER:[^\]]*\])(.*)$/);
  if (!m) return <>{text}</>;
  return (
    <>
      {m[1]}
      <span className="placeholder">{m[2]}</span>
      {m[3]}
    </>
  );
};

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

      <section className="section-tight">
        <div className="wrap grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))" }}>
          {gallery.map((k, i) => (
            <Photo key={k} slot={k} className={i === 0 ? "photo-wide" : ""} sizes="(min-width: 720px) 33vw, 100vw" priority={i === 0} />
          ))}
        </div>
      </section>

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
                <li><span>Bathrooms: <Flag text={property.bathrooms} /></span></li>
                <li><span>Sleeps: up to {property.sleeps} <Flag text={property.sleepsNote} /></span></li>
                <li><span>Parking: <Flag text={property.parking} /></span></li>
                <li><span>Wi-Fi: <Flag text={property.wifi} /></span></li>
              </ul>
            </div>
            <div className="card card-dark">
              <h3>House rules</h3>
              <ul className="list">
                <li><X size={18} aria-hidden style={{ color: "var(--orange)" }} /> <span>No pets, no smoking, no parties</span></li>
                <li><Clock size={18} aria-hidden style={{ color: "var(--orange)" }} /> <span>Check-in 4 pm, check-out 10 am</span></li>
                <li><Check size={18} aria-hidden style={{ color: "var(--orange)" }} /> <span>Minimum 2 to 4 nights by season</span></li>
              </ul>
              <p className="small" style={{ marginTop: "0.5rem" }}>Cleaning fee $135 per stay. Lodging taxes added at booking.</p>
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
