import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Compass, Fish, Moon, Sun, Users, Waves } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { brand } from "@/lib/site";
import { property } from "@/data/property";
import { lodgingJsonLd, pageMetadata } from "@/lib/seo";
import { LAUNCH_UNTIL } from "@/lib/rates";
import { DirectBenefits } from "@/components/direct";
import { RevealCard, SketchReveal } from "@/components/sketch-reveal";

// Rebuilt daily so "from $X this week" tracks the season.
export const revalidate = 86400;

export const metadata = pageMetadata("/");

// "What do you need?" answers. Each one lands on a priced or concrete outcome.
const answers = [
  { href: "/book?preset=weekend", icon: Sun, title: "A beach weekend", detail: "Fri to Sun, walk to the Gulf, back for dinner" },
  { href: "/book?preset=week", icon: Waves, title: "A week in summer", detail: "7 nights, 10% off, kids at the Gulfarium" },
  { href: "/book?preset=month", icon: Moon, title: "A month in winter", detail: "January and February by the month, 25% off" },
  { href: "/area", icon: Fish, title: "A fishing base", detail: "Pier, boat basin and a fryer for the catch" },
  { href: "/island-retreat", icon: Users, title: "Room for the family", detail: "Two bedrooms, two baths, beach gear by the door" },
  { href: "/rates", icon: CalendarDays, title: "Just the price", detail: "Pick dates, see the exact price, no login" },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={lodgingJsonLd()} />
      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <p className="eyebrow">{property.collection} · Okaloosa Island</p>
            <h1>
              Walk to the Gulf <span className="script" style={{ fontSize: "0.5em", display: "block" }}>one way,</span> the bay the other.
            </h1>
            <p className="lede">{brand.description}</p>
            <div className="row" style={{ marginTop: "0.5rem" }}>
              <Link href="/book" className="button button-orange button-lg">
                Book direct <ArrowRight size={20} />
              </Link>
              <Link href="/island-retreat" className="button button-ghost">
                See the home
              </Link>
            </div>
          </div>
          <div className="hero-price row" style={{ gap: "1.25rem", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-badge" src="/brand/island-retreat-badge-alt.webp" alt="Island Retreat badge" width={120} height={120} />
            <div>
              <div className="stat wash wash-sea" style={{ fontSize: "1.9rem" }}>
                No booking fee
                <small>Pick your dates, see the exact price. No service fee added at checkout.</small>
              </div>
              <p className="small" style={{ margin: "0.4rem 0 0" }}>
                Launch pricing: 10% off through {new Date(LAUNCH_UNTIL + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
        <div className="hero-art" aria-hidden={false}>
          <Image src="/brand/hero-sketch.jpg" alt="Illustration of the Island Retreat courtyard: two raised buildings, a palm and the center stairs" fill priority quality={90} sizes="100vw" />
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

      <hr className="ink-rule" />
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
          <RevealCard k="beachWalk" className="reveal-solo" sizes="(min-width: 720px) 50vw, 100vw" />
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
              That honesty is the point. Same sand as the Gulf-front towers, a neighborhood price, and no booking fee when you book here.
            </p>
            <Link href="/rates" className="button">
              Check my dates
            </Link>
          </div>
        </div>
      </section>

      <hr className="ink-rule" />
      <SketchReveal keys={["living", "kitchen", "bed2"]} heading="Dream it first, then find it real" lede="Painted from the home itself. Hover, or scroll past on your phone, and the real room shows through, just as it will be when you arrive." />

      <DirectBenefits heading="Book direct, skip the fees" />
    </>
  );
}
