"use client";

import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="main-shell">
      <div className="card">
        <h1 className="card-title">Paiement annulé</h1>
        <p className="card-subtitle">
          Votre paiement a été annulé. Vous pouvez modifier vos informations ou
          recommencer la réservation.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/reservation">
            <button className="btn-main">Revenir à la réservation</button>
          </Link>
          <Link href="/">
            <button className="btn-ghost">Retour à l’accueil</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
