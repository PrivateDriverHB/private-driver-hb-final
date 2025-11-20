"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("idle");

  function handleSubmit(e) {
    e.preventDefault();
    // Pour l'instant on simule juste l'envoi.
    // Ensuite on branchera l'API route + Resend.
    setStatus("sent");
  }

  return (
    <main style={{ maxWidth: "900px", margin: "40px auto", padding: "0 16px" }}>
      <h1>Contact</h1>
      <p>
        Pour une demande de devis, un trajet spécifique ou une mise à
        disposition, vous pouvez utiliser ce formulaire ou appeler directement :
      </p>
      <p>
        <strong>
          Tél : <a href="tel:+33766441270">+33 7 66 44 12 70</a>
        </strong>
      </p>
      <p>
        Email :{" "}
        <a href="mailto:bhubervtc@gmail.com">bhubervtc@gmail.com</a>
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
        <div style={{ marginBottom: "8px" }}>
          <label>
            Nom
            <br />
            <input type="text" name="name" required style={{ width: "100%" }} />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Email
            <br />
            <input type="email" name="email" required style={{ width: "100%" }} />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Message
            <br />
            <textarea
              name="message"
              rows={5}
              style={{ width: "100%" }}
              required
            />
          </label>
        </div>

        <button type="submit">Envoyer</button>
      </form>

      {status === "sent" && (
        <p style={{ marginTop: "12px", color: "green" }}>
          Merci, votre message a été simulé comme envoyé.  
          Nous allons maintenant brancher l&apos;envoi réel par email (Resend).
        </p>
      )}
    </main>
  );
}
