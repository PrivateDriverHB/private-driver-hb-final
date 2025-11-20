export default function HomePageEn() {
  return (
    <>
      <section className="hero">
        <div>
          <div className="hero-eyebrow badge">Premium Private Chauffeur Service</div>

          <h1 className="hero-title">
            Your Private Driver between Geneva, Lyon & Annecy
          </h1>

          <p className="hero-subtitle">
            Airport transfers, business travel and private trips.
            Discreet, punctual and tailored service in a comfortable air-conditioned sedan.
          </p>

          <ul className="hero-bullets">
            <li>Clear pricing with automatic distance calculation</li>
            <li>Pick-up available in France & Switzerland</li>
            <li>Simple booking with secure online payment</li>
          </ul>

          <div className="hero-cta-row">
            <a href="/en/reservation" className="btn btn-primary">
              Book a Transfer
            </a>

            {/*  ✅ FIX HERE – English route = /en/prices */}
            <a href="/en/prices" className="btn btn-ghost">
              View Prices
            </a>
          </div>

          <div className="hero-tagline">
            Or book directly by phone:{" "}
            <a href="tel:+33766441270">+33 7 66 44 12 70</a>
          </div>
        </div>

        <aside className="hero-card">
          <div className="card-tag">Service Areas</div>
          <h3>Geneva & Auvergne-Rhône-Alpes Region</h3>
          <p>
            Geneva Airport, Cornavin, Nations, Nyon, Lyon Part-Dieu & Airport,
            Annecy, Aix-les-Bains, Lagnieu and surrounding areas.
          </p>

          <ul className="card-list" style={{ marginTop: "0.9rem" }}>
            <li>Airport waiting time included (flight tracking)</li>
            <li>Business service for hotels, embassies & companies</li>
            <li>Invoice available on request</li>
          </ul>
        </aside>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            Why Choose Private Driver HB?
          </h2>
          <p className="section-lead">
            One dedicated driver, a well-maintained vehicle and perfect
            knowledge of the Geneva / Lyon / Ain region.
          </p>
        </div>

        <div className="pricing-grid">
          <div className="card">
            <div className="card-tag">Comfort & Discretion</div>
            <h3 className="card-title">Premium Sedan</h3>
            <ul className="card-list">
              <li>Dual-zone air conditioning and spacious interior</li>
              <li>Water & small onboard amenities</li>
              <li>Experienced & punctual driver</li>
            </ul>
          </div>

          <div className="card">
            <div className="card-tag">For Professionals & Individuals</div>
            <h3 className="card-title">Transfers & Hourly Service</h3>
            <ul className="card-list">
              <li>Airport & train station transfers</li>
              <li>Meetings, seminars & events</li>
              <li>Weddings & private evenings</li>
            </ul>
          </div>

          <div className="card">
            <div className="card-tag">France & Switzerland</div>
            <h3 className="card-title">Cross-Border Chauffeur</h3>
            <ul className="card-list">
              <li>Pick-up on both French & Swiss sides</li>
              <li>Special pricing for Geneva departures</li>
              <li>Invoices in EUR or CHF</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
