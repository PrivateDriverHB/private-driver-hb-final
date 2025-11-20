"use client";

import { useState } from "react";

export default function ReservationPage() {
  const [form, setForm] = useState({
    pickup: "",
    dropoff: "",
    distanceKm: "",
    isSwiss: false,
  });

  const [price, setPrice] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleCalculate(e) {
    e.preventDefault();

    const distance = parseFloat(form.distanceKm.replace(",", "."));
    if (Number.isNaN(distance) || distance <= 0) {
      alert("Merci d'indiquer une distance en kilomètres (nombre positif).");
      return;
    }

    // ⚠️ Simple logique de calcul provisoire (on branchera Google Matrix après)
    let perKm;
    let minimum;

    if (form.isSwiss) {
      minimum = 50; // CHF
      if (distance <= 50) perKm = 3.5;
      else perKm = 4.0;
    } else {
      minimum = 50; // €
      if (distance <= 50) perKm = 2.0;
      else perKm = 2.5;
    }

    let total = distance * perKm;
    if (total < minimum) total = minimum;

    setPrice({
      distance,
      perKm,
      total,
      currency: form.isSwiss ? "CHF" : "€",
    });
  }

  return (
    <main style={{ maxWidth: "900px", margin: "40px auto", padding: "0 16px" }}>
      <h1>Réserver une course</h1>
      <p>
        Indiquez vos informations principales. Le calcul automatique par Google
        Maps et le paiement Stripe seront ajoutés à cette page.
      </p>

      <form onSubmit={handleCalculate} style={{ marginTop: "16px" }}>
        <div style={{ marginBottom: "8px" }}>
          <label>
            Adresse de départ
            <br />
            <input
              type="text"
              name="pickup"
              value={form.pickup}
              onChange={handleChange}
              style={{ width: "100%" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Adresse d&apos;arrivée
            <br />
            <input
              type="text"
              name="dropoff"
              value={form.dropoff}
              onChange={handleChange}
              style={{ width: "100%" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Distance estimée (km) – provisoire
            <br />
            <input
              type="text"
              name="distanceKm"
              value={form.distanceKm}
              onChange={handleChange}
              placeholder="ex : 35"
              style={{ width: "200px" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            <input
              type="checkbox"
              name="isSwiss"
              checked={form.isSwiss}
              onChange={handleChange}
            />{" "}
            Course avec départ ou arrivée en Suisse
          </label>
        </div>

        <button type="submit">Calculer le prix</button>
      </form>

      {price && (
        <div style={{ marginTop: "24px", padding: "12px", border: "1px solid #ccc" }}>
          <h2>Estimation</h2>
          <p>
            Distance : <strong>{price.distance.toFixed(1)} km</strong>
          </p>
          <p>
            Tarif au km : <strong>{price.perKm.toFixed(2)} {price.currency}/km</strong>
          </p>
          <p>
            Prix estimé :{" "}
            <strong>
              {price.total.toFixed(2)} {price.currency}
            </strong>
          </p>
          <p style={{ marginTop: "8px" }}>
            Cette estimation est indicative. Le calcul automatique via Google
            Maps et le paiement en ligne seront bientôt disponibles.
          </p>
        </div>
      )}
    </main>
  );
}
