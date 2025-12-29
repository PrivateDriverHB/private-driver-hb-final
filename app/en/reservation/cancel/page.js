"use client";

// app/en/reservation/cancel/page.js
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function CancelEN() {
  const searchParams = useSearchParams();

  const cid = useMemo(() => {
    const v = searchParams.get("cid");
    return v ? decodeURIComponent(v) : "";
  }, [searchParams]);

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
      <h1 style={{ fontSize: 32, marginBottom: 14 }}>❌ Payment cancelled</h1>

      <p style={{ fontSize: 18, marginBottom: 14, opacity: 0.9 }}>
        Your payment was not completed.
        <br />
        No booking has been recorded.
      </p>

      {cid && (
        <p style={{ marginBottom: 18, fontSize: 14, opacity: 0.85 }}>
          Reference: <strong style={{ color: "#f5c451" }}>{cid}</strong>
        </p>
      )}

      <div
        style={{
          margin: "0 auto 24px",
          maxWidth: 560,
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: 12,
          padding: "14px 16px",
          textAlign: "left",
          opacity: 0.95,
        }}
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
          You can return to the booking page and try again at any time.
          <br />
          <span style={{ opacity: 0.85 }}>
            If you believe you were charged, please contact us:{" "}
            <a
              href="mailto:booking@privatedriverhb.com"
              style={{ color: "#f5c451", textDecoration: "none" }}
            >
              booking@privatedriverhb.com
            </a>
          </span>
        </p>
      </div>

      <a
        href="/en/reservation"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          borderRadius: 999,
          background: "linear-gradient(90deg, #d4a019, #f5c451)",
          color: "#000",
          fontWeight: 700,
          textDecoration: "none",
          marginBottom: "14px",
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
          border: "1px solid #444",
        }}
      >
        Back to home
      </a>
    </main>
  );
}
