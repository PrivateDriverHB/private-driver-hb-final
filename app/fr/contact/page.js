export default function ContactPageFR() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "0 16px",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "34px", fontWeight: 700, marginBottom: 10 }}>
        Contact & Assistance Réservation
      </h1>

      <p style={{ fontSize: "17px", opacity: 0.85, marginBottom: 25 }}>
        Pour toute demande de transfert, question urgente ou réservation spéciale,
        n'hésitez pas à me contacter. Je réponds rapidement et reste disponible
        24h/24 et 7j/7 pour les réservations depuis Genève, Lyon, Annecy et les stations de ski.
      </p>

      {/* CARTES INFO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginTop: "30px",
          marginBottom: "35px",
        }}
      >
        {/* TÉLÉPHONE */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>📞 Téléphone</h3>
          <p>
            <a
              href="tel:+33766441270"
              style={{ color: "#f5c451", textDecoration: "none" }}
            >
              +33 7 66 44 12 70
            </a>
          </p>
        </div>

        {/* WHATSAPP */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>💬 WhatsApp</h3>
          <p>
            <a
              href="https://wa.me/33766441270?text=Bonjour%2C%20je%20souhaite%20réserver%20un%20transfert."
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#25D366", fontWeight: 600, textDecoration: "none" }}
            >
              Discuter sur WhatsApp
            </a>
          </p>
        </div>

        {/* EMAIL */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>📧 E-mail</h3>
          <p>
            <a
              href="mailto:bhubervtc@gmail.com"
              style={{ color: "#f5c451", textDecoration: "none" }}
            >
              bhubervtc@gmail.com
            </a>
          </p>
        </div>

        {/* ZONES DE SERVICE */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>📍 Zones de service</h3>
          <p style={{ opacity: 0.8 }}>
            Aéroport de Genève (GVA)  
            <br />Lyon • Annecy • Chamonix • Avoriaz • Morzine  
            <br />Transferts aéroport & stations de ski
          </p>
        </div>
      </div>

      {/* FORMULAIRE DE CONTACT */}
      <section
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "28px",
          borderRadius: "12px",
          border: "1px solid #333",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>
          Envoyer un message
        </h2>

        <form
          action="https://formsubmit.co/bhubervtc@gmail.com"
          method="POST"
          style={{ display: "grid", gap: "15px", marginTop: "20px" }}
        >
          {/* Anti-spam */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="Nouveau message FR — Private Driver HB" />

          <input
            required
            name="name"
            placeholder="Votre nom"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "#000",
              color: "#fff",
            }}
          />

          <input
            required
            name="email"
            type="email"
            placeholder="Votre e-mail"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "#000",
              color: "#fff",
            }}
          />

          <textarea
            required
            name="message"
            rows={4}
            placeholder="Votre message"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "#000",
              color: "#fff",
            }}
          ></textarea>

          <button
            type="submit"
            style={{
              padding: "14px 22px",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #d4a019, #f5c451)",
              color: "#000",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Envoyer le message
          </button>
        </form>
      </section>
    </main>
  );
}
