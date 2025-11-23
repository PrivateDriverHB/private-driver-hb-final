"use client";

export default function HomePageEn() {
  return (
    <main style={{ color: "#fff", background: "#000" }}>
      {/* ===== HERO SECTION ===== */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 20px 60px",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1612810806546-6195c2d3bd87?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
          }}
        ></div>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#d4a019",
              color: "#000",
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: "999px",
              fontWeight: 600,
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            PREMIUM AIRPORT & SKI TRANSFERS
          </div>

          <h1
            style={{ fontSize: "2.4rem", lineHeight: 1.3, fontWeight: 700 }}
          >
            Private Airport & Ski Transfers from Geneva and Lyon
          </h1>

          <p
            style={{
              marginTop: "16px",
              opacity: 0.9,
              maxWidth: "720px",
              marginInline: "auto",
              lineHeight: 1.6,
            }}
          >
            English-speaking chauffeur service providing premium private
            transfers from Geneva and Lyon airports to top ski resorts —
            Chamonix, Megève, Morzine, and more. Comfortable Audi Avant sedan
            ideal for solo travellers, couples or families up to 4 passengers.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "28px",
            }}
          >
            <a
              href="/en/reservation"
              style={{
                background: "linear-gradient(90deg, #d4a019, #f5c451)",
                color: "#000",
                padding: "14px 26px",
                borderRadius: "999px",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 0 15px rgba(245,196,81,0.3)",
              }}
            >
              🚗 Book Your Transfer
            </a>
            <a
              href="/en/prices"
              style={{
                border: "1px solid #f5c451",
                color: "#f5c451",
                padding: "14px 26px",
                borderRadius: "999px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              💰 View Prices
            </a>
          </div>

          <p style={{ marginTop: "22px", fontSize: "15px", opacity: 0.9 }}>
            📞 Need help? Call us:{" "}
            <a
              href="tel:+33766441270"
              style={{ color: "#f5c451", textDecoration: "underline" }}
            >
              +33 7 66 44 12 70
            </a>
          </p>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section
        style={{
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#f5c451",
            fontSize: "28px",
            marginBottom: "12px",
          }}
        >
          Why Choose Private Driver HB?
        </h2>
        <p
          style={{
            textAlign: "center",
            opacity: 0.9,
            maxWidth: "700px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          Travel with comfort and peace of mind. Your English-speaking chauffeur
          offers punctual, friendly and secure private transfers between Geneva,
          Lyon and the French Alps.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h3 style={{ color: "#f5c451" }}>🚘 Premium Comfort</h3>
            <ul style={{ marginTop: "10px", lineHeight: 1.8 }}>
              <li>Modern Audi Avant — air-conditioned & spacious</li>
              <li>Ideal for 1–4 passengers</li>
              <li>Bottled water & onboard amenities</li>
            </ul>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h3 style={{ color: "#f5c451" }}>🏔️ Ski & Airport Transfers</h3>
            <ul style={{ marginTop: "10px", lineHeight: 1.8 }}>
              <li>Geneva & Lyon airports</li>
              <li>Chamonix, Megève, Morzine, Avoriaz</li>
              <li>Courchevel & Les Gets</li>
            </ul>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h3 style={{ color: "#f5c451" }}>🕒 24/7 Availability</h3>
            <ul style={{ marginTop: "10px", lineHeight: 1.8 }}>
              <li>Pre-book online anytime</li>
              <li>Flight tracking included</li>
              <li>Professional, English-speaking driver</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== POPULAR SKI TRANSFERS ===== */}
      <section
        style={{
          padding: "60px 20px",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#f5c451",
            fontSize: "26px",
            marginBottom: "18px",
          }}
        >
          Popular Ski Transfers
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          {[
            { name: "Chamonix", href: "/en/ski-transfers" },
            { name: "Megève", href: "/en/ski-transfers" },
            { name: "Morzine", href: "/en/ski-transfers" },
            { name: "Avoriaz", href: "/en/ski-transfers" },
          ].map((station) => (
            <a
              key={station.name}
              href={station.href}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid #f5c451",
                color: "#f5c451",
                padding: "12px 20px",
                borderRadius: "999px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "0.2s ease",
              }}
            >
              {station.name}
            </a>
          ))}
        </div>
      </section>

      {/* ===== INTERNATIONAL BLOCK ===== */}
      <section
        style={{
          padding: "50px 20px",
          maxWidth: "1000px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#f5c451",
            fontSize: "24px",
            marginBottom: "14px",
          }}
        >
          We serve English-speaking travellers worldwide 🌍
        </h2>
        <p
          style={{
            opacity: 0.9,
            lineHeight: 1.6,
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          Whether you’re planning your ski holiday from the UK, Scandinavia, the
          USA or elsewhere, you can easily pre-book your airport or resort
          transfer online. Our private chauffeur ensures smooth and reliable
          service upon your arrival in Switzerland or France.
        </p>
      </section>

      {/* ===== TRUSTED BY TRAVELLERS ===== */}
      <section
        style={{
          background: "linear-gradient(180deg, #1a1a1a, #0d0d0d)",
          padding: "60px 20px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2
          style={{
            color: "#f5c451",
            fontSize: "24px",
            marginBottom: "16px",
          }}
        >
          Trusted by travellers from the UK & EU 🇬🇧🇪🇺
        </h2>
        <p
          style={{
            opacity: 0.9,
            fontSize: "16px",
            marginBottom: "30px",
            maxWidth: "700px",
            marginInline: "auto",
            lineHeight: 1.6,
          }}
        >
          Rated 5★ for comfort, punctuality and professionalism. Join hundreds
          of satisfied travellers who choose Private Driver HB for their Geneva
          & Lyon airport transfers every season.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "30px",
            opacity: 0.9,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/27/TripAdvisor_logoset_solid_green.svg"
              alt="TripAdvisor"
              style={{ width: "90px", height: "auto", opacity: 0.85 }}
            />
            <p style={{ fontSize: "14px", marginTop: "6px" }}>Excellent service</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Trustpilot_logo.png"
              alt="Trustpilot"
              style={{ width: "110px", height: "auto", opacity: 0.85 }}
            />
            <p style={{ fontSize: "14px", marginTop: "6px" }}>5★ Reviews</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_G_Logo.svg"
              alt="Google Reviews"
              style={{ width: "60px", height: "auto", opacity: 0.85 }}
            />
            <p style={{ fontSize: "14px", marginTop: "6px" }}>Top-rated transfers</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#aaa",
          padding: "20px 10px",
          background: "#000",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        © {new Date().getFullYear()} Private Driver HB — Geneva · Lyon · French Alps
      </footer>
    </main>
  );
}
