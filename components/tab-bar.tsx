"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Compass, Home, MoreHorizontal, Waves } from "lucide-react";

/**
 * Bottom tab bar on every screen size. Booking is the revenue action, so it
 * is the raised centre orb.
 */
export function TabBar() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const tab = (href: string, label: string, icon: React.ReactNode) => (
    <Link href={href} className="tab" aria-current={active(href) ? "page" : undefined}>
      {icon}
      <span>{label}</span>
    </Link>
  );
  return (
    <nav className="tab-bar" aria-label="App navigation">
      {tab("/", "Home", <Home />)}
      {tab("/island-retreat", "The home", <Waves />)}
      <Link href="/book" className="tab tab-main" aria-current={active("/book") ? "page" : undefined}>
        <span className="tab-main-circle">
          <CalendarCheck />
        </span>
        <span>Book</span>
      </Link>
      {tab("/area", "Area", <Compass />)}
      {tab("/more", "More", <MoreHorizontal />)}
    </nav>
  );
}
