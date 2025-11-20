export default function TarifsPageFr() {
  return (
    <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 16px", color: "#fff" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: 8 }}>
        Tarifs Private Driver HB
      </h1>

      <p style={{ marginBottom: 24 }}>
        Les tarifs ci-dessous sont indicatifs. Le calculateur de réservation ajuste automatiquement le prix selon le kilométrage, le pays de départ et les options choisies.
      </p>

      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", marginTop: 40 }}>

        {/* FRANCE */}
        <div style={{
          flex: "1 1 350px",
          backgroundColor: "#111",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)"
        }}>
          <h3 style={{ marginBottom: 12 }}>FRANCE</h3>
          <h2 style={{ marginBottom: 16 }}>À partir de 2,00 € / km</h2>

          <p>• Minimum de course : 25 €</p>
          <p>• Idéal pour les trajets locaux & régionaux</p>
          <p>• Attente aéroport possible sur devis</p>
        </div>

        {/* SUISSE */}
        <div style={{
          flex: "1 1 350px",
          backgroundColor: "#111",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)"
        }}>
          <h3 style={{ marginBottom: 12 }}>SUISSE</h3>
          <h2 style={{ marginBottom: 16 }}>À partir de 3,50 CHF / km</h2>

          <p>• Minimum de facturation : 50 CHF</p>
          <p>• Surcoût pour longues distances &gt; 50 km</p>
          <p>• Facturation possible pour ambassades & entreprises</p>
        </div>

        {/* MISE À DISPOSITION */}
        <div style={{
          flex: "1 1 350px",
          backgroundColor: "#111",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)"
        }}>
          <h3 style={{ marginBottom: 12 }}>MISE À DISPOSITION</h3>
          <h2 style={{ marginBottom: 16 }}>À partir de 50 € / heure</h2>

          <p>• Minimum 2 heures consécutives</p>
          <p>• Événements, mariages, journées professionnelles</p>
          <p>• Tarifs personnalisés sur devis</p>
        </div>
      </div>

      <p style={{ marginTop: 30, color: "#aaa" }}>
        Pour un devis précis (trajets longue distance, plusieurs arrêts, prestations pour ambassades ou sociétés), utilisez le formulaire de contact ou appelez-moi directement.
      </p>
    </main>
  );
}
