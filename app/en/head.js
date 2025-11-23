export default function Head() {
  return (
    <>
      <title>
        Ski Transfers from Geneva & Lyon Airports | Private Driver HB — Premium Chauffeur Service
      </title>

      <meta
        name="description"
        content="Book your premium ski transfer from Geneva or Lyon airports to top French Alps resorts — Chamonix, Megève, Morzine, Avoriaz, Courchevel & more. English-speaking private driver 24/7."
      />

      <meta
        name="keywords"
        content="ski transfer Geneva airport, private driver Geneva, airport transfers Lyon ski, Chamonix transfer, Megève private taxi, Morzine airport transfer, Avoriaz chauffeur, Private Driver HB, Alps ski transfers"
      />

      <meta property="og:title" content="Ski Transfers from Geneva & Lyon Airports | Private Driver HB" />
      <meta
        property="og:description"
        content="English-speaking private driver for your ski holidays. Premium transfers from Geneva & Lyon airports to Chamonix, Megève, Morzine, Avoriaz, and more."
      />
      <meta property="og:url" content="https://www.privatedriverhb.com/en" />
      <meta property="og:site_name" content="Private Driver HB" />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/images/ski-transfer-geneva-lyon.jpg" />

      {/* Alternate language versions */}
      <link rel="alternate" hrefLang="en" href="https://www.privatedriverhb.com/en" />
      <link rel="alternate" hrefLang="fr" href="https://www.privatedriverhb.com/fr" />

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TaxiService",
            name: "Private Driver HB",
            url: "https://www.privatedriverhb.com",
            description:
              "Premium ski transfers from Geneva and Lyon airports to major French Alps resorts such as Chamonix, Megève, Morzine, Avoriaz, and Courchevel. English-speaking private driver available 24/7.",
            areaServed: [
              "Geneva Airport (GVA)",
              "Lyon Saint-Exupéry Airport",
              "Chamonix",
              "Megève",
              "Morzine",
              "Avoriaz",
              "Courchevel",
              "Les Gets",
              "Annecy"
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
    </>
  );
}
