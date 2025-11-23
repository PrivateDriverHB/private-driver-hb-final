export default function Head() {
  return (
    <>
      <title>
        Geneva & Lyon Ski Transfers — Private Chauffeur Audi Avant | Private Driver HB
      </title>

      <meta
        name="description"
        content="Premium private transfers from Geneva & Lyon airports to top ski resorts — Avoriaz, Morzine, Megève, Chamonix, La Clusaz. Perfect for 1–4 passengers in our Audi Avant."
      />

      <meta
        name="keywords"
        content="ski transfer Geneva airport, private driver Geneva ski, Lyon airport ski transfer, private transfer Chamonix, chauffeur Megève, Private Driver HB, Audi Avant, Alps transfers"
      />

      <meta property="og:title" content="Ski Transfers from Geneva & Lyon | Private Driver HB" />
      <meta
        property="og:description"
        content="Book your private ski transfer from Geneva or Lyon airports to the Alps. Premium service, Audi Avant sedan for 1–4 passengers — Chamonix, Megève, Avoriaz, Morzine, Les Gets."
      />
      <meta property="og:url" content="https://www.privatedriverhb.com/en/ski-transfers" />
      <meta property="og:site_name" content="Private Driver HB" />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/images/ski-transfer-geneva-lyon.jpg" />

      {/* Alternate language links */}
      <link rel="alternate" hrefLang="en" href="https://www.privatedriverhb.com/en/ski-transfers" />
      <link rel="alternate" hrefLang="fr" href="https://www.privatedriverhb.com/fr/transferts-ski" />

      {/* Main TaxiService structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TaxiService",
            name: "Private Driver HB",
            url: "https://www.privatedriverhb.com/en/ski-transfers",
            description:
              "Premium private chauffeur service for ski transfers from Geneva and Lyon airports to the French Alps — Chamonix, Megève, Avoriaz, Morzine, Les Gets, La Clusaz. Audi Avant sedan for 1–4 passengers.",
            areaServed: [
              "Geneva Airport",
              "Lyon Airport",
              "Chamonix",
              "Megève",
              "Morzine",
              "Avoriaz",
              "Les Gets",
              "La Clusaz"
            ],
            availableLanguage: ["en", "fr"],
            telephone: "+33 7 66 44 12 70",
            sameAs: [
              "https://www.instagram.com/privatedriverhb",
              "https://www.facebook.com/privatedriverhb"
            ],
          }),
        }}
      />

      {/* Additional LocalBusiness structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Private Driver HB",
            image: "https://www.privatedriverhb.com/images/ski-transfer-geneva-lyon.jpg",
            url: "https://www.privatedriverhb.com",
            telephone: "+33 7 66 44 12 70",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Geneva Airport",
              addressLocality: "Genève",
              addressRegion: "GE",
              postalCode: "1215",
              addressCountry: "CH",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 46.2381,
              longitude: 6.1089,
            },
            priceRange: "$$",
            openingHours: "Mo-Su 00:00-23:59",
            servesCuisine: "Transport Service",
            sameAs: [
              "https://www.instagram.com/privatedriverhb",
              "https://www.facebook.com/privatedriverhb",
            ],
          }),
        }}
      />
    </>
  );
}
