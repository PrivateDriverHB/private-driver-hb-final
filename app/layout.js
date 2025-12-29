import "./globals.css";
import Navigation from "./Navigation";
import GoogleScripts from "./GoogleScripts";
import Script from "next/script";

export const metadata = {
  title: "Private Driver HB — Chauffeur privé / VTC",
  description:
    "Transferts aéroport, déplacements privés et ski. Genève, Lyon, Annecy et stations alpines.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* ✅ Balises META Google (optionnel si tu veux ajouter la Search Console plus tard) */}
      </head>

      <body className="bg-black text-white">
        <Navigation />

        {/* ✅ Contenu principal */}
        {children}

        {/* ✅ Scripts globaux (Google Ads + Maps) exécutés partout */}
        <GoogleScripts />

        {/* ✅ Sécurité supplémentaire (tag direct dans le head) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17756859164"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17756859164');
            console.log("✅ Google Ads tag initialisé (gtag-init)");
          `}
        </Script>
      </body>
    </html>
  );
}
