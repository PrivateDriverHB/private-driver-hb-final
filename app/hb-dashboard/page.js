"use client";

import { useState } from "react";

export default function Dashboard() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const correctPassword = "privatehb";

  async function loadReservations() {
    try {
      setLoading(true);

      const res = await fetch("/api/get-reservations");
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error loading reservations.");
        return;
      }

      setReservations(sortReservations(data.reservations));
    } catch (err) {
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------
  // 🔥 TRI ISO FUTUR → PASSÉ
  // -------------------------------------------------------
  function sortReservations(list) {
    const now = new Date();

    const normalize = (date, time) => {
      if (!date || date.trim() === "") return null;

      const t = time && time.trim() !== "" ? time : "00:00";
      const d = new Date(`${date}T${t}:00`);

      if (isNaN(d.getTime())) return null;
      return d;
    };

    const future = [];
    const past = [];

    for (const r of list) {
      const d = normalize(r.date, r.time);

      if (!d) {
        past.push({ ...r, parsed: new Date(0) });
        continue;
      }

      if (d >= now) future.push({ ...r, parsed: d });
      else past.push({ ...r, parsed: d });
    }

    future.sort((a, b) => a.parsed - b.parsed);
    past.sort((a, b) => b.parsed - a.parsed);

    return [...future, ...past];
  }

  // -------------------------------------------------------
  // 🔥 Course du jour
  // -------------------------------------------------------
  function isToday(date, time) {
    if (!date) return false;

    const t = time && time.trim() !== "" ? time : "00:00";
    const d = new Date(`${date}T${t}:00`);
    const now = new Date();

    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }

  // -------------------------------------------------------
  // 🔥 Course passée
  // -------------------------------------------------------
  function isPast(date, time) {
    if (!date) return false;

    const t = time && time.trim() !== "" ? time : "00:00";
    const d = new Date(`${date}T${t}:00`);
    const now = new Date();

    return d < now && !isToday(date, time);
  }

  function handleLogin(e) {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthorized(true);
      loadReservations();
    } else {
      alert("Incorrect password.");
    }
  }

  // -------------------------------------------------------
  // 🔐 ÉCRAN LOGIN
  // -------------------------------------------------------
  if (!authorized) {
    return (
      <main style={{ maxWidth: 400, margin: "80px auto", textAlign: "center", color: "#fff" }}>
        <h1 style={{ marginBottom: 16 }}>🔐 Driver Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              borderRadius: 8,
              background: "#000",
              border: "1px solid #333",
              color: "#fff",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 999,
              background: "linear-gradient(90deg,#d4a019,#f5c451)",
              color: "#000",
              fontWeight: 600,
            }}
          >
            Login
          </button>
        </form>
      </main>
    );
  }

  // -------------------------------------------------------
  // 📋 TABLEAU DES RÉSERVATIONS
  // -------------------------------------------------------
  return (
    <main style={{ maxWidth: "1000px", margin: "40px auto", color: "#fff" }}>
      <h1 style={{ marginBottom: 24 }}>📋 Driver Dashboard – Reservations</h1>

      {loading && <p>Loading…</p>}

      {!loading && reservations.length === 0 && <p>No reservations found.</p>}

      {reservations.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#111",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Course ID</th>
              <th style={thStyle}>Pickup → Dropoff</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((r, index) => {
              const highlightToday = isToday(r.date, r.time);
              const past = isPast(r.date, r.time);

              return (
                <tr
                  key={index}
                  style={{
                    background: highlightToday ? "#222" : "transparent",
                  }}
                >
                  <td style={past ? tdPast : tdStyle}>{r.courseId}</td>

                  <td style={past ? tdPast : tdStyle}>
                    {r.pickup} → {r.dropoff}
                  </td>

                  <td style={highlightToday ? tdHighlight : past ? tdPast : tdStyle}>
                    {r.date || "—"} {r.time || ""}
                  </td>

                  <td style={past ? tdPast : tdStyle}>
                    {r.amount} {r.currency.toUpperCase()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}

// -------------------------------------------------------
// 🎨 Styles
// -------------------------------------------------------

const thStyle = {
  padding: "12px",
  background: "#222",
  borderBottom: "2px solid #444",
  textAlign: "left",
  fontWeight: 700,
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #333",
};

const tdHighlight = {
  padding: "12px",
  borderBottom: "1px solid #333",
  color: "#f5c451",
  fontWeight: 700,
};

const tdPast = {
  padding: "12px",
  borderBottom: "1px solid #333",
  color: "#777",
  textDecoration: "line-through",
};
