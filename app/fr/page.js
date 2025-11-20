export default function HomePageFr() {
  return (
    <>
      <section className="hero">
        <div>
          <div className="hero-eyebrow badge">Service Chauffeur Privé Premium</div>

          <h1 className="hero-title">
            Votre chauffeur privé entre Genève, Lyon & Annecy
          </h1>

          <p className="hero-subtitle">
            Transferts aéroport, trajets professionnels et déplacements privés.
            Service discret, ponctuel et sur mesure dans une berline confortable et climatisée.
          </p>

          <ul className="hero-bullets">
            <li>Tarifs transparents avec calcul automatique de distance</li>
            <li>Prise en charge France & Suisse</li>
            <li>Réservation simple avec paiement sécurisé</li>
          </ul>

          <div className="hero-cta-row">
            <a href="/fr/reservation" className="btn btn-primary">
              Réserver un trajet
            </a>
            <a href="/fr/tarifs" className="btn btn-ghost">
              Voir les tarifs
            </a>
          </div>

          <div className="hero-tagline">
            Ou réservez directement par téléphone :{" "}
            <a href="tel:+33766441270">+33 7 66 44 12 70</a>
          </div>
        </div>

        {/* ==== CARTE DROITE | ZONE DE SERVICE ==== */}
        <aside className="hero-card" style={{ marginTop: "2rem" }}>
          <div className="card-tag">Zone de service</div>

          <h3>Région Genève & Auvergne-Rhône-Alpes</h3>

          <p>
            Aéroport de Genève, Cornavin, Nations, Nyon, Lyon Part-Dieu & Aéroport,
            Annecy, Aix-les-Bains, Lagnieu et environs.
          </p>

          <ul className="card-list" style={{ marginTop: "0.9rem" }}>
            <li>Temps d’attente inclus (suivi de vol)</li>
            <li>Service entreprise : hôtels, ambassades & sociétés</li>
            <li>Facture disponible sur demande</li>
          </ul>
        </aside>
      </section>

      {/* ==== SECTION 2 : AVANTAGES ==== */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            Pourquoi choisir Private Driver HB ?
          </h2>

          <p className="section-lead">
            Un chauffeur dédié, un véhicule bien entretenu et une parfaite connaissance
            de la région Genève / Lyon / Ain.
          </p>
        </div>

        <div className="pricing-grid">
          <div className="card">
            <div className="card-tag">Confort & Discrétion</div>
            <h3 className="card-title">Berline Premium</h3>
            <ul className="card-list">
              <li>Climatisation bi-zone & intérieur spacieux</li>
              <li>Eau & petites attentions à bord</li>
              <li>Chauffeur expérimenté & ponctuel</li>
            </ul>
          </div>

          <div className="card">
            <div className="card-tag">Professionnels & Particuliers</div>
            <h3 className="card-title">Transferts & Mise à disposition</h3>
            <ul className="card-list">
              <li>Transferts aéroport & gares</li>
              <li>Réunions, séminaires & événements</li>
              <li>Mariages & soirées privées</li>
            </ul>
          </div>

          <div className="card">
            <div className="card-tag">France & Suisse</div>
            <h3 className="card-title">Chauffeur Transfrontalier</h3>
            <ul className="card-list">
              <li>Prise en charge côté français & suisse</li>
              <li>Tarifs adaptés pour départs de Genève</li>
              <li>Factures disponibles en EUR ou CHF</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
