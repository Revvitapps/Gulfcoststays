import { contact } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact Gulf Coast Stays",
  description: "Email bookings@gulfcoaststays.co or send a note. Questions about Island Retreat, a group, a month-long stay, or a future home in the collection.",
};

export default function ContactPage() {
  return (
    <section className="section-tight">
      <div className="wrap grid grid-2">
        <div>
          <p className="eyebrow">A person answers</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Say hello</h1>
          <p className="lede">Bookings, a month in winter, a question about the home. We answer within a few hours.</p>
          <p><a className="link" href={`mailto:${contact.email}`}>{contact.email}</a></p>
          <p>{contact.phone ? <a className="link" href={`tel:${contact.phone}`}>{contact.phone}</a> : <span className="placeholder">{contact.phoneLabel}</span>}</p>
          <p className="small">Okaloosa Island, Fort Walton Beach, FL. The street address comes with your booking confirmation.</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
