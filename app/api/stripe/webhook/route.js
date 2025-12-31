import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // ✅ Event principal
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ checkout.session.completed:", session.id);
    // 👉 ici on branchera l’envoi d’emails Resend
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
