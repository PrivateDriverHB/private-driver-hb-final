"use client";

import { useEffect, useMemo } from "react";

function getSessionIdFromUrl() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("session_id");
}

function detectLang() {
  if (typeof window === "undefined") return "fr";

  // 1) si on a un param lang dans l’URL (optionnel)
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get("lang");
  if (langParam === "en" || langParam === "fr") return langParam;

  // 2) sinon, on essaie de détecter via l’URL (referrer ou pathname)
  const path = window.location.pathname || "";
  if (path.startsWith("/en")) return "en";
  if (path.startsWith("/fr")) return "fr";

  // 3) fallback navigateur
  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("en")) return "en";
  return "fr";
}

export default function SuccessPage() {
  const lang = useMemo(() => detectLang(), []);

  useEffect(() => {
    // ✅ Google Ads conversion (simple)
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17756859164/wRSFCKHTl8cbEJzWkJNC",
        value: 1.0,
        currency: "EUR",
      });
      console.log("✅ Google Ads conversion sent (1.0 EUR)");
    } else {
      console.warn("⚠️ gtag not yet loaded");
    }
  }, []);

  useEffect(() => {
    async function run() {
      const sessionId = getSessionIdFromUrl();
      if (!sessionId) {
        console.warn("⚠️ session_id manquant dans l’URL");
        return;
      }

      try {
        // 1) Récupère infos Stripe (email + metadata)
        const res = await fetch("/api/get-session-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("❌ get-session-info error:", data?.error || data);
          return;
        }

        const email = data?.customer_email;
        if (!email) {
          console.warn("⚠️ Email client introuvable dans la session Stripe");
          return;
        }

        // 2) Envoie email (prix côté Stripe dans ton backend send-email)
        const sendRes = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            sessionId,
            lang, // ✅ utile si tu veux que send-email fasse un template EN/FR
          }),
        });

        const sendData = await sendRes.json();
        if (!sendRes.ok) {
          console.error("❌ send-email error:", sendData?.error || sendData);
          return;
        }

        if (sendData?.duplicate) {
          console.log("ℹ️ Email déjà envoyé (anti-duplicate).");
        } else {
          console.log("✅ Email envoyé:", sendData);
        }
      } catch (e) {
        console.error("❌ Erreur réseau:", e);
      }
    }

    run();
  }, [lang]);

  const ui = lang === "en"
    ? {
        title: "Payment confirmed ✔️",
        text: "Thank you! Your booking has been recorded.\nA confirmation email has been sent.",
        back: "Back to home",
        href: "/en",
      }
    : {
        title: "Paiement confirmé ✔️",
        text: "Merci ! Votre réservation a bien été enregistrée.\nUn email de confirmation vous a été envoyé.",
        back: "Retour à l’accueil",
        href: "/fr",
      };

  return (
    <main
      style={{
        padding: "80px 20px",
        textAlign: "center",
        color: "#fff",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2.6rem", marginBottom: "20px", color: "#facc15" }}>
        {ui.title}
      </h1>

      <p style={{ fontSize: "1.2rem", opacity: 0.85, marginBottom: "30px", whiteSpace: "pre-line" }}>
        {ui.text}
      </p>

      <a
        href={ui.href}
        style={{
          display: "inline-block",
          padding: "12px 28px",
          background: "#facc15",
          color: "#000",
          borderRadius: "8px",
          fontWeight: "600",
          textDecoration: "none",
          fontSize: "1.1rem",
          marginTop: "20px",
        }}
      >
        {ui.back}
      </a>
    </main>
  );
}
