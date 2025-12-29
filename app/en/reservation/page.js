"use client";

import { useMemo, useState, useEffect } from "react";
import AutocompleteInput from "./AutocompleteInput";

function getCountryCodeFromPlace(place) {
  const comps = place?.address_components || [];
  const country = comps.find((c) => c.types?.includes("country"));
  return country?.short_name || null; // "CH" / "FR" / ...
}

// ✅ Base price / km (adjust as needed)
function computeBaseRate({ isSwiss }) {
  return isSwiss ? 3.2 : 2.6;
}

export default function ReservationPageEn() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // ✅ Audi A4 Avant = max 4 passengers
  const [passengers, setPassengers] = useState(1);

  // ✅ Luggage rules
  const [luggageType, setLuggageType] = useState("medium"); // "medium" | "large"
  const [luggageCount, setLuggageCount] = useState(1);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Lock only after user clicks validate
  const [locked, setLocked] = useState(false);

  // ✅ Force Google selection (place_id + country)
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

  // (optional) store full place objects
  const [pickupPlace, setPickupPlace] = useState(null);
  const [dropoffPlace, setDropoffPlace] = useState(null);

  // ✅ Dynamic luggage rules
  const luggageRule = useMemo(() => {
    let max = luggageType === "large" ? 3 : 4;

    // If 4 passengers, medium/cabin only
    if (passengers === 4) max = 4;

    // If 3 passengers + large => max 3
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
      return "Please select the pickup address from the Google list (not only type it).";
    }
    if (!dropoffMeta.selected || !dropoffMeta.placeId) {
      return "Please select the drop-off address from the Google list (not only type it).";
    }

    if (!date) return "Please select the transfer date.";
    if (!time) return "Please select the transfer time.";

    if (passengers < 1 || passengers > 4) {
      return "This vehicle accepts 1 to 4 passengers maximum.";
    }

    if (luggageCount < 0 || luggageCount > luggageRule.max) {
      return `Luggage: maximum ${luggageRule.max} for this configuration.`;
    }

    if (passengers === 4 && luggageType === "large") {
      return "With 4 passengers, please choose medium/cabin luggage (large suitcases won’t fit comfortably).";
    }

    return null;
  }

  function unlockAndReset() {
    setLocked(false);
    setError(null);
    setResult(null);
  }

  // ✅ 1) Fetch distance/duration (Google) only when route changes
  async function fetchDistanceAndDuration() {
    if (locked) return;

    if (!pickupMeta.selected || !pickupMeta.placeId) return;
    if (!dropoffMeta.selected || !dropoffMeta.placeId) return;
    if (!date || !time) return;

    if (!window.google?.maps?.DistanceMatrixService) {
      setError("Google Maps is not ready. Please reload the page.");
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
        throw new Error("Unable to calculate distance (invalid address).");
      }

      const distanceKm = el.distance?.value ? el.distance.value / 1000 : null;
      const durationText = el.duration?.text || null;

      if (!distanceKm || !Number.isFinite(distanceKm)) {
        throw new Error("Invalid distance.");
      }

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
      setError(err?.message || "Calculation error.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Auto-calc: only when pickup/dropoff changes (debounced)
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

  // ✅ 2) Recompute price locally when passengers/luggage changes (instant)
  useEffect(() => {
    if (!result?.distanceKm) return;

    const involvesCH = pickupMeta.country === "CH" || dropoffMeta.country === "CH";
    const base = computeBaseRate({ isSwiss: involvesCH });
    const price = Math.round(Number(result.distanceKm) * base);

    setResult((prev) => {
      if (!prev) return prev;
      if (prev.price === price && prev.isSwiss === involvesCH) return prev;
      return { ...prev, price, isSwiss: involvesCH };
    });
  }, [passengers, luggageType, luggageCount, pickupMeta.country, dropoffMeta.country, result?.distanceKm]);

  // ✅ Click => final validation + lock
  async function handleCalculate(e) {
    e.preventDefault();

    const msg = validateBeforeCalculate();
    if (msg) {
      setError(msg);
      return;
    }

    if (!result?.distanceKm || !result?.durationText) {
      await fetchDistanceAndDuration();
    }

    if (!result?.distanceKm) {
      setError("Please wait: distance is still being calculated.");
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
      alert("Price error. Please recalculate.");
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
          lang: "en",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Stripe error");
        return;
      }

      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Unable to connect to Stripe server.");
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
        Book your private transfer
      </h1>

      <p style={{ marginBottom: 24 }}>
        Clean auto-estimation (no heartbeat), final validation on click.
      </p>

      <div
        style={{
          display: "flex",
          gap: "32px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* FORM */}
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
              Edit trip
            </button>
          )}

          <div style={{ marginBottom: 12 }}>
            <label>Pickup address</label>
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
              placeholder="Type and select an address..."
            />
            {!locked && !pickupMeta.selected && pickup.length > 0 && (
              <p style={{ color: "#f5c451", fontSize: 12, marginTop: 6 }}>
                ⚠️ Select the address from the Google list to validate.
              </p>
            )}
            {locked && (
              <p style={{ color: "#aaa", fontSize: 12, marginTop: 6 }}>
                🔒 Address locked after validation.
              </p>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Drop-off address</label>
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
              placeholder="Type and select an address..."
            />
            {!locked && !dropoffMeta.selected && dropoff.length > 0 && (
              <p style={{ color: "#f5c451", fontSize: 12, marginTop: 6 }}>
                ⚠️ Select the address from the Google list to validate.
              </p>
            )}
            {locked && (
              <p style={{ color: "#aaa", fontSize: 12, marginTop: 6 }}>
                🔒 Address locked after validation.
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
            <label>Time</label>
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
            <label>Passengers (max 4)</label>
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
                  {n} passenger{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Luggage</label>

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
                <option value="medium">Medium / cabin</option>
                <option value="large" disabled={passengers === 4}>
                  Large suitcase (max 3)
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
              Rule: Audi A4 Avant — max 3 large suitcases, or max 4 medium/cabin luggage.
              {passengers === 4 && " With 4 passengers, medium/cabin only."}
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
            {loading ? "Calculating..." : locked ? "Price validated ✅" : "Validate & calculate price"}
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
            Estimated distance: <strong>{result ? distanceDisplay : "—"}</strong>
          </p>

          <p>
            Estimated duration: <strong>{result ? result.durationText : "—"}</strong>
          </p>

          <p>
            Switzerland involved:{" "}
            <strong>{result ? (result.isSwiss ? "Yes 🇨🇭" : "No 🇫🇷") : "—"}</strong>
          </p>

          <p>
            Passengers: <strong>{passengers}</strong>
          </p>

          <p>
            Luggage:{" "}
            <strong>
              {luggageCount} {luggageType === "large" ? "large" : "medium/cabin"}
            </strong>
          </p>

          <p>
            Estimated price: <strong>{result ? `${result.price} ${currency}` : "—"}</strong>
          </p>

          <p>
            Date: <strong>{date || "—"}</strong>
          </p>
          <p style={{ marginBottom: 16 }}>
            Time: <strong>{time || "—"}</strong>
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
            Pay & Confirm booking
          </button>

          <p style={{ fontSize: 12, marginTop: 10, color: "#aaa" }}>
            Final price may vary depending on tolls or special requests.
          </p>

          {locked && (
            <p style={{ fontSize: 12, marginTop: 10, color: "#aaa" }}>
              🔒 The form is locked after validation. Click <strong>“Edit trip”</strong> to change any
              information.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
