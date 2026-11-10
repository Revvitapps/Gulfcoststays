import { contact } from "@/lib/site";
import { ContactForm } from "./contact-form";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/contact");

export default function ContactPage() {
  return (
    <>
    <JsonLd data={breadcrumbJsonLd("/contact")} />
    <section className="section-tight">
      <div className="wrap grid grid-2">
        <div>
          <p className="eyebrow">A person answers</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Say hello</h1>
          <p className="lede">Bookings, a month in winter, a question about the home. We answer within a few hours.</p>
          <p><a className="link" href={`mailto:${contact.email}`}>{contact.email}</a></p>
          {contact.phone ? <p><a className="link" href={`tel:${contact.phone}`}>{contact.phone}</a></p> : null}
          <p className="small">Okaloosa Island, Fort Walton Beach, FL. The street address comes with your booking confirmation.</p>
        </div>
        <ContactForm />
      </div>
    </section>
    </>
  );
}
