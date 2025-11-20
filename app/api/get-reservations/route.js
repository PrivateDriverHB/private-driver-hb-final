import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 50 });

    const reservations = sessions.data
      .filter((s) => s.payment_status === "paid")
      .map((s) => ({
        id: s.id,
        amount: (s.amount_total / 100).toFixed(2),
        currency: s.currency,
        pickup: s.metadata.pickup || "",
        dropoff: s.metadata.dropoff || "",
        date: s.metadata.date || "",
        time: s.metadata.time || "",
        courseId: s.metadata.course_id || "",
      }));

    return NextResponse.json({ reservations });
  } catch (err) {
    return NextResponse.json(
      { error: "Stripe error: " + err.message },
      { status: 500 }
    );
  }
}
