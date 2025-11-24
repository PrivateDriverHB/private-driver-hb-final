"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0] === "en" ? "en" : "fr";

  function isActive(route) {
    return pathname === route || pathname.startsWith(route + "/");
  }

  return (
    <header>
      <div className="nav-inner">
        {/* Logo */}
        <div className="brand">PRIVATE DRIVER HB</div>

        {/* NAVIGATION DESKTOP */}
        <nav className="nav-links">
          <div className="lang-switch" style={{ display: "flex", gap: "8px" }}>
            <a
              href="/fr"
              style={{
                color: lang === "fr" ? "#f5c451" : "#fff",
                textDecoration: "none",
                fontWeight: lang === "fr" ? "700" : "400",
              }}
            >
              FR
            </a>
            <a
              href="/en"
              style={{
                color: lang === "en" ? "#f5c451" : "#fff",
                textDecoration: "none",
                fontWeight: lang === "en" ? "700" : "400",
              }}
            >
              EN
            </a>
          </div>

          <a href={`/${lang}`} className={isActive(`/${lang}`) ? "active" : ""}>
            {lang === "fr" ? "Accueil" : "Home"}
          </a>

          <a
            href={lang === "fr" ? "/fr/tarifs" : "/en/prices"}
            className={
              isActive("/fr/tarifs") || isActive("/en/prices") ? "active" : ""
            }
          >
            {lang === "fr" ? "Tarifs" : "Prices"}
          </a>

          <a
            href={`/${lang}/reservation`}
            className={isActive(`/${lang}/reservation`) ? "active" : ""}
          >
            {lang === "fr" ? "Réservation" : "Booking"}
          </a>

          <a
            href={`/${lang}/ski-transfers`}
            className={isActive(`/${lang}/ski-transfers`) ? "active" : ""}
          >
            Ski
          </a>

          <a
            href={`/${lang}/contact`}
            className={isActive(`/${lang}/contact`) ? "active" : ""}
          >
            Contact
          </a>
        </nav>

        {/* Téléphone desktop */}
        <div className="nav-phone">+33 7 66 44 12 70</div>

        {/* MENU MOBILE - Trois lignes dorées */}
        <button
          className={`nav-mobile-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MENU LATÉRAL MOBILE */}
      <div className={`mobile-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <button
            className="close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            ✕
          </button>

          {/* Sélecteur langue */}
          <div className="lang-switch-mobile">
            <a
              href="/fr"
              style={{
                color: lang === "fr" ? "#f5c451" : "#fff",
                textDecoration: "none",
              }}
            >
              FR
            </a>
            <a
              href="/en"
              style={{
                color: lang === "en" ? "#f5c451" : "#fff",
                textDecoration: "none",
              }}
            >
              EN
            </a>
          </div>

          <nav className="sidebar-links">
            <a
              href={`/${lang}`}
              className={isActive(`/${lang}`) ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {lang === "fr" ? "Accueil" : "Home"}
            </a>

            <a
              href={lang === "fr" ? "/fr/tarifs" : "/en/prices"}
              className={
                isActive("/fr/tarifs") || isActive("/en/prices")
                  ? "active"
                  : ""
              }
              onClick={() => setMenuOpen(false)}
            >
              {lang === "fr" ? "Tarifs" : "Prices"}
            </a>

            <a
              href={`/${lang}/reservation`}
              className={isActive(`/${lang}/reservation`) ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {lang === "fr" ? "Réservation" : "Booking"}
            </a>

            <a
              href={`/${lang}/ski-transfers`}
              className={isActive(`/${lang}/ski-transfers`) ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Ski
            </a>

            <a
              href={`/${lang}/contact`}
              className={isActive(`/${lang}/contact`) ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>
          </nav>

          <div className="sidebar-footer">
            <a href="tel:+33766441270" className="phone-link">
              📞 +33 7 66 44 12 70
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
