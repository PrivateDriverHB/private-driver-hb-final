"use client";

import { useEffect, useState } from "react";

export default function TestConversionPage() {
  const [status, setStatus] = useState("Aucune conversion envoyée");

  useEffect(() => {
    // Charger Google Ads Tag côté client
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=AW-17756859164";
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-17756859164');
    `;
    document.head.appendChild(script2);
  }, []);

  const envoyerConversion = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17756859164/wRSFCKHt18cEbEZJwkJNC",
        value: 1.0,
        currency: "EUR",
      });
      console.log("✅ Conversion envoyée à Google Ads !");
      setStatus("✅ Conversion envoyée avec succès !");
    } else {
      console.warn("⚠️ gtag non encore disponible !");
      setStatus("⚠️ Google Tag non encore chargé. Réessaie dans 2-3 secondes.");
    }
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        background: "#000",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h1>Test Google Ads Conversion</h1>
      <p>
        Cette page sert à tester l’envoi d’une conversion Google Ads sans
        toucher au site principal.
      </p>
      <button
        onClick={envoyerConversion}
        style={{
          background: "#d4a019",
          color: "#000",
          padding: "12px 20px",
          borderRadius: "999px",
          border: "none",
          marginTop: "20px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Envoyer une conversion test
      </button>

      <p style={{ marginTop: "20px" }}>{status}</p>
    </main>
  );
}
