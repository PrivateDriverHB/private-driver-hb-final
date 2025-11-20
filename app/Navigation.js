"use client";

import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navigation() {
  const pathname = usePathname();

  // Détection langue
  const segments = pathname.split("/").filter(Boolean);
  const lang = segments[0] === "en" ? "en" : "fr";

  // Fonction active
  function isActive(route) {
    return pathname === route || pathname.startsWith(route + "/");
  }

  return (
    <header>
      <div className="nav-inner">
        <div className="brand">PRIVATE DRIVER HB</div>

        <nav className="nav-links">

          <LanguageSwitcher />

          {/* HOME */}
          <a href={`/${lang}`} className={isActive(`/${lang}`) ? "active" : ""}>
            {lang === "fr" ? "Accueil" : "Home"}
          </a>

          {/* TARIFS / PRICES */}
          <a
            href={lang === "fr" ? "/fr/tarifs" : "/en/prices"}
            className={
              isActive("/fr/tarifs") || isActive("/en/prices")
                ? "active"
                : ""
            }
          >
            {lang === "fr" ? "Tarifs" : "Prices"}
          </a>

          {/* RÉSERVATION */}
          <a
            href={`/${lang}/reservation`}
            className={isActive(`/${lang}/reservation`) ? "active" : ""}
          >
            {lang === "fr" ? "Réservation" : "Booking"}
          </a>

          {/* SKI */}
          <a
            href={`/${lang}/ski-transfers`}
            className={isActive(`/${lang}/ski-transfers`) ? "active" : ""}
          >
            Ski
          </a>

          {/* CONTACT */}
          <a
            href={`/${lang}/contact`}
            className={isActive(`/${lang}/contact`) ? "active" : ""}
          >
            Contact
          </a>
        </nav>

        <div className="nav-phone">+33 7 66 44 12 70</div>
      </div>
    </header>
  );
}
