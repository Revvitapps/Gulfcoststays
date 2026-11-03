import { BookForm } from "./book-form";
import { contact } from "@/lib/site";

export const metadata = {
  title: "Book Island Retreat direct | No platform fees",
  description: "Pick your dates, see the exact price with discounts and cleaning fee, and send a booking request for Island Retreat on Okaloosa Island. A person confirms by email.",
};

export default async function BookPage({ searchParams }: { searchParams: Promise<{ preset?: string }> }) {
  const { preset } = await searchParams;
  return (
    <section className="section-tight">
      <div className="wrap">
        <p className="eyebrow">Direct booking</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Check your dates</h1>
        <p className="lede">The price you see is the price, before lodging tax. Send the request and we confirm by email, usually within the hour.</p>
        <BookForm preset={preset ?? null} />
        <p className="small" style={{ marginTop: "1.5rem" }}>
          Prefer a platform? {contact.airbnb ? <a className="link" href={contact.airbnb}>Airbnb</a> : <span className="placeholder">[PLACEHOLDER: Airbnb link]</span>} ·{" "}
          {contact.vrbo ? <a className="link" href={contact.vrbo}>Vrbo</a> : <span className="placeholder">[PLACEHOLDER: Vrbo link]</span>}. Same home, their service fee on top.
        </p>
      </div>
    </section>
  );
}
