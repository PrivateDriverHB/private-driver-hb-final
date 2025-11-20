export default function SuccessPage() {
  return (
    <main
      style={{
        padding: "80px 20px",
        textAlign: "center",
        color: "#fff",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2.6rem", marginBottom: "20px", color: "#facc15" }}>
        Paiement confirmé ✔️
      </h1>

      <p style={{ fontSize: "1.2rem", opacity: 0.85, marginBottom: "30px" }}>
        Merci ! Votre réservation a bien été enregistrée.
        <br />
        Un email de confirmation vous a été envoyé.
      </p>

      <a
        href="/fr"
        style={{
          display: "inline-block",
          padding: "12px 28px",
          background: "#facc15",
          color: "#000",
          borderRadius: "8px",
          fontWeight: "600",
          textDecoration: "none",
          fontSize: "1.1rem",
          marginTop: "20px",
        }}
      >
        Retour à l’accueil
      </a>
    </main>
  );
}
