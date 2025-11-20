"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="main-shell">
      <div className="card">
        <h1 className="card-title">Merci pour votre réservation</h1>
        <p className="card-subtitle">
          Votre paiement a été confirmé. Vous recevrez la confirmation définitive
          par email ou téléphone.
        </p>
        <Link href="/">
          <button className="btn-main">Retour à l’accueil</button>
        </Link>
      </div>
    </main>
  );
}
