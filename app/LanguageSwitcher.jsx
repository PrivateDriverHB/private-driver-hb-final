"use client";

import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();               // ex: /fr/contact
  const parts = pathname.split("/").filter(Boolean);

  const currentLang = parts[0] || "fr";         // fr ou en
  const rest = parts.slice(1).join("/");        // contact, reservation, etc.
  const suffix = rest ? `/${rest}` : "";

  return (
    <div className="lang-switch">
      <a
        href={`/fr${suffix}`}
        className={`lang ${currentLang === "fr" ? "active" : ""}`}
      >
        FR
      </a>

      <a
        href={`/en${suffix}`}
        className={`lang ${currentLang === "en" ? "active" : ""}`}
      >
        EN
      </a>
    </div>
  );
}
