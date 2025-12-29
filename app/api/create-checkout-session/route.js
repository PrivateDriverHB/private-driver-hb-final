// app/api/create-checkout-session/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

/**
 * Génère un numéro de course unique
 */
function generateCourseId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900) + 100;
  return `HB-${y}-${m}-${d}-${hh}${mm}-${rand}`;
}

function buildDescription(pickup, dropoff, date, time) {
  const parts = [];
  if (pickup && dropoff) parts.push(`${pickup} → ${dropoff}`);
  if (date) parts.push(`le ${date}`);
  if (time) parts.push(`à ${time}`);
  return parts.length ? parts.join(" ") : "Réservation Private Driver HB";
}

function validateCapacity({ passengers, luggageType, luggageCount }) {
  const p = Number(passengers ?? 1);
  const lc = Number(luggageCount ?? 0);
  const lt = luggageType === "large" ? "large" : "medium";

  if (Number.isNaN(p) || p < 1) return "Nombre de passagers invalide.";
  if (p > 4) return "Capacité dépassée : maximum 4 passagers (Audi A4 Avant).";

  if (Number.isNaN(lc) || lc < 0) return "Nombre de bagages invalide.";

  if (lt === "large") {
    if (p === 4)
      return "Avec 4 passagers, grands bagages non acceptés (choisir moyen/cabine).";
    if (lc > 3) return "Maximum 3 grands bagages (Audi A4 Avant).";
  } else {
    if (lc > 4) return "Maximum 4 bagages moyen/cabine (Audi A4 Avant).";
  }

  return null;
}

/**
 * Origin robuste (localhost + Vercel + reverse proxy)
 */
function getOrigin(request) {
  const originHeader = request.headers.get("origin");
  if (originHeader) return originHeader;

  const proto = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (host) return `${proto}://${host}`;

  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function POST(request) {
  try {
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Clé secrète Stripe manquante (ENV)." },
        { status: 500 }
      );
    }

    // 🔒 SÉCURITÉ : interdire LIVE sur localhost
    const originHeader = request.headers.get("origin") || "";
    if (stripeSecretKey.startsWith("sk_live_") && originHeader.includes("localhost")) {
      return NextResponse.json(
        {
          error:
            "Sécurité: clé Stripe LIVE détectée sur localhost. Pour tester, utilise une clé sk_test_.",
        },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

    const body = await request.json();
    const {
      amount, // attendu en CENTIMES
      currency,
      pickup,
      dropoff,
      date,
      time,
      passengers,
      distanceKm,
      durationText,
      isSwiss,
      priceDisplay,
      lang,

      luggageType,
      luggageCount,
      pickupPlaceId,
      dropoffPlaceId,
      pickupCountry,
      dropoffCountry,

      // optionnel si tu l’as côté front :
      customerEmail,
    } = body || {};

    const currentLang = lang === "en" ? "en" : "fr";

    // ✅ Montant : en centimes, entier
    const amountInt = Number(amount);
    if (!Number.isFinite(amountInt) || amountInt < 50) {
      // 50 centimes min (évite les 0, 1, etc.)
      return NextResponse.json(
        { error: "Montant de paiement invalide (centimes)." },
        { status: 400 }
      );
    }

    if (!pickup || !dropoff) {
      return NextResponse.json(
        { error: "Adresse départ ou arrivée manquante." },
        { status: 400 }
      );
    }

    // 🔐 Obliger sélection Google (place_id)
    if (!pickupPlaceId || !dropoffPlaceId) {
      return NextResponse.json(
        {
          error:
            "Merci de sélectionner les adresses dans la liste Google (pas seulement les taper).",
        },
        { status: 400 }
      );
    }

    const capacityError = validateCapacity({ passengers, luggageType, luggageCount });
    if (capacityError) return NextResponse.json({ error: capacityError }, { status: 400 });

    const finalCurrency =
      typeof currency === "string" && currency.length === 3
        ? currency.toLowerCase()
        : isSwiss
        ? "chf"
        : "eur";

    const courseId = generateCourseId();
    const encodedCourseId = encodeURIComponent(courseId);

    const origin = getOrigin(request);

    const successUrl = `${origin}/${currentLang}/reservation/success?session_id={CHECKOUT_SESSION_ID}&cid=${encodedCourseId}`;
    const cancelUrl = `${origin}/${currentLang}/reservation/cancel?cid=${encodedCourseId}`;

    // ✅ Metadata (évite null/undefined)
    const metadata = {
      course_id: courseId,
      pickup: String(pickup || ""),
      dropoff: String(dropoff || ""),
      pickup_place_id: String(pickupPlaceId || ""),
      dropoff_place_id: String(dropoffPlaceId || ""),
      pickup_country: String(pickupCountry || ""),
      dropoff_country: String(dropoffCountry || ""),
      date: String(date || ""),
      time: String(time || ""),
      passengers: String(passengers ?? ""),
      luggage_type: String(luggageType || ""),
      luggage_count: String(luggageCount ?? ""),
      distance_km: distanceKm != null ? String(Number(distanceKm).toFixed(1)) : "",
      duration_text: String(durationText || ""),
      is_swiss: isSwiss ? "true" : "false",
      currency: String(finalCurrency),
      amount_charged: String(amountInt),
      price_display: String(priceDisplay || ""),
      lang: String(currentLang),
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      // ✅ super pratique pour retrouver la réservation
      client_reference_id: courseId,

      // ✅ utile si tu as l’email au moment du paiement (sinon Stripe le demandera)
      ...(customerEmail ? { customer_email: customerEmail } : {}),

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: finalCurrency,
            unit_amount: Math.round(amountInt), // centimes
            product_data: {
              name:
                currentLang === "en"
                  ? "Transfer booking — Private Driver HB"
                  : "Réservation trajet — Private Driver HB",
              description: buildDescription(pickup, dropoff, date, time),
            },
          },
        },
      ],

      success_url: successUrl,
      cancel_url: cancelUrl,

      // ✅ locale Stripe
      locale: currentLang,

      // ✅ metadata sur la session + sur le payment_intent (important pour webhook)
      metadata,
      payment_intent_data: { metadata },
    });

    return NextResponse.json({
      url: session.url,
      courseId,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("🔥 [create-checkout-session] ERROR :", err);
    return NextResponse.json(
      { error: "Erreur Stripe : " + (err?.message || "inconnue") },
      { status: 500 }
    );
  }
}
