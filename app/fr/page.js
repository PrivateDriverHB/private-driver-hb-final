"use client";

export default function HomePageFr() {
  return (
    <main
      style={{
        color: "#fff",
        background: "#000",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ============ HERO SECTION ============ */}
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Texte principal */}
        <div style={{ flex: "1 1 480px" }}>
          <div
            style={{
              background: "linear-gradient(90deg, #d4a019, #f5c451)",
              color: "#000",
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: "999px",
              fontWeight: 600,
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            SERVICE CHAUFFEUR PRIVÉ PREMIUM
          </div>

          <h1
            style={{
              fontSize: "2.4rem",
              lineHeight: 1.3,
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            Chauffeur privé Genève, Lyon & stations de ski
          </h1>

          <p style={{ opacity: 0.9, marginBottom: "18px", lineHeight: 1.6 }}>
            Transferts aéroport, trajets professionnels et déplacements privés —
            service sur mesure dans une Audi Avant spacieuse et confortable.
            Chauffeur francophone et anglophone disponible 24h/24 – 7j/7.
          </p>

          <ul style={{ lineHeight: 1.8, marginBottom: "24px" }}>
            <li>✅ Tarifs transparents avec calcul automatique</li>
            <li>✅ Prise en charge France & Suisse</li>
            <li>✅ Réservation simple avec paiement sécurisé</li>
          </ul>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="/fr/reservation"
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
              🚗 Réserver un trajet
            </a>
            <a
              href="/fr/tarifs"
              style={{
                border: "1px solid #f5c451",
                color: "#f5c451",
                padding: "14px 26px",
                borderRadius: "999px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              💰 Voir les tarifs
            </a>
          </div>

          <p style={{ marginTop: "20px", fontSize: "15px", opacity: 0.9 }}>
            📞 Réservez aussi par téléphone :{" "}
            <a
              href="tel:+33766441270"
              style={{ color: "#f5c451", textDecoration: "underline" }}
            >
              +33 7 66 44 12 70
            </a>
          </p>
        </div>

        {/* Bloc droite */}
        <div
          style={{
            flex: "1 1 320px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "20px", color: "#f5c451" }}>Zone de service</h3>
          <p style={{ margin: "10px 0", lineHeight: 1.6 }}>
            Région Genève, Lyon, Annecy, Ain et stations alpines.
          </p>
          <ul style={{ lineHeight: 1.8, fontSize: "15px", opacity: 0.9 }}>
            <li>🛫 Aéroports de Genève & Lyon</li>
            <li>🏨 Hôtels, entreprises & ambassades</li>
            <li>⛷️ Stations de ski : Chamonix, Megève, Morzine, Avoriaz</li>
            <li>🧾 Facture disponible en EUR ou CHF</li>
          </ul>
        </div>
      </section>

      {/* ============ AVANTAGES SECTION ============ */}
      <section
        style={{
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            textAlign: "center",
            marginBottom: "10px",
            color: "#f5c451",
          }}
        >
          Pourquoi choisir Private Driver HB ?
        </h2>
        <p
          style={{
            textAlign: "center",
            maxWidth: "700px",
            margin: "0 auto 40px",
            opacity: 0.9,
          }}
        >
          Profitez d’un chauffeur privé expérimenté, idéal pour vos trajets
          entre la France et la Suisse. Confort, discrétion et sécurité à bord
          d’une Audi Avant haut de gamme.
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
            <h3 style={{ color: "#f5c451" }}>🚘 Berline Premium</h3>
            <ul style={{ marginTop: "10px", lineHeight: 1.8 }}>
              <li>Climatisation bi-zone & confort supérieur</li>
              <li>Eau et petites attentions à bord</li>
              <li>Parfait pour 1 à 4 passagers</li>
            </ul>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h3 style={{ color: "#f5c451" }}>💼 Professionnels & Particuliers</h3>
            <ul style={{ marginTop: "10px", lineHeight: 1.8 }}>
              <li>Transferts aéroports & gares</li>
              <li>Réunions, séminaires, soirées</li>
              <li>Service discret & ponctuel</li>
            </ul>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h3 style={{ color: "#f5c451" }}>🌍 France & Suisse</h3>
            <ul style={{ marginTop: "10px", lineHeight: 1.8 }}>
              <li>Prise en charge transfrontalière</li>
              <li>Tarifs adaptés côté Suisse</li>
              <li>Facturation en EUR ou CHF</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============ TRANSFERTS POPULAIRES ============ */}
      <section
        style={{
          background: "rgba(255,255,255,0.03)",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#f5c451", marginBottom: "10px" }}>
          Transferts populaires
        </h2>
        <p style={{ opacity: 0.9, marginBottom: "30px" }}>
          Départs et arrivées depuis Genève & Lyon vers les Alpes françaises :
        </p>
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            listStyle: "none",
            padding: 0,
            color: "#fff",
          }}
        >
          <li>🏔️ Chamonix</li>
          <li>⛷️ Megève</li>
          <li>🎿 Morzine</li>
          <li>🏡 Avoriaz</li>
          <li>❄️ Les Gets</li>
          <li>🚗 La Clusaz</li>
        </ul>
      </section>

      {/* ============ AVIS CLIENTS ============ */}
      <section
        style={{
          padding: "60px 20px",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#f5c451", marginBottom: "20px" }}>Avis Clients 5★</h2>
        <p style={{ opacity: 0.9, marginBottom: "25px" }}>
          "Excellent service — chauffeur ponctuel, véhicule impeccable et très professionnel.
          Nous recommandons sans hésiter !"
        </p>
        <p style={{ fontStyle: "italic", opacity: 0.8 }}>– Sophie & John, Londres 🇬🇧</p>
      </section>
    </main>
  );
}
