export default function PricesPageEn() {
  return (
    <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 16px", color: "#fff" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: 8 }}>
        Private Driver HB – Price List
      </h1>

      <p style={{ marginBottom: 24 }}>
        The prices below are indicative. The booking calculator automatically adjusts the price based on distance, departure country and selected options.
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
          <h2 style={{ marginBottom: 16 }}>From 2.00 € / km</h2>

          <p>• Minimum fare: 25 €</p>
          <p>• Ideal for local & regional trips</p>
          <p>• Airport waiting available upon request</p>
        </div>

        {/* SWISS */}
        <div style={{
          flex: "1 1 350px",
          backgroundColor: "#111",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)"
        }}>
          <h3 style={{ marginBottom: 12 }}>SWITZERLAND</h3>
          <h2 style={{ marginBottom: 16 }}>From 3.50 CHF / km</h2>

          <p>• Minimum billing: 50 CHF</p>
          <p>• Additional cost for long distances &gt; 50 km</p>
          <p>• Billing available for embassies & companies</p>
        </div>

        {/* HOURLY SERVICE */}
        <div style={{
          flex: "1 1 350px",
          backgroundColor: "#111",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)"
        }}>
          <h3 style={{ marginBottom: 12 }}>HOURLY SERVICE</h3>
          <h2 style={{ marginBottom: 16 }}>From 50 € / hour</h2>

          <p>• Minimum 2 consecutive hours</p>
          <p>• Events, weddings, professional missions</p>
          <p>• Tailor-made pricing available on request</p>
        </div>
      </div>

      <p style={{ marginTop: 30, color: "#aaa" }}>
        For detailed quotes (long distance trips, multiple stops, embassy services), use the contact form or call us directly.
      </p>
    </main>
  );
}
