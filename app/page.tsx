import Link from "next/link";
import { ArrowRight, CalendarDays, Compass, Fish, Moon, Sun, Users, Waves } from "lucide-react";
import { Photo } from "@/components/photo";
import { JsonLd } from "@/components/json-ld";
import { brand } from "@/lib/site";
import { property } from "@/data/property";
import { lodgingJsonLd } from "@/lib/seo";
import { LAUNCH_UNTIL, money, nightly, iso } from "@/lib/rates";

// Rebuilt daily so "from $X this week" tracks the season.
export const revalidate = 86400;

export const metadata = {
  title: `${brand.name} | Island Retreat, a Fort Walton Beach condo on Okaloosa Island`,
  description: `Book Island Retreat direct: a 2-bedroom condo on stilts on Okaloosa Island, Fort Walton Beach. Beach across the street, bay a short walk. No platform fees.`,
};

// "What do you need?" answers. Each one lands on a priced or concrete outcome.
const answers = [
  { href: "/book?preset=weekend", icon: Sun, title: "A beach weekend", detail: "Fri to Sun, walk to the Gulf, back for dinner" },
  { href: "/book?preset=week", icon: Waves, title: "A week in summer", detail: "7 nights, 10% off, kids at the Gulfarium" },
  { href: "/rates#monthly", icon: Moon, title: "A month in winter", detail: "Snowbird rates from $2,300 in January" },
  { href: "/area", icon: Fish, title: "A fishing base", detail: "Pier, boat basin and a fryer for the catch" },
  { href: "/island-retreat", icon: Users, title: "Room for the family", detail: "Two real bedrooms, not a studio" },
  { href: "/rates", icon: CalendarDays, title: "Just the rates", detail: "Every season and event, no login" },
];

export default function HomePage() {
  const tonight = nightly(iso(new Date()));
  return (
    <>
      <JsonLd data={lodgingJsonLd()} />
      <section className="hero on-dark">
        <Photo slot="hero" className="photo-fill hero-media" priority quiet sizes="100vw" />
        <div className="wrap hero-inner">
          <div>
            <p className="eyebrow">{property.collection} · Okaloosa Island</p>
            <h1>
              Walk to the Gulf <span className="script" style={{ fontSize: "0.5em", display: "block" }}>one way,</span> the bay the other.
            </h1>
            <p className="lede">{property.summary}</p>
            <div className="row" style={{ marginTop: "0.5rem" }}>
              <Link href="/book" className="button button-orange button-lg">
                Book direct <ArrowRight size={20} />
              </Link>
              <Link href="/island-retreat" className="button button-ghost">
                See the home
              </Link>
            </div>
          </div>
          <div className="row" style={{ gap: "1.25rem", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-badge" src="/brand/island-retreat-badge-alt.webp" alt="Island Retreat badge" width={120} height={120} />
            <div>
              <div className="stat">
                from {money(tonight.rate)}
                <small style={{ color: "rgba(255,255,255,0.7)" }}>per night this week · {tonight.season.toLowerCase()} season</small>
              </div>
              <p className="small" style={{ color: "rgba(255,255,255,0.7)", margin: "0.4rem 0 0" }}>
                Launch pricing: 10% off through {new Date(LAUNCH_UNTIL + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">One question</p>
          <h2>What do you need?</h2>
          <div className="grid grid-2 grid-3" style={{ marginTop: "1rem" }}>
            {answers.map(({ href, icon: Icon, title, detail }) => (
              <Link key={title} href={href} className="tile">
                <Icon size={26} aria-hidden />
                <strong>{title}</strong>
                <span className="small">{detail}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band section-tight">
        <div className="wrap grid grid-3">
          {property.features.slice(0, 3).map((f) => (
            <div key={f.title}>
              <hr className="rule-orange" />
              <h3>{f.title}</h3>
              <p className="small">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap grid grid-2" style={{ alignItems: "center" }}>
          <Photo slot="beachWalk" sizes="(min-width: 720px) 50vw, 100vw" />
          <div>
            <p className="eyebrow">Straight talk</p>
            <h2>What it is, and what it isn&apos;t</h2>
            <ul className="list">
              {property.honest.map((h) => (
                <li key={h}>
                  <Compass size={18} aria-hidden /> <span>{h}</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "1rem" }}>
              That honesty is the point. The Gulf-front towers average $341 a night. Island Retreat sits 30 to 40% under that, a walk from the same sand.
            </p>
            <Link href="/rates" className="button">
              See every rate
            </Link>
          </div>
        </div>
      </section>

      <section className="band-sea section">
        <div className="wrap row between">
          <div>
            <h2 style={{ marginBottom: "0.25rem" }}>Book direct, skip the fees</h2>
            <p className="muted" style={{ margin: 0 }}>Same home as the listings, no service fee, a person on the other end.</p>
          </div>
          <Link href="/book" className="button button-orange button-lg">
            Check my dates
          </Link>
        </div>
      </section>
    </>
  );
}
