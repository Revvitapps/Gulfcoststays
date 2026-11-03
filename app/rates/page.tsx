import Link from "next/link";
import { eventTable, LAUNCH_UNTIL, MARKET_NOTE, money, monthlyOffers, seasonTable } from "@/lib/rates";

export const metadata = {
  title: "Rates and seasons | Island Retreat, Fort Walton Beach",
  description: "Every nightly rate for Island Retreat on Okaloosa Island, by season and event, plus weekly, monthly and launch discounts. Cleaning fee $135. No login needed.",
};

const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function RatesPage() {
  const seasons = seasonTable();
  const events = eventTable();
  return (
    <>
      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">No login, no surprise fees</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}>Rates &amp; seasons</h1>
          <p className="lede">Nightly, before the $135 cleaning fee and lodging tax. Fri and Sat take the weekend rate. Weekly stays 10% off, monthly 25% off, and <strong>launch pricing takes 10% off every stay through {fmt(LAUNCH_UNTIL)}, 2027</strong>.</p>
          <div className="season-bar" aria-hidden style={{ marginTop: "1rem" }}>
            {seasons.map((s) => (
              <div key={s.month} className={`season-${s.season}`}>{s.month.slice(0, 3)}</div>
            ))}
          </div>
          <p className="small" style={{ marginTop: "0.5rem" }}>Seafoam low · sand shoulder · orange peak</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap grid grid-2">
          <div className="card">
            <h2 style={{ fontSize: "1.5rem" }}>By month</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Month</th><th>Season</th><th className="num">Sun–Thu</th><th className="num">Fri–Sat</th><th className="num">Min</th></tr>
                </thead>
                <tbody>
                  {seasons.map((s) => (
                    <tr key={s.month}>
                      <td>{s.month}</td>
                      <td>{s.season}</td>
                      <td className="num">{money(s.weekday)}</td>
                      <td className="num">{money(s.weekend)}</td>
                      <td className="num">{s.minNights}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid">
            <div className="card">
              <h2 style={{ fontSize: "1.5rem" }}>Holidays and events</h2>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr><th>Dates</th><th>Event</th><th className="num">Nightly</th><th className="num">Min</th></tr>
                  </thead>
                  <tbody>
                    {events.map((e) => (
                      <tr key={e.name + e.start}>
                        <td>{fmt(e.start)}{e.end !== e.start ? ` – ${fmt(e.end)}` : ""}</td>
                        <td>{e.name}{e.confirm ? <span className="placeholder" title="Confirm dates before publishing">*</span> : null}</td>
                        <td className="num">{e.weekday === e.weekend ? money(e.weekday) : `${money(e.weekday)}–${money(e.weekend)}`}</td>
                        <td className="num">{e.minNights}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="small">* festival dates to be confirmed.</p>
            </div>
            <div className="card card-dark" id="monthly">
              <h2 style={{ fontSize: "1.5rem" }}>Snowbird months</h2>
              {monthlyOffers.map((m) => (
                <div key={m.month} className="row between" style={{ padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                  <span>{m.month}</span>
                  <strong className="display" style={{ fontSize: "1.5rem" }}>{money(m.price)} / month</strong>
                </div>
              ))}
              <p className="small" style={{ marginTop: "0.6rem" }}>28-night minimum, one cleaning fee per stay. Ask early; these go first.</p>
              <Link href="/book?preset=month" className="button button-orange button-block">Ask about a month</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="card card-sea">
            <h2 style={{ fontSize: "1.5rem" }}>Why these numbers</h2>
            <p style={{ margin: 0 }}>{MARKET_NOTE}</p>
          </div>
          <div className="row" style={{ marginTop: "1.25rem" }}>
            <Link href="/book" className="button button-orange button-lg">Quote my dates</Link>
            <Link href="/island-retreat" className="button button-ghost">See the home</Link>
          </div>
        </div>
      </section>
    </>
  );
}
