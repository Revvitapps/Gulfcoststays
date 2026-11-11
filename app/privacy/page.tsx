import Link from "next/link";
import { brand, contact } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/privacy");

/**
 * Plain-English privacy policy. Keep it true to the code: forms post through
 * lib/pipeline.ts to /api/pipeline; Vercel Web Analytics is in app/layout.tsx;
 * GA4 is components/google-analytics.tsx (production, once NEXT_PUBLIC_GA_ID
 * is set). Change the effective date and `updated` in lib/seo.ts together.
 */
const effective = "November 10, 2026";
// GA4 paragraphs show only once the tag can actually load, so the page never names a tool the site doesn't use.
const ga4 = Boolean(process.env.NEXT_PUBLIC_GA_ID);

export default function PrivacyPage() {
  const mail = <a className="link" href={`mailto:${contact.email}`}>{contact.email}</a>;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("/privacy")} />
      <section className="section-tight">
        <div className="wrap prose">
          <p className="eyebrow">The fine print, kept short</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Privacy policy</h1>
          <p className="lede">What {brand.name} collects on this website, why, and what you can do about it. We are a small, owner-run vacation rental business in Fort Walton Beach, Florida.</p>
          <p className="small">Effective {effective}</p>

          <h2>What we collect</h2>
          <p><strong>When you request a booking</strong> at <Link href="/book">/book</Link>: your dates, number of guests, name, email, phone number if you give one, any note you write, and the price quote for those dates.</p>
          <p><strong>When you send the contact form</strong> at <Link href="/contact">/contact</Link>: your name, email and message.</p>
          <p><strong>When you email us</strong>: whatever you put in the email.</p>
          <p><strong>When you use the Ask helper</strong> and pick a question a person answers: which question you picked and the page you were on. Not your name or email.</p>
          <p><strong>When you browse</strong>: our host and our analytics tools receive the usual technical details a browser sends, such as IP address, browser and device type, the page you asked for and the site that sent you. More on that below.</p>
          <p>We do not take payment on this website. If you book, we email you a payment link, and the payment company behind that link handles your card details under its own privacy policy.</p>

          <h2>How we use it</h2>
          <p>To answer you, check the dates, confirm and manage your stay, send the street address and stay details, keep the business and tax records we have to keep, and protect the site from abuse. We use analytics in aggregate to see which pages help guests and which don&apos;t.</p>
          <p>We don&apos;t send marketing email unless you ask us to, for example to hear when a new home opens.</p>

          <h2>Where your details go</h2>
          <p>Form submissions go to this website&apos;s server, which is hosted by Vercel, and emailed to us through Resend, the service we use to send and receive booking email. A copy of what you sent is also kept in your own browser&apos;s storage so a request can finish sending if you lose signal; it stays on your device.</p>

          <h2>Analytics and cookies</h2>
          <p><strong>Vercel Web Analytics</strong> counts page views and visits. Vercel says it does this without cookies and without identifying you across sites.</p>
          {ga4 ? (
            <p><strong>Google Analytics 4</strong> measures how people find and use the site: pages viewed, time on page, rough location from IP address, device and browser. It sets cookies (names starting with <code>_ga</code>) to tell visits apart. We also send it two events, &ldquo;booking request sent&rdquo; (with the number of nights) and &ldquo;contact form sent&rdquo;. We never send it your name, email, phone or message. Google&apos;s explanation of how it uses this data is at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">policies.google.com/technologies/partner-sites</a>.</p>
          ) : null}
          <p>The site also uses your browser&apos;s local storage (not cookies) to remember things like whether you closed the &ldquo;add to home screen&rdquo; banner, and a service worker to keep pages working offline. Fonts, photos and scripts are served from this site, not from Google or other third parties. Nothing on the site sets a cookie unless Google Analytics is switched on.</p>
          {ga4 ? (
            <p><strong>To opt out</strong>: block or delete cookies in your browser settings, or install Google&apos;s <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">Google Analytics opt-out browser add-on</a>. Clearing your browser&apos;s site data for gulfcoaststays.co removes the local storage and the offline copy too. The site still works either way.</p>
          ) : (
            <p>Clearing your browser&apos;s site data for gulfcoaststays.co removes the local storage and the offline copy. The site still works either way.</p>
          )}

          <h2>Sharing</h2>
          <p>We do not sell your personal information, and we do not share it for advertising. We share it only with the service providers that run the site and our business (hosting, analytics, email, payments) so they can do that work for us, or when the law requires it or we need to protect our guests, our homes or ourselves.</p>

          <h2>How long we keep it</h2>
          <p>As long as we need it to answer you, look after your stay, and keep the records the law asks a business to keep. After that we delete it. Analytics data is kept under the retention settings of Vercel and Google.</p>

          <h2>Children</h2>
          <p>This site is for adults planning a trip. It is not aimed at children under 13, and we do not knowingly collect their information. If you think a child has sent us details, email us and we will delete them.</p>

          <h2>Your choices</h2>
          <p>You can browse the whole site without giving us your name or email; we only need them to answer a request. To see, correct or delete what we hold about you, email {mail} and a person will handle it.</p>

          <h2>Changes</h2>
          <p>If we change how we handle your information, we will update this page and the effective date above.</p>

          <h2>Contact</h2>
          <p>{brand.name}, Okaloosa Island, Fort Walton Beach, FL 32548. {mail}</p>
        </div>
      </section>
    </>
  );
}
