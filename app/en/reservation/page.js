"use client";

import { useState } from "react";
import AutocompleteInput from "./AutocompleteInput";

export default function ReservationPageEn() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState(1);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleCheckout() {
    if (!result) return;

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(result.price * 100),
          currency: result.isSwiss ? "chf" : "eur",

          pickup,
          dropoff,
          date,
          time,
          passengers,

          distanceKm: result.distanceKm,
          durationText: result.durationText,
          isSwiss: result.isSwiss,

          priceDisplay: `${result.price} ${result.isSwiss ? "CHF" : "EUR"}`,

          // 🔥 LIGNE IMPORTANTE POUR AVOIR LE CANCEL EN ANGLAIS
          lang: "en",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Stripe error");
        return;
      }

      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Connection error with Stripe server.");
      console.error(error);
    }
  }

  async function handleCalculate(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/calculate-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: pickup,
          destination: dropoff,
          date,
          time,
          passengers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unexpected error.");
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Could not reach the server.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const currency = result ? (result.isSwiss ? "CHF" : "€") : "€";

  return (
    <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 16px", color: "#fff" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: 8 }}>
        Book your private transfer
      </h1>

      <p style={{ marginBottom: 24 }}>
        Instant calculation, pricing and automatic Swiss border detection.
      </p>

      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* LEFT FORM */}
        <form
          onSubmit={handleCalculate}
          style={{
            flex: "1 1 380px",
            backgroundColor: "#111",
            borderRadius: "12px",
            padding: "20px 24px",
            boxShadow: "0 0 25px rgba(0,0,0,0.5)",
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Transfer details</h2>

          <div style={{ marginBottom: 12 }}>
            <label>Pick-up address</label>
            <AutocompleteInput
              value={pickup}
              onChange={(v) => setPickup(v)}
              placeholder="Type an address..."
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Drop-off address</label>
            <AutocompleteInput
              value={dropoff}
              onChange={(v) => setDropoff(v)}
              placeholder="Type an address..."
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #333",
                backgroundColor: "#000",
                color: "#fff",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #333",
                backgroundColor: "#000",
                color: "#fff",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Passengers</label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #333",
                backgroundColor: "#000",
                color: "#fff",
              }}
            >
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} passenger{i + 1 > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              background: "linear-gradient(90deg, #d4a019, #f5c451)",
              color: "#000",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Calculating..." : "Calculate price"}
          </button>

          {error && <p style={{ color: "#ff6b6b", marginTop: 12 }}>❌ {error}</p>}
        </form>

        {/* SUMMARY */}
        <div
          style={{
            flex: "1 1 380px",
            backgroundColor: "#111",
            borderRadius: "12px",
            padding: "20px 24px",
            boxShadow: "0 0 25px rgba(0,0,0,0.5)",
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Summary</h2>

          <p>
            Distance:{" "}
            <strong>{result ? `${result.distanceKm.toFixed(1)} km` : "—"}</strong>
          </p>

          <p>
            Duration: <strong>{result ? result.durationText : "—"}</strong>
          </p>

          <p>
            Swiss border:{" "}
            <strong>{result ? (result.isSwiss ? "Yes 🇨🇭" : "No 🇫🇷") : "—"}</strong>
          </p>

          <p>
            Price:{" "}
            <strong>{result ? `${result.price} ${currency}` : "—"}</strong>
          </p>

          <p>Date: <strong>{date || "—"}</strong></p>
          <p style={{ marginBottom: 16 }}>Time: <strong>{time || "—"}</strong></p>

          <button
            type="button"
            disabled={!result}
            onClick={handleCheckout}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 999,
              border: "none",
              cursor: result ? "pointer" : "not-allowed",
              fontWeight: 600,
              background: "linear-gradient(90deg, #d4a019, #f5c451)",
              color: "#000",
              opacity: result ? 1 : 0.5,
            }}
          >
            Pay & Confirm Booking
          </button>

          <p style={{ fontSize: 12, marginTop: 10, color: "#aaa" }}>
            Final price may vary depending on tolls or special requests.
          </p>
        </div>
      </div>
    </main>
  );
}
