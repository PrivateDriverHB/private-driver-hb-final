import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------------------------------------------------------
// 🔵 1️⃣  Récupérer une session Stripe (utilisé par /fr/success)
// ---------------------------------------------------------
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent", "line_items"],
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { error: "Stripe session fetch failed." },
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

      // ⭐ URLs DYNAMIQUES FR / EN CORRIGÉES
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
        origin,
        destination,
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
