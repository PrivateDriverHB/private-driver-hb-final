export default function ContactPageEN() {
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
        Contact & Booking Assistance
      </h1>

      <p style={{ fontSize: "17px", opacity: 0.85, marginBottom: 25 }}>
        For any questions, urgent transfers, or special requests, feel free to reach out.
        I respond quickly and provide support 24/7 for bookings from Geneva Airport,
        Lyon, Annecy and ski resorts.
      </p>

      {/* INFO CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginTop: "30px",
          marginBottom: "35px",
        }}
      >
        {/* PHONE */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>📞 Phone</h3>
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
              href="https://wa.me/33766441270?text=Hello%2C%20I%20would%20like%20to%20book%20a%20transfer."
              target="_blank"
              style={{ color: "#25D366", fontWeight: 600, textDecoration: "none" }}
            >
              Chat on WhatsApp
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
          <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>📧 Email</h3>
          <p>
            <a
              href="mailto:booking@privatedriverhb.com"
              style={{ color: "#f5c451", textDecoration: "none" }}
            >
              booking@privatedriverhb.com
            </a>
          </p>
        </div>

        {/* SERVICE AREA */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>📍 Service Areas</h3>
          <p style={{ opacity: 0.8 }}>
            Geneva Airport (GVA)  
            <br />Lyon • Annecy • Chamonix • Avoriaz • Morzine  
            <br />Ski resorts & private transfers
          </p>
        </div>
      </div>

      {/* CONTACT FORM */}
      <section
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "28px",
          borderRadius: "12px",
          border: "1px solid #333",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>
          Send a message
        </h2>

        <form
          action="https://formsubmit.co/booking@privatedriverhb.com"
          method="POST"
          style={{ display: "grid", gap: "15px", marginTop: "20px" }}
        >
          {/* Anti-spam */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="New EN Contact — Private Driver HB" />

          <input
            required
            name="name"
            placeholder="Your name"
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
            placeholder="Your email"
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
            placeholder="Your message"
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
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}
