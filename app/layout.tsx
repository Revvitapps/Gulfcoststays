import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Kaushan_Script } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TabBar } from "@/components/tab-bar";
import { Pwa } from "@/components/pwa";
import { InstallPrompt } from "@/components/install-prompt";
import { Ask } from "@/components/ask";
import { JsonLd } from "@/components/json-ld";
import { brand } from "@/lib/site";
import { indexable, organizationJsonLd, siteUrl } from "@/lib/seo";

// Brand guide v3: Bebas Neue for headlines and labels, Kaushan Script for the
// orange accent word, Inter for body copy. All self-hosted at build.
const display = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const script = Kaushan_Script({ weight: "400", subsets: ["latin"], variable: "--font-script", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

// Until launch, share links resolve on the deployment itself.
const previewHost = !indexable && process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(previewHost ? `https://${previewHost}` : siteUrl),
  alternates: { canonical: "./" },
  title: { default: `${brand.name} | Island Retreat, Fort Walton Beach Condo on Okaloosa Island`, template: `%s | ${brand.name}` },
  description: brand.description,
  applicationName: brand.name,
  openGraph: { type: "website", siteName: brand.name, url: siteUrl, images: ["/pwa/og-default.png"] },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: brand.name, statusBarStyle: "black-translucent" },
  other: { "apple-mobile-web-app-capable": "yes" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/pwa/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/pwa/apple-touch-icon.png",
  },
  formatDetection: { telephone: true },
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0f1e2e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${script.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Pwa />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <InstallPrompt />
        <Ask />
        <TabBar />
        <JsonLd data={organizationJsonLd()} />
        <Analytics />
      </body>
    </html>
  );
}
