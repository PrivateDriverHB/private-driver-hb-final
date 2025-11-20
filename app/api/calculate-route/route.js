import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { origin, destination } = body || {};

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Missing origin or destination" },
        { status: 400 }
      );
    }

    // ✅ Clé serveur uniquement (Distance Matrix)
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // Mode dégradé si pas de clé (dev hors ligne)
    if (!apiKey) {
      console.warn("[calculate-route] Pas de GOOGLE_MAPS_API_KEY, retour simulé.");
      return NextResponse.json(
        {
          distanceKm: 40,
          durationText: "40 min",
          price: 120,
          isSwiss: false,
          simulated: true,
        },
        { status: 200 }
      );
    }

    const params = new URLSearchParams({
      origins: origin,
      destinations: destination,
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
      return NextResponse.json(
        { error: "Erreur API Google (réponse invalide)" },
        { status: 500 }
      );
    }

    // 🔍 Si Google renvoie une erreur explicite
    if (!res.ok || data.error_message) {
      console.error(
        "[calculate-route] Google API error:",
        res.status,
        data.error_message || text
      );
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
      return NextResponse.json(
        { error: "Impossible de calculer le trajet." },
        { status: 500 }
      );
    }

    const distanceKm = element.distance.value / 1000;
    const durationText = element.duration.text;

    // Détection automatique Suisse
    const lowerOrigin = origin.toLowerCase();
    const lowerDestination = destination.toLowerCase();

    const isSwiss =
      lowerOrigin.includes("suisse") ||
      lowerDestination.includes("suisse") ||
      lowerOrigin.includes("genève") ||
      lowerDestination.includes("genève") ||
      lowerOrigin.includes("geneva") ||
      lowerDestination.includes("geneva");

    // Calcul tarif
    let price = 0;

    if (isSwiss) {
      const rateShort = 3.5; // CHF/km <= 50 km
      const rateLong = 4.0; // CHF/km > 50 km
      const minimum = 50; // minimum en CHF

      if (distanceKm <= 50) {
        price = distanceKm * rateShort;
      } else {
        price = 50 * rateShort + (distanceKm - 50) * rateLong;
      }

      if (price < minimum) price = minimum;
    } else {
      const rate = distanceKm <= 50 ? 2.0 : 2.5; // €/km
      const minimum = 25; // minimum en €

      price = distanceKm * rate;
      if (price < minimum) price = minimum;
    }

    return NextResponse.json({
      distanceKm,
      durationText,
      price: Math.round(price * 100) / 100,
      isSwiss,
    });
  } catch (error) {
    console.error("[calculate-route] Server error:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
