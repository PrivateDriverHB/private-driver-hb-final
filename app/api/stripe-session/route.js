import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------------------------------------------------------
// 🔵 1️⃣  Récupérer une session Stripe (utilisé par /fr/success et /en/success)
// ---------------------------------------------------------
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // 🧪 Simulation locale (pour test sans paiement réel)
    if (session_id === "test123") {
      console.log("⚙️ Simulation Stripe activée (session_id=test123)");
      return NextResponse.json({
        id: "cs_test_simulated_123",
        amount_total: 15000, // 150.00 EUR simulé
        currency: "eur",
        customer_details: {
          email: "client.test@example.com",
        },
        metadata: {
          pickup: "Genève Aéroport",
          dropoff: "Megève Centre",
          date: "2025-12-01",
          time: "10:00",
          passengers: "2",
          distance_km: "70",
          duration_text: "1h20",
          is_swiss: false,
        },
      });
    }

    // 🧾 Mode réel Stripe (pour vraies sessions)
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent", "line_items"],
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("❌ Stripe session error:", error);
    return NextResponse.json(
      { error: "Stripe session fetch failed.", details: error.message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------
// 🟢 2️⃣  CRÉATION SESSION STRIPE (checkout)
// ---------------------------------------------------------
export async function POST(request) {
  try {
    const {
      origin,
      destination,
      date,
      time,
      passengers,
      price,
      distanceKm,
      durationText,
      lang,
    } = await request.json();

    const currentLang = lang === "en" ? "en" : "fr";
    const amount = Math.round(price * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/${currentLang}/reservation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/${currentLang}/reservation/cancel`,
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Trajet ${origin} → ${destination}`,
              description: `Distance: ${distanceKm} km · Durée: ${durationText} · ${passengers} passager(s)`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      metadata: {
        pickup: origin,
        dropoff: destination,
        date,
        time,
        passengers: passengers.toString(),
        distance_km: distanceKm.toString(),
        duration_text: durationText,
        lang: currentLang,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE CREATE ERROR]", error);
    return NextResponse.json(
      { error: "Erreur création session Stripe", details: error.message },
      { status: 500 }
    );
  }
}
