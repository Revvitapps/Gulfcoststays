"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/site";

const links = [
  { href: "/island-retreat", label: "The home" },
  { href: "/rates", label: "Price" },
  { href: "/area", label: "Area" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="logo" aria-label={`${brand.name} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/gcs-badge.webp" alt="" width={44} height={44} />
          <span className="word">
            Gulf Coast
            <small>Stays</small>
          </span>
        </Link>
        <nav className="header-nav" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname.startsWith(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/book" className="button button-orange button-sm">
            Book direct
          </Link>
        </div>
      </div>
    </header>
  );
}
