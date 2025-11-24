// app/api/send-email/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
let resend = null;

if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn("⚠️ RESEND_API_KEY is missing — emails will not be sent during build.");
}

const OWNER_EMAIL = "booking@privatedriverhb.com";
const FROM_EMAIL = "Private Driver HB <booking@privatedriverhb.com>";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("🔥 DONNÉES REÇUES PAR LE BACKEND :", body);

    const {
      to,
      courseId,
      pickup,
      dropoff,
      date,
      time,
      passengers,
      price,
      distanceKm,
      durationText,
      isSwiss,
    } = body || {};

    if (!to) {
      console.log("❌ ERREUR : email client manquant.");
      return NextResponse.json(
        { error: "Email client manquant." },
        { status: 400 }
      );
    }

    // ✅ Si aucune clé RESEND, on ne tente pas d'envoyer
    if (!resend) {
      console.log("📭 Mode simulation — emails non envoyés (pas de clé RESEND_API_KEY).");
      return NextResponse.json({ ok: true, simulated: true });
    }

    // ---------------------------------------------------
    // 📩 TEMPLATE EMAIL CLIENT
    // ---------------------------------------------------
    const htmlClient = `
      <div style="font-family:Arial;padding:24px;line-height:1.6;">
        <h2>🚖 Confirmation de réservation – Private Driver HB</h2>
        <p>Merci pour votre confiance. Votre réservation est confirmée.</p>
        <p><strong>Numéro de réservation :</strong> ${courseId}</p>
        <p><strong>Trajet :</strong> ${pickup} → ${dropoff}</p>
        <p><strong>Date :</strong> ${date}</p>
        <p><strong>Heure :</strong> ${time}</p>
        <p><strong>Nombre de passagers :</strong> ${passengers}</p>
        <p><strong>Prix payé :</strong> ${price}</p>
        <br/>
        <p>
          Vous pouvez contacter votre chauffeur directement sur WhatsApp :
          <a href="https://wa.me/33766441270" style="color:#d4a019;font-weight:bold;">
            +33 7 66 44 12 70
          </a>
        </p>
        <p style="margin-top:32px;font-size:13px;color:#777;">
          Private Driver HB – Chauffeur privé / VTC
        </p>
      </div>
    `;

    // ---------------------------------------------------
    // 📩 TEMPLATE EMAIL CHAUFFEUR
    // ---------------------------------------------------
    const htmlOwner = `
      <div style="font-family:Arial;padding:24px;line-height:1.6;">
        <h2>🟡 NOUVELLE RÉSERVATION PAYÉE</h2>
        <p><strong>Numéro de course :</strong> ${courseId}</p>
        <p><strong>Client :</strong> ${to}</p>
        <p><strong>Départ :</strong> ${pickup}</p>
        <p><strong>Arrivée :</strong> ${dropoff}</p>
        <p><strong>Date :</strong> ${date}</p>
        <p><strong>Heure :</strong> ${time}</p>
        <p><strong>Passagers :</strong> ${passengers}</p>
        <p><strong>Kilométrage :</strong> ${Number(distanceKm).toFixed(1)} km</p>
        <p><strong>Durée estimée :</strong> ${durationText}</p>
        <p><strong>Suisse :</strong> ${isSwiss ? "Oui 🇨🇭" : "Non 🇫🇷"}</p>
        <p><strong>Prix payé :</strong> ${price}</p>
        <hr style="margin:24px 0;"/>
        <p>
          Contact client WhatsApp :
          <a href="https://wa.me/33766441270" style="color:#d4a019;font-weight:bold;">
            +33 7 66 44 12 70
          </a>
        </p>
        <p style="font-size:13px;color:#777;">
          Email généré automatiquement depuis privatedriverhb.com
        </p>
      </div>
    `;

    // ---------------------------------------------------
    // 📬 ENVOI EMAILS
    // ---------------------------------------------------
    console.log("📨 Envoi email client à :", to);
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Confirmation de votre réservation – Private Driver HB",
      html: htmlClient,
    });

    console.log("📨 Envoi email chauffeur à :", OWNER_EMAIL);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: "Nouvelle réservation – Private Driver HB",
      html: htmlOwner,
    });

    console.log("✅ Emails envoyés avec succès !");
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Erreur Envoi Email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi des emails." },
      { status: 500 }
    );
  }
}
