// app/api/send-email/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

// ⚠️ IMPORTANT : mets une adresse FROM réellement validée dans Resend
const OWNER_EMAIL = "booking@privatedriverhb.com";
const FROM_EMAIL = "Private Driver HB <booking@privatedriverhb.com>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;
if (!resendApiKey) console.warn("⚠️ RESEND_API_KEY missing — emails won't be sent.");

function moneyFromStripe(amountTotal, currency) {
  const cur = (currency || "").toUpperCase();
  if (typeof amountTotal !== "number") return "—";
  const value = (amountTotal / 100).toFixed(2);
  return `${value} ${cur}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, to } = body || {};

    if (!to) {
      return NextResponse.json({ error: "Email client manquant." }, { status: 400 });
    }
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId manquant." }, { status: 400 });
    }
    if (!resend) {
      return NextResponse.json({ ok: true, simulated: true });
    }
    if (!stripeSecretKey) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY manquante (ENV)." }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

    // 🔐 Source de vérité Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 🔒 Paiement obligatoire
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Paiement non confirmé. Email non envoyé." }, { status: 400 });
    }

    const md = session.metadata || {};

    // ✅ Anti-double envoi PRO (persistant)
    if (md.email_sent === "true") {
      return NextResponse.json({ duplicate: true, reason: "email_sent metadata already true" });
    }

    const courseId = md.course_id || "—";
    const pickup = md.pickup || "—";
    const dropoff = md.dropoff || "—";
    const date = md.date || "—";
    const time = md.time || "—";
    const passengers = md.passengers || "—";
    const isSwiss = md.is_swiss === "true";

    const pricePaid = moneyFromStripe(session.amount_total, session.currency);

    const gold = "#d4a019";

    // ---------------------------------------------------
    // 📩 EMAIL CLIENT
    // ---------------------------------------------------
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

    // ---------------------------------------------------
    // 📩 EMAIL CHAUFFEUR
    // ---------------------------------------------------
    const htmlOwner = `
      <div style="background:#ffffff;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#000;">
        <div style="max-width:620px;margin:0 auto;border:1px solid #ddd;border-radius:12px;padding:22px;">
          <h1 style="font-size:18px;margin:0 0 12px;color:${gold};">
            🟡 Nouvelle réservation payée
          </h1>
          <div style="font-size:13px;line-height:1.7;">
            <p><strong style="color:${gold};">Numéro de course :</strong> ${courseId}</p>
            <p><strong style="color:${gold};">Client :</strong> ${to}</p>
            <p><strong style="color:${gold};">Départ :</strong> ${pickup}</p>
            <p><strong style="color:${gold};">Arrivée :</strong> ${dropoff}</p>
            <p><strong style="color:${gold};">Date :</strong> ${date}</p>
            <p><strong style="color:${gold};">Heure :</strong> ${time}</p>
            <p><strong style="color:${gold};">Passagers :</strong> ${passengers}</p>
            <p><strong style="color:${gold};">Suisse :</strong> ${isSwiss ? "Oui 🇨🇭" : "Non 🇫🇷"}</p>
            <p><strong style="color:${gold};">Prix payé :</strong> ${pricePaid}</p>
            <p><strong style="color:${gold};">Session :</strong> ${sessionId}</p>
          </div>
        </div>
      </div>
    `;

    // ✅ Envoi emails
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Confirmation de votre réservation – Private Driver HB",
      html: htmlClient,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: "Nouvelle réservation – Private Driver HB",
      html: htmlOwner,
    });

    // ✅ Marquer la session Stripe pour éviter double envoi (persistant)
    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...md,
        email_sent: "true",
        email_sent_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur Envoi Email:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi des emails." }, { status: 500 });
  }
}
