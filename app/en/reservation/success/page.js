"use client";

import { useEffect, useState } from "react";

let EMAIL_SENT_FLAG = false; // Prevent double-send (Strict Mode)

export default function SuccessPageEN({ searchParams }) {
  const sessionId = searchParams?.session_id || null;
  const cid = searchParams?.cid || null;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // 1️⃣ Fetch session info from Stripe
  useEffect(() => {
    if (!sessionId) return;

    async function load() {
      try {
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        const json = await res.json();

        if (!res.ok) {
          setError("Failed to retrieve Stripe information.");
          return;
        }

        setData(json);

        // 2️⃣ Send emails automatically
        sendEmails(json);
      } catch (e) {
        setError("Error fetching session.");
      }
    }

    load();
  }, [sessionId]);

  // 2️⃣ Automatic emails
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

  // 3️⃣ Loading screen
  if (!data)
    return (
      <main style={{ color: "#fff", textAlign: "center", padding: 40 }}>
        Loading information...
      </main>
    );

  // 4️⃣ Final EN success page
  return (
    <main
      style={{
        maxWidth: 700,
        margin: "60px auto",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>✅ Payment Confirmed</h1>

      <p>Your booking has been successfully validated.</p>

      <p style={{ marginTop: 16 }}>
        Booking Reference: <strong>{cid}</strong>
      </p>

      <hr style={{ margin: "20px 0", opacity: 0.3 }} />

      <p>
        <strong>Pickup:</strong> {data.metadata.pickup}
      </p>
      <p>
        <strong>Drop-off:</strong> {data.metadata.dropoff}
      </p>
      <p>
        <strong>Date:</strong> {data.metadata.date}
      </p>
      <p>
        <strong>Time:</strong> {data.metadata.time}
      </p>
      <p>
        <strong>Distance:</strong> {data.metadata.distance_km} km
      </p>
      <p>
        <strong>Estimated Duration:</strong> {data.metadata.duration_text}
      </p>

      <p style={{ marginTop: 16 }}>
        <strong>Amount Paid:</strong>{" "}
        {data.amount_total / 100} {data.currency.toUpperCase()}
      </p>

      <a
        href="/en"
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
        Back to Home
      </a>
    </main>
  );
}
