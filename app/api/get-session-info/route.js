// app/api/get-session-info/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export async function POST(request) {
  try {
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Clé Stripe secrète manquante" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    });

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID manquant" },
        { status: 400 }
      );
    }

    // 🔎 Récupération de la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    return NextResponse.json({
      customer_email: session.customer_details?.email || "",
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata || {},
      payment_status: session.payment_status,
    });
  } catch (err) {
    console.error("[get-session-info] Stripe error:", err);
    return NextResponse.json(
      { error: "Erreur côté Stripe" },
      { status: 500 }
    );
  }
}
