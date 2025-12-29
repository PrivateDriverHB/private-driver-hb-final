"use client";

import { useMemo, useState, useEffect } from "react";
import AutocompleteInput from "./AutocompleteInput";

function getCountryCodeFromPlace(place) {
  const comps = place?.address_components || [];
  const country = comps.find((c) => c.types?.includes("country"));
  return country?.short_name || null; // "CH" / "FR" / ...
}

// ✅ Base prix / km (à ajuster)
function computeBaseRate({ isSwiss }) {
  return isSwiss ? 3.2 : 2.6;
}

export default function ReservationPageFr() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // ✅ Audi A4 Avant = max 4 passagers
  const [passengers, setPassengers] = useState(1);

  // ✅ Bagages
  const [luggageType, setLuggageType] = useState("medium"); // "medium" | "large"
  const [luggageCount, setLuggageCount] = useState(1);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Lock uniquement après clic
  const [locked, setLocked] = useState(false);

  // ✅ On force la sélection Google (place_id + country)
  const [pickupMeta, setPickupMeta] = useState({
    selected: false,
    placeId: null,
    country: null,
  });
  const [dropoffMeta, setDropoffMeta] = useState({
    selected: false,
    placeId: null,
    country: null,
  });

  // (optionnel) place complet
  const [pickupPlace, setPickupPlace] = useState(null);
  const [dropoffPlace, setDropoffPlace] = useState(null);

  // ✅ Règles bagages dynamiques
  const luggageRule = useMemo(() => {
    let max = luggageType === "large" ? 3 : 4;

    if (passengers === 4) max = 4;
    if (passengers === 3 && luggageType === "large") max = 3;

    return { max };
  }, [passengers, luggageType]);

  function clampLuggageCount(nextCount) {
    const n = Number(nextCount);
    if (Number.isNaN(n)) return 1;
    return Math.min(Math.max(n, 0), luggageRule.max);
  }

  function validateBeforeCalculate() {
    if (!pickupMeta.selected || !pickupMeta.placeId) {
      return "Merci de sélectionner l’adresse de départ dans la liste Google (pas seulement la taper).";
    }
    if (!dropoffMeta.selected || !dropoffMeta.placeId) {
      return "Merci de sélectionner l’adresse d’arrivée dans la liste Google (pas seulement la taper).";
    }

    if (!date) return "Merci d’indiquer la date du transfert.";
    if (!time) return "Merci d’indiquer l’heure du transfert.";

    if (passengers < 1 || passengers > 4) {
      return "Ce véhicule accepte 1 à 4 passagers maximum.";
    }

    if (luggageCount < 0 || luggageCount > luggageRule.max) {
      return `Bagages : maximum ${luggageRule.max} pour cette configuration.`;
    }

    if (passengers === 4 && luggageType === "large") {
      return "Avec 4 passagers, merci de choisir des bagages moyen/cabine.";
    }

    return null;
  }

  function unlockAndReset() {
    setLocked(false);
    setError(null);
    // on garde les champs, mais on peut vider le résultat si tu veux :
    setResult(null);
  }

  // ✅ 1) Calcul distance/durée (Google) — uniquement quand les places changent
  async function fetchDistanceAndDuration() {
    // Ne pas recalculer si lock (validation finale faite)
    if (locked) return;

    // Pré-requis
    if (!pickupMeta.selected || !pickupMeta.placeId) return;
    if (!dropoffMeta.selected || !dropoffMeta.placeId) return;
    if (!date || !time) return;

    if (!window.google?.maps?.DistanceMatrixService) {
      setError("Google Maps n’est pas prêt. Recharge la page.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const involvesCH = pickupMeta.country === "CH" || dropoffMeta.country === "CH";

      const service = new window.google.maps.DistanceMatrixService();

      const response = await new Promise((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [{ placeId: pickupMeta.placeId }],
            destinations: [{ placeId: dropoffMeta.placeId }],
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
          },
          (res, status) => {
            if (status !== "OK" || !res) reject(new Error(status || "DistanceMatrix error"));
            else resolve(res);
          }
        );
      });

      const el = response?.rows?.[0]?.elements?.[0];
      if (!el || el.status !== "OK") {
        throw new Error("Impossible de calculer la distance (adresse invalide).");
      }

      const distanceKm = el.distance?.value ? el.distance.value / 1000 : null;
      const durationText = el.duration?.text || null;

      if (!distanceKm || !Number.isFinite(distanceKm)) {
        throw new Error("Distance non valide.");
      }

      // On met à jour le résultat sans clignotement
      setResult((prev) => {
        const base = computeBaseRate({ isSwiss: involvesCH });
        const price = Math.round(distanceKm * base);

        return {
          ...(prev || {}),
          distanceKm,
          durationText,
          isSwiss: involvesCH,
          price,
        };
      });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Erreur de calcul.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Auto-calcul distance/durée uniquement quand adresses changent (debounce)
  useEffect(() => {
    if (locked) return;
    if (!pickupMeta.placeId || !dropoffMeta.placeId) return;
    if (!date || !time) return;

    const t = setTimeout(() => {
      fetchDistanceAndDuration();
    }, 500);

    return () => clearTimeout(t);
  }, [
    locked,
    pickupMeta.placeId,
    dropoffMeta.placeId,
    pickupMeta.country,
    dropoffMeta.country,
    date,
    time,
  ]);

  // ✅ 2) Recalcul prix local (sans Google) quand pax/bagages changent
  useEffect(() => {
    if (!result?.distanceKm) return;

    const involvesCH = pickupMeta.country === "CH" || dropoffMeta.country === "CH";
    const base = computeBaseRate({ isSwiss: involvesCH });
    const price = Math.round(Number(result.distanceKm) * base);

    setResult((prev) => {
      if (!prev) return prev;
      // évite setState inutile si identique
      if (prev.price === price && prev.isSwiss === involvesCH) return prev;
      return { ...prev, price, isSwiss: involvesCH };
    });
  }, [passengers, luggageType, luggageCount, pickupMeta.country, dropoffMeta.country, result?.distanceKm]);

  // ✅ Clic bouton => validation finale + lock
  async function handleCalculate(e) {
    e.preventDefault();

    const msg = validateBeforeCalculate();
    if (msg) {
      setError(msg);
      return;
    }

    // Assure qu'on a distance/durée (si l'auto-calc n'a pas encore fini)
    if (!result?.distanceKm || !result?.durationText) {
      await fetchDistanceAndDuration();
    }

    // Si toujours rien, on bloque
    if (!result?.distanceKm) {
      setError("Merci de patienter : la distance est en cours de calcul.");
      return;
    }

    setLocked(true);
  }

  async function handleCheckout() {
    if (!result) return;

    const msg = validateBeforeCalculate();
    if (msg) {
      alert(msg);
      return;
    }

    const priceNumber = Number(result?.price);
    if (!Number.isFinite(priceNumber)) {
      alert("Erreur de prix. Merci de recalculer.");
      return;
    }

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(priceNumber * 100),
          currency: result.isSwiss ? "chf" : "eur",

          pickup,
          dropoff,
          date,
          time,
          passengers,

          luggageType,
          luggageCount,

          distanceKm: result.distanceKm,
          durationText: result.durationText,
          isSwiss: result.isSwiss,

          pickupPlaceId: pickupMeta.placeId,
          dropoffPlaceId: dropoffMeta.placeId,
          pickupCountry: pickupMeta.country,
          dropoffCountry: dropoffMeta.country,

          priceDisplay: `${result.price} ${result.isSwiss ? "CHF" : "EUR"}`,
          lang: "fr",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erreur Stripe");
        return;
      }

      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Erreur de connexion au serveur Stripe.");
      console.error(err);
    }
  }

  const currency = result ? (result.isSwiss ? "CHF" : "€") : "€";
  const canPay = !!result && locked && !loading && !error && !validateBeforeCalculate();

  const distanceDisplay =
    result?.distanceKm != null && Number.isFinite(Number(result.distanceKm))
      ? `${Number(result.distanceKm).toFixed(1)} km`
      : "—";

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        padding: "0 16px",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: 8 }}>
        Réservez votre transfert privé
      </h1>

      <p style={{ marginBottom: 24 }}>
        Estimation automatique (sans “battement”), puis validation finale au clic.
      </p>

      <div
        style={{
          display: "flex",
          gap: "32px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* FORMULAIRE */}
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
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Détails du transfert</h2>

          {locked && (
            <button
              type="button"
              onClick={unlockAndReset}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid #333",
                background: "#000",
                color: "#fff",
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              Modifier le trajet
            </button>
          )}

          <div style={{ marginBottom: 12 }}>
            <label>Adresse de départ</label>
            <AutocompleteInput
              value={pickup}
              disabled={locked}
              onChange={(v) => {
                if (locked) return;
                setPickup(v);
                setPickupPlace(null);
                setPickupMeta((p) => ({ ...p, selected: false, placeId: null, country: null }));
              }}
              onSelect={(place) => {
                if (locked) return;
                const country = getCountryCodeFromPlace(place);
                setPickup(place?.formatted_address || pickup);
                setPickupPlace(place || null);
                setPickupMeta({
                  selected: true,
                  placeId: place?.place_id || null,
                  country,
                });
              }}
              placeholder="Tapez et sélectionnez une adresse..."
            />
            {!locked && !pickupMeta.selected && pickup.length > 0 && (
              <p style={{ color: "#f5c451", fontSize: 12, marginTop: 6 }}>
                ⚠️ Sélectionne l’adresse dans la liste Google pour valider.
              </p>
            )}
            {locked && (
              <p style={{ color: "#aaa", fontSize: 12, marginTop: 6 }}>
                🔒 Adresse verrouillée après validation.
              </p>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Adresse d’arrivée</label>
            <AutocompleteInput
              value={dropoff}
              disabled={locked}
              onChange={(v) => {
                if (locked) return;
                setDropoff(v);
                setDropoffPlace(null);
                setDropoffMeta((p) => ({ ...p, selected: false, placeId: null, country: null }));
              }}
              onSelect={(place) => {
                if (locked) return;
                const country = getCountryCodeFromPlace(place);
                setDropoff(place?.formatted_address || dropoff);
                setDropoffPlace(place || null);
                setDropoffMeta({
                  selected: true,
                  placeId: place?.place_id || null,
                  country,
                });
              }}
              placeholder="Tapez et sélectionnez une adresse..."
            />
            {!locked && !dropoffMeta.selected && dropoff.length > 0 && (
              <p style={{ color: "#f5c451", fontSize: 12, marginTop: 6 }}>
                ⚠️ Sélectionne l’adresse dans la liste Google pour valider.
              </p>
            )}
            {locked && (
              <p style={{ color: "#aaa", fontSize: 12, marginTop: 6 }}>
                🔒 Adresse verrouillée après validation.
              </p>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Date</label>
            <input
              type="date"
              value={date}
              disabled={locked}
              onChange={(e) => {
                if (locked) return;
                setDate(e.target.value);
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #333",
                backgroundColor: "#000",
                color: "#fff",
                opacity: locked ? 0.7 : 1,
                cursor: locked ? "not-allowed" : "text",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Heure</label>
            <input
              type="time"
              value={time}
              disabled={locked}
              onChange={(e) => {
                if (locked) return;
                setTime(e.target.value);
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #333",
                backgroundColor: "#000",
                color: "#fff",
                opacity: locked ? 0.7 : 1,
                cursor: locked ? "not-allowed" : "text",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Passagers (max 4)</label>
            <select
              value={passengers}
              disabled={locked}
              onChange={(e) => {
                if (locked) return;
                const next = Number(e.target.value);
                setPassengers(next);

                if (next === 4) setLuggageType("medium");
                setLuggageCount((c) => clampLuggageCount(c));
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #333",
                backgroundColor: "#000",
                color: "#fff",
                opacity: locked ? 0.7 : 1,
                cursor: locked ? "not-allowed" : "pointer",
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} passager{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Bagages</label>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              <select
                value={luggageType}
                disabled={locked}
                onChange={(e) => {
                  if (locked) return;
                  const nextType = e.target.value;
                  if (passengers === 4 && nextType === "large") return;
                  setLuggageType(nextType);
                  setLuggageCount((c) => clampLuggageCount(c));
                }}
                style={{
                  flex: "1 1 220px",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #333",
                  backgroundColor: "#000",
                  color: "#fff",
                  opacity: locked ? 0.7 : passengers === 4 ? 0.85 : 1,
                  cursor: locked ? "not-allowed" : "pointer",
                }}
              >
                <option value="medium">Cabine / moyen</option>
                <option value="large" disabled={passengers === 4}>
                  Grand bagage (max 3)
                </option>
              </select>

              <select
                value={luggageCount}
                disabled={locked}
                onChange={(e) => {
                  if (locked) return;
                  setLuggageCount(clampLuggageCount(e.target.value));
                }}
                style={{
                  width: 140,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #333",
                  backgroundColor: "#000",
                  color: "#fff",
                  opacity: locked ? 0.7 : 1,
                  cursor: locked ? "not-allowed" : "pointer",
                }}
              >
                {Array.from({ length: luggageRule.max + 1 }, (_, i) => i).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <p style={{ fontSize: 12, marginTop: 8, color: "#aaa" }}>
              Règle : Audi A4 Avant — max 3 grands bagages, ou max 4 bagages cabine/moyens.
              {passengers === 4 && " Avec 4 passagers, uniquement cabine/moyen."}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || locked}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 999,
              border: "none",
              cursor: loading || locked ? "not-allowed" : "pointer",
              fontWeight: 600,
              background: "linear-gradient(90deg, #d4a019, #f5c451)",
              color: "#000",
              opacity: loading || locked ? 0.65 : 1,
            }}
          >
            {loading ? "Calcul en cours..." : locked ? "Prix validé ✅" : "Valider & calculer le prix"}
          </button>

          {error && <p style={{ color: "#ff6b6b", marginTop: 12 }}>❌ {error}</p>}
        </form>

        {/* RÉSUMÉ */}
        <div
          style={{
            flex: "1 1 380px",
            backgroundColor: "#111",
            borderRadius: "12px",
            padding: "20px 24px",
            boxShadow: "0 0 25px rgba(0,0,0,0.5)",
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Résumé</h2>

          <p>
            Distance estimée : <strong>{result ? distanceDisplay : "—"}</strong>
          </p>

          <p>
            Durée estimée : <strong>{result ? result.durationText : "—"}</strong>
          </p>

          <p>
            Passage par la Suisse :{" "}
            <strong>{result ? (result.isSwiss ? "Oui 🇨🇭" : "Non 🇫🇷") : "—"}</strong>
          </p>

          <p>
            Passagers : <strong>{passengers}</strong>
          </p>

          <p>
            Bagages :{" "}
            <strong>
              {luggageCount}{" "}
              {luggageType === "large"
                ? luggageCount > 1
                  ? "grands bagages"
                  : "grand bagage"
                : "cabine/moyen"}
            </strong>
          </p>

          <p>
            Prix estimé : <strong>{result ? `${result.price} ${currency}` : "—"}</strong>
          </p>

          <p>
            Date : <strong>{date || "—"}</strong>
          </p>
          <p style={{ marginBottom: 16 }}>
            Heure : <strong>{time || "—"}</strong>
          </p>

          <button
            type="button"
            disabled={!canPay}
            onClick={handleCheckout}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 999,
              border: "none",
              cursor: canPay ? "pointer" : "not-allowed",
              fontWeight: 600,
              background: "linear-gradient(90deg, #d4a019, #f5c451)",
              color: "#000",
              opacity: canPay ? 1 : 0.5,
            }}
          >
            Payer & Confirmer la réservation
          </button>

          <p style={{ fontSize: 12, marginTop: 10, color: "#aaa" }}>
            Le prix final peut varier selon les péages ou demandes spéciales.
          </p>

          {locked && (
            <p style={{ fontSize: 12, marginTop: 10, color: "#aaa" }}>
              🔒 Le formulaire est verrouillé après validation. Cliquez sur{" "}
              <strong>“Modifier le trajet”</strong> pour changer une information.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
