"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CancelEnInner() {
  const sp = useSearchParams();
  const cid = sp.get("cid");

  return (
    <main style={{ padding: "80px 20px", textAlign: "center", color: "#fff", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.3rem", marginBottom: 16, color: "#facc15" }}>Payment canceled</h1>
      <p style={{ fontSize: "1.1rem", opacity: 0.85 }}>
        Your payment was canceled. No charge has been made.
        {cid ? (
          <>
            <br />
            Reference: <strong>{cid}</strong>
          </>
        ) : null}
      </p>

      <a
        href="/en/reservation"
        style={{
          display: "inline-block",
          padding: "12px 28px",
          background: "#facc15",
          color: "#000",
          borderRadius: 8,
          fontWeight: 600,
          textDecoration: "none",
          fontSize: "1.05rem",
          marginTop: 20,
        }}
      >
        Back to booking
      </a>
    </main>
  );
}

export default function CancelPageEn() {
  return (
    <Suspense fallback={<div style={{ color: "#fff", padding: 40, textAlign: "center" }}>Loading…</div>}>
      <CancelEnInner />
    </Suspense>
  );
}
