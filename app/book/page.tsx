import { BookForm } from "./book-form";
import { contact } from "@/lib/site";
import { DirectBenefits } from "@/components/direct";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/book");

export default async function BookPage({ searchParams }: { searchParams: Promise<{ preset?: string; in?: string; out?: string }> }) {
  const { preset, in: checkIn, out: checkOut } = await searchParams;
  return (
    <>
    <JsonLd data={breadcrumbJsonLd("/book")} />
    <section className="section-tight">
      <div className="wrap">
        <p className="eyebrow">Direct booking</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Check your dates</h1>
        <p className="lede">The price you see is the price, before lodging tax. Send the request and we confirm by email, usually within the hour.</p>
        <BookForm preset={preset ?? null} checkIn={checkIn} checkOut={checkOut} />
        {contact.airbnb || contact.vrbo ? (
          <p className="small" style={{ marginTop: "1.5rem" }}>
            Prefer a platform? {contact.airbnb ? <a className="link" href={contact.airbnb}>Airbnb</a> : null}{contact.airbnb && contact.vrbo ? " · " : ""}
            {contact.vrbo ? <a className="link" href={contact.vrbo}>Vrbo</a> : null}. Same home, their service fee on top.
          </p>
        ) : null}
      </div>
    </section>
    <DirectBenefits cta={false} />
    </>
  );
}
