import { NextResponse } from "next/server";

function normalizeForSearch(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function computeIsSwiss({ originCountry, destinationCountry, origin, destination }) {
  // ✅ Priority 1: country (reliable)
  if (originCountry === "CH" || destinationCountry === "CH") return true;

  // ✅ Fallback: text search (accents + variations)
  const o = normalizeForSearch(origin);
  const d = normalizeForSearch(destination);
  const combined = `${o} ${d}`;

  const swissKeywords = [
    "suisse",
    "switzerland",
    "geneve",
    "geneva",
    "aeroport geneve",
    "geneve aeroport",
    "geneva airport",
    "gva",
    "cointrin",
    "grand-saconnex",
    "le grand-saconnex",
    "meyrin",
    "vernier",
    "carouge",
    "lancy",
  ];

  return swissKeywords.some((kw) => combined.includes(kw));
}

function validateCapacity({ passengers, luggageType, luggageCount }) {
  const p = Number(passengers ?? 1);
  const lc = Number(luggageCount ?? 0);
  const lt = luggageType === "large" ? "large" : "medium";

  if (Number.isNaN(p) || p < 1) return "Nombre de passagers invalide.";
  if (p > 4) return "Capacité dépassée : maximum 4 passagers (Audi A4 Avant).";

  if (Number.isNaN(lc) || lc < 0) return "Nombre de bagages invalide.";

  // Audi A4 Avant : max 3 grands bagages OU max 4 moyens/cabine
  if (lt === "large") {
    if (p === 4)
      return "Avec 4 passagers, les grands bagages ne sont pas acceptés (choisir moyen/cabine).";
    if (lc > 3) return "Maximum 3 grands bagages (Audi A4 Avant).";
  } else {
    if (lc > 4) return "Maximum 4 bagages moyen/cabine (Audi A4 Avant).";
  }

  return null;
}

// ✅ helper : Distance Matrix accepts place_id:<ID>
function dmValue(value, placeId) {
  return placeId ? `place_id:${placeId}` : value;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      origin,
      destination,

      passengers,
      luggageType,
      luggageCount,
      originCountry,
      destinationCountry,

      originPlaceId,
      destinationPlaceId,
    } = body || {};

    if (!origin || !destination) {
      return NextResponse.json({ error: "Missing origin or destination" }, { status: 400 });
    }

    // ✅ server safety: passengers/luggage
    const capacityError = validateCapacity({ passengers, luggageType, luggageCount });
    if (capacityError) {
      return NextResponse.json({ error: capacityError }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // If no API key -> simulated response
    if (!apiKey) {
      console.warn("[calculate-route] Pas de GOOGLE_MAPS_API_KEY, retour simulé.");
      const isSwiss = computeIsSwiss({
        originCountry,
        destinationCountry,
        origin,
        destination,
      });

      const distanceKm = 40;
      const base = isSwiss ? 3.2 : 2.6;
      const price = Math.round(distanceKm * base);

      return NextResponse.json(
        {
          distanceKm,
          durationText: "40 min",
          price,
          isSwiss,
          simulated: true,
        },
        { status: 200 }
      );
    }

    // ✅ Prefer place_id if available
    const dmOrigins = dmValue(origin, originPlaceId);
    const dmDestinations = dmValue(destination, destinationPlaceId);

    const params = new URLSearchParams({
      origins: dmOrigins,
      destinations: dmDestinations,
      key: apiKey,
      mode: "driving",
      units: "metric",
    });

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`;

    const res = await fetch(url);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("[calculate-route] JSON parse error:", e, text);
      return NextResponse.json({ error: "Erreur API Google (réponse invalide)" }, { status: 500 });
    }

    if (!res.ok || data.error_message) {
      console.error("[calculate-route] Google API error:", res.status, data.error_message || text);
      return NextResponse.json(
        {
          error: "Erreur API Google",
          details: data.error_message || `HTTP ${res.status}`,
        },
        { status: 500 }
      );
    }

    const element = data.rows?.[0]?.elements?.[0];

    if (!element || element.status !== "OK" || !element.distance || !element.duration) {
      console.error("[calculate-route] Element invalide:", JSON.stringify(element));
      return NextResponse.json({ error: "Impossible de calculer le trajet." }, { status: 500 });
    }

    const distanceKm = element.distance.value / 1000;
    const durationText = element.duration.text;

    // ✅ Robust CH detection
    const isSwiss = computeIsSwiss({
      originCountry,
      destinationCountry,
      origin,
      destination,
    });

    // ✅ NEW PRICING (simple & clean)
    const base = isSwiss ? 3.2 : 2.6; // CHF/km vs EUR/km (à adapter)
    const price = Math.round(distanceKm * base);

    return NextResponse.json({
      distanceKm,
      durationText,
      price,
      isSwiss,

      // debug
      usedPlaceIds: !!(originPlaceId && destinationPlaceId),
    });
  } catch (error) {
    console.error("[calculate-route] Server error:", error);
    return NextResponse.json({ error: "Erreur serveur", details: error.message }, { status: 500 });
  }
}
