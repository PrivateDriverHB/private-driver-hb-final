// app/api/send-email/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

const resendApiKey = process.env.RESEND_API_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

let resend = null;
if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn("⚠️ RESEND_API_KEY is missing — emails will not be sent.");
}

// ✅ Adresse expéditeur et destinataire principal
const OWNER_EMAIL = "booking@privatedriverhb.com";
const FROM_EMAIL = "Private Driver HB <noreply@privatedriverhb.com>";

function moneyFromStripe(amountTotal, currency) {
  const cur = (currency || "").toUpperCase();
  if (typeof amountTotal !== "number") return "—";
  const units = Math.round(amountTotal / 100);
  return `${units} ${cur}`;
}

export async function POST(request) {
  try {
    const body = await request.json();

    // ✅ Exiger sessionId + email client
    const { sessionId, to } = body || {};

    if (!to) {
      return NextResponse.json({ error: "Email client manquant." }, { status: 400 });
    }
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId manquant." }, { status: 400 });
    }

    if (!resend) {
      console.log("📭 Mode simulation — emails non envoyés.");
      return NextResponse.json({ ok: true, simulated: true });
    }

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Clé Stripe secrète manquante (ENV)." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

    // 🔐 SOURCE DE VÉRITÉ STRIPE
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 🔒 SÉCURITÉ ABSOLUE : paiement obligatoire
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Paiement non confirmé. Email non envoyé." },
        { status: 400 }
      );
    }

    const md = session.metadata || {};

    const courseId = md.course_id || "—";
    const pickup = md.pickup || "—";
    const dropoff = md.dropoff || "—";
    const date = md.date || "—";
    const time = md.time || "—";
    const passengers = md.passengers || "—";
    const distanceKm = md.distance_km || "";
    const durationText = md.duration_text || "—";
    const isSwiss = md.is_swiss === "true";

    // ✅ Prix réellement payé
    const pricePaid = moneyFromStripe(session.amount_total, session.currency);

    // Couleur marque
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
    // 📩 EMAIL CHAUFFEUR / PROPRIÉTAIRE
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
          </div>
        </div>
      </div>
    `;

    // ✅ Anti-double envoi (clé = sessionId)
    if (!globalThis.__sentEmails) globalThis.__sentEmails = new Map();
    if (globalThis.__sentEmails.has(sessionId)) {
      return NextResponse.json({ duplicate: true });
    }
    globalThis.__sentEmails.set(sessionId, Date.now());

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur Envoi Email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi des emails." },
      { status: 500 }
    );
  }
}
