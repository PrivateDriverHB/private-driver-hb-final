import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
const contactTo = process.env.CONTACT_EMAIL_TO || "bhubervtc@gmail.com";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!resendApiKey) {
      // Mode développement : ne pas appeler l'API, seulement log
      console.log("Resend API key manquante. Message reçu :", {
        name,
        email,
        phone,
        message,
      });
      return NextResponse.json({ ok: true, simulated: true });
    }

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "Private Driver HB <noreply@privatedriverhb.com>",
      to: contactTo,
      subject: "Nouveau message depuis le site Private Driver HB",
      text: [
        `Nom : ${name}`,
        `E-mail : ${email}`,
        phone ? `Téléphone : ${phone}` : "",
        "",
        "Message :",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
