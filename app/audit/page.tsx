import Link from "next/link";
import { audit } from "@/lib/audit";

export const metadata = { title: "Launch audit", robots: { index: false, follow: false } };

export default function AuditPage() {
  return (
    <section className="section-tight">
      <div className="wrap prose">
        <p className="eyebrow">For the owner · {audit.date}</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4rem)" }}>Launch audit</h1>
        <p className="lede">{audit.intro}</p>

        <h2>What the platform-only path loses</h2>
        <ul>
          {audit.loses.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>

        <h2>Today vs. the new flow</h2>
        <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Step</th><th>Today</th><th>New flow</th><th><span className="skip">Try it</span></th></tr>
          </thead>
          <tbody>
            {audit.flows.map((f) => (
              <tr key={f.step}>
                <td><strong>{f.step}</strong></td>
                <td>{f.today}</td>
                <td>{f.now}</td>
                <td><Link href={f.href} className="button button-sm">Try it</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <h2>Phasing</h2>
        {audit.phases.map((p) => (
          <div key={p.name}>
            <h3>{p.name}</h3>
            <ul>
              {p.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}

        <h2>Decisions needed from you</h2>
        <ol>
          {audit.decisions.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
