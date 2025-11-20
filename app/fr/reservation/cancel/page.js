export default function CancelFR() {
  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        padding: "24px",
        textAlign: "center",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>❌ Paiement annulé</h1>

      <p style={{ fontSize: 18, marginBottom: 16 }}>
        Votre paiement n’a pas été finalisé.<br />
        Aucune réservation n’a été enregistrée.
      </p>

      <p style={{ marginBottom: 24 }}>
        Vous pouvez retourner à la réservation et réessayer à tout moment.
      </p>

      <a
        href="/fr/reservation"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          borderRadius: 999,
          background: "linear-gradient(90deg, #d4a019, #f5c451)",
          color: "#000",
          fontWeight: 600,
          textDecoration: "none",
          marginBottom: "16px",
          transition: "0.2s",
        }}
      >
        Revenir à la réservation
      </a>

      <br />

      <a
        href="/fr"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          borderRadius: 999,
          background: "#555",
          color: "#fff",
          fontWeight: 600,
          textDecoration: "none",
          transition: "0.2s",
        }}
      >
        Retour à l’accueil
      </a>
    </main>
  );
}
