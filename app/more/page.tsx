import Link from "next/link";
import { ClipboardList, Download, Info, Mail, MessageCircleQuestion } from "lucide-react";
import { contact } from "@/lib/site";

export const metadata = { title: "More", robots: { index: false, follow: false } };

const items = [
  { href: "/about", icon: Info, title: "About Gulf Coast Stays", detail: "Who we are, what's next" },
  { href: "/contact", icon: Mail, title: "Contact", detail: contact.email },
  { href: "#ask", icon: MessageCircleQuestion, title: "Ask a question", detail: "Quick answers, a human for the rest" },
  { href: "/audit", icon: ClipboardList, title: "Launch audit", detail: "For the owner: what this prototype changes" },
];

export default function MorePage() {
  return (
    <section className="section-tight">
      <div className="wrap">
        <p className="eyebrow">More</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4rem)" }}>Everything else</h1>
        <div className="grid grid-2" style={{ marginTop: "1rem" }}>
          {items.map(({ href, icon: Icon, title, detail }) => (
            <Link key={title} href={href} className="tile">
              <Icon size={24} aria-hidden />
              <strong>{title}</strong>
              <span className="small">{detail}</span>
            </Link>
          ))}
          <div className="tile" style={{ transform: "none" }}>
            <Download size={24} aria-hidden />
            <strong>Install the app</strong>
            <span className="small">On iPhone: Share, then Add to Home Screen. On Android and desktop Chrome: the Install button in the address bar.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
