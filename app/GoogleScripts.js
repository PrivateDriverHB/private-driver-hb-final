"use client";

import Script from "next/script";

export default function GoogleScripts() {
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <>
      {/* ✅ Google Ads Tag global */}
      <Script
        id="gtag-src"
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-17756859164"
        strategy="afterInteractive"
      />
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Google Ads
          gtag('config', 'AW-17756859164');

          console.log("🚀 gtag chargé depuis GoogleScripts");
        `}
      </Script>

      {/* ✅ Google Maps Places — charger UNE SEULE fois */}
      {googleApiKey ? (
        <Script
          id="google-maps-places"
          src={`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&loading=async`}
          strategy="afterInteractive"
          onLoad={() => {
            console.log("✅ Google Maps loaded (global)");
            window.dispatchEvent(new Event("google-maps-loaded"));
          }}
          onError={() => console.error("❌ Google Maps failed to load")}
        />
      ) : (
        <Script
          id="google-maps-missing"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `console.warn("❌ Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");`,
          }}
        />
      )}
    </>
  );
}
