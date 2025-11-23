export default function Head() {
  return (
    <>
      <title>Private Driver HB — Chauffeur privé Genève, Lyon & stations de ski</title>
      <meta
        name="description"
        content="Chauffeur privé premium entre Genève, Lyon et les stations de ski alpines. Transferts aéroport, trajets professionnels, et déplacements sur mesure dans une Audi Avant confortable et élégante."
      />
      <meta
        name="keywords"
        content="chauffeur privé Genève, transfert aéroport Lyon, transfert ski Chamonix, VTC Genève Megève, chauffeur privé Annecy, transfert Courchevel, Private Driver HB, Audi Avant, transfert aéroport Genève"
      />
      <meta
        property="og:title"
        content="Chauffeur privé Genève, Lyon & stations de ski — Private Driver HB"
      />
      <meta
        property="og:description"
        content="Transferts premium entre Genève, Lyon et les Alpes françaises. Chauffeur francophone & anglophone, service 24/7. Réservation simple et sécurisée en ligne."
      />
      <meta
        property="og:url"
        content="https://www.privatedriverhb.com/fr"
      />
      <meta property="og:site_name" content="Private Driver HB" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content="/images/private-driver-hb-geneve-lyon.jpg"
      />
      <link
        rel="alternate"
        hrefLang="fr"
        href="https://www.privatedriverhb.com/fr"
      />
      <link
        rel="alternate"
        hrefLang="en"
        href="https://www.privatedriverhb.com/en"
      />
      <link rel="canonical" href="https://www.privatedriverhb.com/fr" />

      {/* Balise JSON-LD pour Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TaxiService",
            name: "Private Driver HB",
            url: "https://www.privatedriverhb.com",
            description:
              "Service de chauffeur privé haut de gamme entre Genève, Lyon, Annecy et les stations de ski des Alpes.",
            areaServed: [
              "Genève",
              "Lyon",
              "Annecy",
              "Chamonix",
              "Megève",
              "Morzine",
              "Avoriaz",
              "Courchevel",
              "Les Gets",
              "La Clusaz"
            ],
            availableLanguage: ["fr", "en"],
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
