import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
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
    } = body;

    const currentLang = lang === "en" ? "en" : "fr";
    const amount = Math.round(price * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/${currentLang}/reservation/success?session_id={CHECKOUT_SESSION_ID}&cid=HB-${Date.now()}`,
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
        is_swiss: destination.toLowerCase().includes("suisse") ? "yes" : "no",
        lang: currentLang,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE ERROR]", error);
    return NextResponse.json(
      { error: "Erreur création session Stripe", details: error.message },
      { status: 500 }
    );
  }
}
