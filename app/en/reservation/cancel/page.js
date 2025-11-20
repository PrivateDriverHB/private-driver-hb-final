// app/en/reservation/cancel/page.js

export default function CancelEN() {
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
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>❌ Payment cancelled</h1>

      <p style={{ fontSize: 18, marginBottom: 16 }}>
        Your payment was not completed.<br />
        No booking has been recorded.
      </p>

      <p style={{ marginBottom: 24 }}>
        You can go back to the booking page and try again at any time.
      </p>

      <a
        href="/en/reservation"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          borderRadius: 999,
          background: "linear-gradient(90deg, #d4a019, #f5c451)",
          color: "#000",
          fontWeight: 600,
          textDecoration: "none",
          marginBottom: "12px",
        }}
      >
        Back to booking
      </a>

      <br />

      <a
        href="/en"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          borderRadius: 999,
          background: "#333",
          color: "#fff",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Back to home
      </a>
    </main>
  );
}
