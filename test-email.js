import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // ✅ charge le fichier .env.local
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  try {
    console.log("📤 Envoi d’un email de test via Resend...");
    const result = await resend.emails.send({
      from: "Private Driver HB <noreply@privatedriverhb.com>",
      to: "booking@privatedriverhb.com",
      subject: "✅ Test Resend – Private Driver HB",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color:#d4a019;">🚗 Private Driver HB</h2>
          <p>Cet email de test a été envoyé via <strong>Resend</strong> et reçu par votre adresse <b>booking@privatedriverhb.com</b>.</p>
          <p>Tout fonctionne parfaitement ✅</p>
          <hr/>
          <p style="font-size:12px; color:#777;">www.privatedriverhb.com</p>
        </div>
      `,
    });

    console.log("✅ Email envoyé avec succès !");
    console.log(result);
  } catch (error) {
    console.error("❌ Erreur d'envoi :", error);
  }
}

sendTestEmail();
