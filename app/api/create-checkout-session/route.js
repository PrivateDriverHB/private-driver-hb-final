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

export async function POST(request) {
  try {
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Clé secrète Stripe manquante (ENV)." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    });

    const body = await request.json();

    const {
      amount,
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
      lang, // 🔥 On récupère la langue
    } = body || {};

    // 🔥 Langue par défaut
    const currentLang = lang === "en" ? "en" : "fr";

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Montant de paiement invalide." },
        { status: 400 }
      );
    }

    if (!pickup || !dropoff) {
      return NextResponse.json(
        { error: "Adresse départ/arrivée manquante." },
        { status: 400 }
      );
    }

    const finalCurrency =
      typeof currency === "string" && currency.length === 3
        ? currency.toLowerCase()
        : isSwiss
        ? "chf"
        : "eur";

    const courseId = generateCourseId();
    const encodedCourseId = encodeURIComponent(courseId);

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    // --------------------------------------
    // 🔥 SUCCESS + CANCEL dynamiques en FR/EN
    // --------------------------------------
    const successUrl = `${origin}/${currentLang}/reservation/success?session_id={CHECKOUT_SESSION_ID}&cid=${encodedCourseId}`;
    const cancelUrl = `${origin}/${currentLang}/reservation/cancel?cid=${encodedCourseId}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: finalCurrency,
            unit_amount: Math.round(amount),
            product_data: {
              name: "Réservation trajet — Private Driver HB",
              description: buildDescription(pickup, dropoff, date, time),
            },
          },
        },
      ],

      success_url: successUrl,
      cancel_url: cancelUrl,

      metadata: {
        course_id: courseId,
        pickup: pickup || "",
        dropoff: dropoff || "",
        date: date || "",
        time: time || "",
        passengers: passengers ? String(passengers) : "",
        distance_km:
          distanceKm != null ? String(Number(distanceKm).toFixed(1)) : "",
        duration_text: durationText || "",
        is_swiss: isSwiss ? "true" : "false",
        currency: finalCurrency,
        amount_charged: String(amount),
        price_display: priceDisplay || "",
        lang: currentLang,
      },
    });

    return NextResponse.json({ url: session.url, courseId });
  } catch (err) {
    console.error("🔥 [create-checkout-session] ERROR :", err);
    return NextResponse.json(
      { error: "Erreur Stripe : " + err.message },
      { status: 500 }
    );
  }
}
