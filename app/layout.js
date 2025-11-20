import "./globals.css";
import Navigation from "./Navigation";

export const metadata = {
  title: "Private Driver HB — Chauffeur privé / VTC",
  description:
    "Transferts aéroport, déplacements privés et ski. Genève, Lyon, Annecy et stations alpines.",
};

export default function RootLayout({ children }) {

  // Détection auto de la langue en fonction de l’URL
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0] === "en" ? "en" : "fr";

  return (
    <html lang={lang}>
      <head>
        {/* Google Maps */}
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
        ></script>
      </head>

      <body>
        <Navigation />

        <main className="page-transition">{children}</main>

        <footer>
          © {new Date().getFullYear()} Private Driver HB — Chauffeur privé / VTC
        </footer>

        <a
          href="https://wa.me/33766441270"
          target="_blank"
          className="whatsapp-btn"
        >
          💬
        </a>
      </body>
    </html>
  );
}
