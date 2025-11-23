import "./globals.css";
import Navigation from "./Navigation";
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
        {/* ✅ Script Google Maps complet avec librairie 'places', langue FR et région FR */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=fr&region=FR`}
          strategy="beforeInteractive"
        />
      </head>

      <body>
        {/* Navigation principale */}
        <Navigation />

        {/* Contenu principal */}
        <main className="page-transition">{children}</main>

        {/* Footer */}
        <footer>
          © {new Date().getFullYear()} Private Driver HB — Chauffeur privé / VTC
        </footer>

        {/* Bouton WhatsApp */}
        <a
          href="https://wa.me/33766441270"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          💬
        </a>
      </body>
    </html>
  );
}
