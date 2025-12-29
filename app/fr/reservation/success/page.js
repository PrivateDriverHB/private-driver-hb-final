"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPageFr() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const sentRef = useRef(false);

  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [amount, setAmount] = useState(null);
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const guardKey = `success_done_${sessionId}`;
    if (sentRef.current || sessionStorage.getItem(guardKey) === "1") return;

    const run = async () => {
      try {
        // 1) Récupère la session Stripe côté serveur
        const res = await fetch("/api/get-session-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Erreur get-session-info");

        const amountTotal = Number(data.amount_total); // cents
        const curr = String(data.currency || "eur").toUpperCase(); // "EUR" / "CHF"
        const value = Number.isFinite(amountTotal) ? amountTotal / 100 : 0;

        setAmount(value);
        setCurrency(curr);

        // 2) Envoi email automatique (client + chauffeur)
        const customerEmail = data.customer_email || null;
        if (customerEmail) {
          // anti-double côté client pour l’email
          const emailKey = `email_sent_${sessionId}`;
          if (sessionStorage.getItem(emailKey) !== "1") {
            await fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId, to: customerEmail }),
            });
            sessionStorage.setItem(emailKey, "1");
          }
        }

        // 3) Google Ads conversion (retry limité)
        const convKey = `ads_conv_sent_${sessionId}`;
        const sendConversion = () => {
          if (sessionStorage.getItem(convKey) === "1") return true;

          if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("event", "conversion", {
              send_to: "AW-17756859164/wRSFCKHTl8cbEJzWkJNC",
              value: Math.round(value * 100) / 100,
              currency: curr,
              transaction_id: sessionId,
            });
            sessionStorage.setItem(convKey, "1");
            return true;
          }
          return false;
        };

        if (!sendConversion()) {
          let tries = 0;
          const timer = setInterval(() => {
            tries += 1;
            if (sendConversion() || tries >= 8) clearInterval(timer);
          }, 500);
        }

        // fini
        sentRef.current = true;
        sessionStorage.setItem(guardKey, "1");
        setStatus("ok");
      } catch (e) {
        console.error("❌ SuccessPage error:", e);
        setStatus("error");
      }
    };

    run();
  }, [sessionId]);

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
        Paiement confirmé ✔️
      </h1>

      <p style={{ fontSize: "1.2rem", opacity: 0.85, marginBottom: "30px" }}>
        Merci ! Votre réservation a bien été enregistrée.
        <br />
        Un email de confirmation vous a été envoyé.
      </p>

      {status === "ok" && amount != null && currency && (
        <p style={{ fontSize: "0.95rem", opacity: 0.75 }}>
          Montant enregistré : {amount.toFixed(2)} {currency}
        </p>
      )}

      {status === "error" && (
        <p style={{ fontSize: "0.95rem", opacity: 0.85, color: "#fca5a5" }}>
          Une erreur est survenue (session ou email). Le paiement est peut-être validé côté Stripe.
        </p>
      )}

      <a
        href="/fr"
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
        Retour à l’accueil
      </a>
    </main>
  );
}
