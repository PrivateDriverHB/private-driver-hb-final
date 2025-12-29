import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const contactTo = process.env.CONTACT_EMAIL_TO || "booking@privatedriverhb.com";

let resend = null;

// ✅ Empêche le crash lors du build sans clé
if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.warn("⚠️ RESEND_API_KEY is missing — emails will not be sent during build.");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, lang } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Simulation si la clé est absente (en local sans plantage)
    if (!resend) {
      console.log("📭 Simulated email (Resend disabled):", {
        name,
        email,
        phone,
        message,
        lang,
      });
      return NextResponse.json({ ok: true, simulated: true });
    }

    // Déterminer la langue du message
    const isEnglish = lang === "en";

    // 📨 Email envoyé à TOI (administrateur)
    await resend.emails.send({
      from: "Private Driver HB <no-reply@privatedriverhb.com>",
      to: contactTo,
      subject: isEnglish
        ? "New message from website (EN) — Private Driver HB"
        : "Nouveau message depuis le site (FR) — Private Driver HB",
      html: `
        <div style="font-family:Arial,sans-serif;background:#fff;padding:20px;border-radius:10px;max-width:600px;margin:auto;">
          <h2 style="color:#000;margin-bottom:10px;">${isEnglish ? "New message received" : "Nouveau message reçu"}</h2>
          <p><strong>${isEnglish ? "Name" : "Nom"} :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          ${phone ? `<p><strong>${isEnglish ? "Phone" : "Téléphone"} :</strong> ${phone}</p>` : ""}
          <p><strong>${isEnglish ? "Message" : "Message"} :</strong></p>
          <p style="white-space:pre-line;border-left:3px solid #d4a019;padding-left:10px;">${message}</p>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee;">
          <p style="font-size:13px;color:#666;">${isEnglish ? "Sent from the contact form on www.privatedriverhb.com" : "Envoyé depuis le formulaire de contact — www.privatedriverhb.com"}</p>
        </div>
      `,
    });

    // 📨 Email automatique envoyé au CLIENT
    await resend.emails.send({
      from: "Private Driver HB <no-reply@privatedriverhb.com>",
      to: email,
      subject: isEnglish
        ? "Thank you for contacting Private Driver HB"
        : "Merci pour votre message — Private Driver HB",
      html: `
        <div style="font-family:Arial,sans-serif;background:#fff;padding:20px;border-radius:10px;max-width:600px;margin:auto;">
          <h2 style="color:#000;margin-bottom:10px;">${
            isEnglish
              ? "Thank you for your message!"
              : "Merci pour votre message !"
          }</h2>
          <p style="font-size:15px;color:#333;">
            ${
              isEnglish
                ? "We have received your request and will get back to you shortly. Our team is available 24/7 for transfers from Geneva, Lyon, Annecy and all major ski resorts."
                : "Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais. Notre équipe reste disponible 24h/24 et 7j/7 pour vos transferts depuis Genève, Lyon, Annecy et les stations de ski."
            }
          </p>
          <p style="margin-top:20px;">
            ${
              isEnglish
                ? "Best regards,<br><strong>Private Driver HB</strong><br>www.privatedriverhb.com"
                : "Cordialement,<br><strong>Private Driver HB</strong><br>www.privatedriverhb.com"
            }
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
