"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("idle");
    setStatusMsg("");

    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      setStatusMsg("Merci de renseigner au minimum votre nom, votre e‑mail et votre message.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi.");
      setStatus("ok");
      setStatusMsg("Merci ! Votre message a bien été envoyé. Je vous répondrai rapidement.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setStatusMsg(
        "Une erreur est survenue lors de l'envoi. Vous pouvez aussi écrire à bhubervtc@gmail.com."
      );
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <span className="badge-soft">Contact</span>
        <h1 className="section-title">Entrer en contact avec Private Driver HB</h1>
        <p className="section-lead">
          Pour une demande de devis, une réservation particulière (mariage,
          ambassade, événement) ou toute question, utilisez le formulaire
          ci‑dessous ou contactez‑moi directement.
        </p>
      </div>

      <div className="grid-two">
        <form className="card" onSubmit={handleSubmit}>
          <h2 className="card-title">Formulaire de contact</h2>

          <div className="field-group">
            <label htmlFor="name">Nom complet *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Votre nom"
            />
          </div>

          <div className="field-group">
            <label htmlFor="email">E‑mail *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="vous@example.com"
            />
          </div>

          <div className="field-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+33… ou +41…"
            />
          </div>

          <div className="field-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Détaillez votre demande : date, heures, trajet, nombre de passagers…"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Envoyer le message
          </button>

          {status !== "idle" && (
            <div
              className={
                "status " +
                (status === "ok" ? "status-ok" : status === "error" ? "status-error" : "")
              }
            >
              {statusMsg}
            </div>
          )}
        </form>

        <div className="card">
          <h2 className="card-title">Coordonnées</h2>
          <ul className="card-list">
            <li>
              Téléphone / WhatsApp :{" "}
              <a href="tel:+33766441270">+33 7 66 44 12 70</a>
            </li>
            <li>
              E‑mail :{" "}
              <a href="mailto:bhubervtc@gmail.com">bhubervtc@gmail.com</a>
            </li>
            <li>Zone principale : Lagnieu (Ain) — Genève — Lyon — Annecy</li>
          </ul>

          <div className="form-help" style={{ marginTop: "1rem" }}>
            Pour les missions longues ou récurrentes (ambassades, entreprises,
            événements sur plusieurs jours), un bon de commande ou un contrat
            peut être établi sur demande.
          </div>
        </div>
      </div>
    </section>
  );
}
