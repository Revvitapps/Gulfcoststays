import Script from "next/script";

/**
 * GA4, production only. The layout decides whether to pass an ID (it can read
 * VERCEL_ENV; a client file cannot), so previews and local builds load nothing.
 */
export function GoogleAnalytics({ id }: { id?: string }) {
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
