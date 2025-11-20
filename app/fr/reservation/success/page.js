"use client";

import { useEffect, useState } from "react";

let EMAIL_SENT_FLAG = false; // Empêche double envoi (StrictMode)

export default function SuccessPageFR({ searchParams }) {
  const sessionId = searchParams?.session_id || null;
  const cid = searchParams?.cid || null;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // 1️⃣ Récupération session Stripe
  useEffect(() => {
    if (!sessionId) return;

    async function load() {
      try {
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        const json = await res.json();

        if (!res.ok) {
          setError("Impossible de récupérer les informations Stripe.");
          return;
        }

        setData(json);

        // 2️⃣ Envoi emails automatique
        sendEmails(json);
      } catch (e) {
        setError("Erreur lors de la récupération de la session.");
      }
    }

    load();
  }, [sessionId]);

  // 2️⃣ Email automatique
  async function sendEmails(json) {
    if (EMAIL_SENT_FLAG) return;
    EMAIL_SENT_FLAG = true;

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: json.customer_details.email,
        courseId: cid,
        pickup: json.metadata.pickup,
        dropoff: json.metadata.dropoff,
        date: json.metadata.date,
        time: json.metadata.time,
        passengers: json.metadata.passengers,
        distanceKm: json.metadata.distance_km,
        durationText: json.metadata.duration_text,
        isSwiss: json.metadata.is_swiss,
        price: `${json.amount_total / 100} ${json.currency.toUpperCase()}`,
      }),
    });
  }

  // 3️⃣ Loading
  if (!data)
    return (
      <main style={{ color: "#fff", textAlign: "center", padding: 40 }}>
        Chargement des informations...
      </main>
    );

  // 4️⃣ Page finale FR
  return (
    <main style={{ maxWidth: 700, margin: "60px auto", color: "#fff", textAlign: "center" }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>✅ Paiement confirmé</h1>

      <p>Merci pour votre confiance. Votre réservation est validée !</p>

      <p style={{ marginTop: 16 }}>
        Numéro de réservation : <strong>{cid}</strong>
      </p>

      <hr style={{ margin: "20px 0", opacity: 0.3 }} />

      <p><strong>Départ :</strong> {data.metadata.pickup}</p>
      <p><strong>Arrivée :</strong> {data.metadata.dropoff}</p>
      <p><strong>Date :</strong> {data.metadata.date}</p>
      <p><strong>Heure :</strong> {data.metadata.time}</p>
      <p><strong>Kilométrage :</strong> {data.metadata.distance_km} km</p>
      <p><strong>Durée :</strong> {data.metadata.duration_text}</p>

      <p style={{ marginTop: 16 }}>
        <strong>Prix payé :</strong> {data.amount_total / 100}{" "}
        {data.currency.toUpperCase()}
      </p>

      <a
        href="/fr"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          borderRadius: 999,
          background: "linear-gradient(90deg,#d4a019,#f5c451)",
          color: "#000",
          fontWeight: 600,
          textDecoration: "none",
          marginTop: 30,
        }}
      >
        Retour à l’accueil
      </a>
    </main>
  );
}
