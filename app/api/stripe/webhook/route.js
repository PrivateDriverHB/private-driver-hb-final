// app/api/stripe/webhook/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --------------------
// ENV
// --------------------
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

// Emails
const OWNER_EMAIL = process.env.OWNER_EMAIL || "booking@privatedriverhb.com";
const FROM_EMAIL =
  process.env.FROM_EMAIL || "Private Driver HB <noreply@privatedriverhb.com>";

if (!STRIPE_SECRET_KEY) console.warn("⚠️ STRIPE_SECRET_KEY missing");
if (!STRIPE_WEBHOOK_SECRET) console.warn("⚠️ STRIPE_WEBHOOK_SECRET missing");
if (!RESEND_API_KEY) console.warn("⚠️ RESEND_API_KEY missing");

// Stripe / Resend clients
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function moneyFromStripe(amountTotal, currency) {
  const cur = (currency || "").toUpperCase();
  if (typeof amountTotal !== "number") return "—";
  const units = Math.round(amountTotal / 100);
  return `${units} ${cur}`;
}

function buildEmails({ courseId, pickup, dropoff, date, time, passengers, pricePaid, clientEmail, isSwiss }) {
  const gold = "#d4a019";

  const htmlClient = `
    <div style="background:#ffffff;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#000;">
      <div style="max-width:620px;margin:0 auto;border:1px solid #ddd;border-radius:12px;padding:24px;">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="display:inline-block;border:2px solid ${gold};border-radius:999px;
                      padding:10px 18px;font-weight:bold;letter-spacing:2px;font-size:18px;color:${gold};">
            PRIVATE DRIVER HB
          </div>
        </div>
        <h1 style="font-size:20px;text-align:center;margin:0 0 8px;color:${gold};">
          🚖 Confirmation de votre réservation
        </h1>
        <p style="text-align:center;font-size:14px;margin:0 0 24px;">
          Merci pour votre confiance. Votre réservation est confirmée.
        </p>
        <div style="font-size:14px;line-height:1.7;margin-bottom:20px;">
          <p><strong style="color:${gold};">Numéro de réservation :</strong> ${courseId}</p>
          <p><strong style="color:${gold};">Trajet :</strong> ${pickup} → ${dropoff}</p>
          <p><strong style="color:${gold};">Date :</strong> ${date}</p>
          <p><strong style="color:${gold};">Heure :</strong> ${time}</p>
          <p><strong style="color:${gold};">Passagers :</strong> ${passengers}</p>
          <p><strong style="color:${gold};">Prix payé :</strong> ${pricePaid}</p>
        </div>
        <div style="background:#f9f9f9;border:1px solid #ddd;border-radius:10px;
                    padding:14px 16px;margin-bottom:22px;">
          <p style="margin:0 0 6px;font-size:14px;">
            Vous pouvez contacter votre chauffeur directement sur WhatsApp :
          </p>
          <a href="https://wa.me/33766441270"
            style="display:inline-block;margin-top:4px;padding:10px 18px;border-radius:999px;
                   background:${gold};color:#000;font-weight:bold;font-size:14px;text-decoration:none;">
            💬 +33 7 66 44 12 70
          </a>
        </div>
        <div style="font-size:12px;color:#777;text-align:center;">
          Private Driver HB – Chauffeur privé / VTC<br/>
          <a href="https://www.privatedriverhb.com" style="color:${gold};text-decoration:none;">
            privatedriverhb.com
          </a>
        </div>
      </div>
    </div>
  `;

  const htmlOwner = `
    <div style="background:#ffffff;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#000;">
      <div style="max-width:620px;margin:0 auto;border:1px solid #ddd;border-radius:12px;padding:22px;">
        <h1 style="font-size:18px;margin:0 0 12px;color:${gold};">
          🟡 Nouvelle réservation payée
        </h1>
        <div style="font-size:13px;line-height:1.7;">
          <p><strong style="color:${gold};">Numéro de course :</strong> ${courseId}</p>
          <p><strong style="color:${gold};">Client :</strong> ${clientEmail || "—"}</p>
          <p><strong style="color:${gold};">Départ :</strong> ${pickup}</p>
          <p><strong style="color:${gold};">Arrivée :</strong> ${dropoff}</p>
          <p><strong style="color:${gold};">Date :</strong> ${date}</p>
          <p><strong style="color:${gold};">Heure :</strong> ${time}</p>
          <p><strong style="color:${gold};">Passagers :</strong> ${passengers}</p>
          <p><strong style="color:${gold};">Suisse :</strong> ${isSwiss ? "Oui 🇨🇭" : "Non 🇫🇷"}</p>
          <p><strong style="color:${gold};">Prix payé :</strong> ${pricePaid}</p>
        </div>
      </div>
    </div>
  `;

  return { htmlClient, htmlOwner };
}

// --------------------
// WEBHOOK HANDLER
// --------------------
export async function POST(req) {
  // 1) raw body obligatoire pour Stripe
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ Missing stripe-signature header");
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err?.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  try {
    // 2) On traite seulement checkout.session.completed
    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true, ignored: event.type });
    }

    const session = event.data.object;

    // 3) Sécurité paiement OK
    if (session.payment_status !== "paid") {
      console.log("⚠️ Session not paid, skipping email:", session.id);
      return NextResponse.json({ received: true, skipped: "not_paid" });
    }

    // 4) Récupérer email client
    const clientEmail =
      session.customer_details?.email ||
      session.customer_email ||
      session.metadata?.email ||
      session.metadata?.to ||
      null;

    if (!clientEmail) {
      console.error("❌ No client email found in session:", session.id);
      return NextResponse.json({ received: true, error: "missing_client_email" });
    }

    // 5) Anti-double envoi durable: PaymentIntent metadata
    const paymentIntentId = session.payment_intent;
    if (!paymentIntentId) {
      console.error("❌ Missing payment_intent in session:", session.id);
      return NextResponse.json({ received: true, error: "missing_payment_intent" });
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi?.metadata?.email_sent === "true") {
      console.log("🟨 Emails already sent for payment_intent:", paymentIntentId);
      return NextResponse.json({ received: true, duplicate: true });
    }

    // 6) Récupérer metadata course (ce que tu mets dans create-checkout-session)
    const md = session.metadata || {};
    const courseId = md.course_id || session.id || "—";
    const pickup = md.pickup || "—";
    const dropoff = md.dropoff || "—";
    const date = md.date || "—";
    const time = md.time || "—";
    const passengers = md.passengers || "—";
    const isSwiss = md.is_swiss === "true";

    const pricePaid = moneyFromStripe(session.amount_total, session.currency);

    // 7) Resend OK ?
    if (!resend) {
      console.warn("📭 RESEND disabled (missing RESEND_API_KEY). Skipping send.");
      return NextResponse.json({ received: true, simulated: true });
    }

    const { htmlClient, htmlOwner } = buildEmails({
      courseId,
      pickup,
      dropoff,
      date,
      time,
      passengers,
      pricePaid,
      clientEmail,
      isSwiss,
    });

    // 8) Envoi emails
    await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: "Confirmation de votre réservation – Private Driver HB",
      html: htmlClient,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: "Nouvelle réservation – Private Driver HB",
      html: htmlOwner,
    });

    // 9) Marquer comme envoyé (anti-double en prod)
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: { ...pi.metadata, email_sent: "true" },
    });

    console.log("✅ Emails sent + locked (email_sent=true)", {
      sessionId: session.id,
      paymentIntentId,
      clientEmail,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    // Stripe retry si 500 -> donc on laisse 500 si vraie erreur
    return new NextResponse("Server error", { status: 500 });
  }
}
