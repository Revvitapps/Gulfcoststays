import Link from "next/link";
import { brand, contact } from "@/lib/site";
import { pub } from "@/lib/pub";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/gcs-badge.webp" alt={`${brand.name} badge`} width={72} height={72} />
            <p style={{ margin: 0 }}>
              <strong style={{ color: "#fff" }}>{brand.name}</strong>
              <br />
              {brand.collection} collection · Okaloosa Island, FL
            </p>
            <p className="small" style={{ color: "rgba(255,255,255,0.6)" }}>{pub(brand.legal)}</p>
          </div>
          <div>
            <p className="eyebrow">Stay</p>
            <p><Link href="/island-retreat">Island Retreat</Link></p>
            <p><Link href="/rates">Your dates, your price</Link></p>
            <p><Link href="/book">Book direct</Link></p>
            <p><Link href="/area">Okaloosa Island guide</Link></p>
            <p><Link href="/faq">Questions</Link></p>
          </div>
          <div>
            <p className="eyebrow">Talk to us</p>
            <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
            {contact.phone ? <p><a href={`tel:${contact.phone}`}>{contact.phone}</a></p> : null}
            <p><Link href="/contact">Contact</Link> · <Link href="/about">About</Link></p>
          </div>
        </div>
        <div className="credit">
          <span>© {new Date().getFullYear()} {brand.name}. Prices before tax; Florida and Okaloosa County lodging taxes shown before you book.</span>
          <a className="volt" href="https://revvit.io" rel="noopener">Site by Revvit</a>
        </div>
      </div>
    </footer>
  );
}
