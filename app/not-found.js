export default function NotFound() {
  return (
    <div
      style={{
        padding: "80px",
        textAlign: "center",
        color: "white",
        background: "#111",
        height: "100vh",
      }}
    >
      <h1 style={{ fontSize: "42px" }}>❌ Page introuvable</h1>
      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>

      <a
        href="/"
        style={{
          marginTop: "25px",
          display: "inline-block",
          padding: "12px 24px",
          background: "#f5c451",
          color: "#000",
          borderRadius: "8px",
          fontWeight: "600",
          textDecoration: "none",
        }}
      >
        Retour à l'accueil
      </a>
    </div>
  );
}
