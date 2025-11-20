"use client";

import { useEffect, useState, useRef } from "react";

const GENEVA_AIRPORT = { lat: 46.2381, lng: 6.1089 };

// SAME STATIONS AS FRENCH VERSION ✔️
const STATIONS = [
  {
    id: "avoriaz",
    name: "Avoriaz",
    lat: 46.1912,
    lng: 6.7756,
    price: "€320",
    distance: "75 km",
    duration: "1h40",
    img: "https://images.unsplash.com/photo-1518173946687-a4c889be6ecb?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "lesgets",
    name: "Les Gets",
    lat: 46.1587,
    lng: 6.6647,
    price: "€300",
    distance: "65 km",
    duration: "1h20",
    img: "https://images.unsplash.com/photo-1549893075-4a7a5f76c43b?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "morzine",
    name: "Morzine",
    lat: 46.1792,
    lng: 6.7085,
    price: "€300",
    distance: "70 km",
    duration: "1h30",
    img: "https://images.unsplash.com/photo-1612810806546-6195c2d3bd87?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "chamonix",
    name: "Chamonix – Mont Blanc",
    lat: 45.9237,
    lng: 6.8694,
    price: "€320",
    distance: "82 km",
    duration: "1h15",
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "megeve",
    name: "Megève",
    lat: 45.8545,
    lng: 6.6131,
    price: "€340",
    distance: "72 km",
    duration: "1h25",
    img: "https://images.unsplash.com/photo-1601134467661-3d5f0d00116a?auto=format&fit=crop&w=1400&q=70",
  },
  {
    id: "lacluzas",
    name: "La Clusaz",
    lat: 45.9045,
    lng: 6.4234,
    price: "€280",
    distance: "50 km",
    duration: "1h00",
    img: "https://images.unsplash.com/photo-1516569422860-0b485f4a8fea?auto=format&fit=crop&w=1400&q=70",
  },
];

const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1f1f1f" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#f5c451" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#444444" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0b0b0b" }],
  },
];

export default function SkiTransfersPageEn() {
  const [selectedId, setSelectedId] = useState(STATIONS[0].id);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const station = STATIONS.find((s) => s.id === selectedId);

    const map = new google.maps.Map(mapRef.current, {
      center: GENEVA_AIRPORT,
      zoom: 8,
      styles: MAP_STYLE,
      disableDefaultUI: false,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: { strokeColor: "#f5c451", strokeWeight: 5 },
    });

    directionsService.route(
      {
        origin: GENEVA_AIRPORT,
        destination: { lat: station.lat, lng: station.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") directionsRenderer.setDirections(result);
      }
    );
  }, [selectedId]);

  const selectedStation = STATIONS.find((s) => s.id === selectedId);

  return (
    <main style={{ color: "#fff" }}>
      {/* HERO */}
      <section
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516569422860-0b485f4a8fea?auto=format&fit=crop&w=1500&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "150px 20px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
          }}
        ></div>

        <div style={{ position: "relative", zIndex: 10 }}>
          <h1 style={{ fontSize: "42px", fontWeight: 700 }}>
            ❄️ Premium Ski Transfers from Geneva Airport
          </h1>
          <p style={{ fontSize: "18px", marginTop: "10px", opacity: 0.9 }}>
            Private transfers from Geneva Airport to major ski resorts —  
            Avoriaz, Les Gets, Morzine, Megève, Chamonix & La Clusaz.
          </p>
        </div>
      </section>

      {/* IMAGE SLIDER */}
      <section
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          padding: "25px 10px",
          margin: "20px 0",
        }}
      >
        {STATIONS.map((station) => (
          <div
            key={station.id}
            onClick={() => setSelectedId(station.id)}
            style={{
              display: "inline-block",
              marginRight: "12px",
              borderRadius: "12px",
              overflow: "hidden",
              width: "260px",
              height: "160px",
              border:
                station.id === selectedId ? "2px solid #f5c451" : "1px solid #333",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <img
              src={station.img}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt={station.name}
            />

            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                padding: "6px",
                background: "rgba(0,0,0,0.6)",
                textAlign: "center",
              }}
            >
              {station.name}
            </div>
          </div>
        ))}
      </section>

      {/* TWO COLUMNS */}
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* LEFT LIST */}
        <div
          style={{
            flex: "1 1 40%",
            background: "rgba(255,255,255,0.05)",
            padding: "24px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontSize: "26px" }}>🎿 Ski Resorts Served</h2>
          <p style={{ opacity: 0.8 }}>
            Fixed prices from Geneva Airport (GVA).
          </p>

          <ul style={{ marginTop: "15px", padding: 0, listStyle: "none" }}>
            {STATIONS.map((s) => (
              <li
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  backgroundColor:
                    s.id === selectedId ? "#2b220f" : "rgba(0,0,0,0.4)",
                  border:
                    s.id === selectedId
                      ? "1px solid #f5c451"
                      : "1px solid #333",
                }}
              >
                <div>
                  <strong>{s.name}</strong>
                  <br />
                  <span style={{ opacity: 0.7 }}>
                    {s.distance} • {s.duration}
                  </span>
                </div>

                <span style={{ color: "#f5c451", fontWeight: 600 }}>
                  {s.price}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT MAP */}
        <div
          style={{
            flex: "1 1 55%",
            background: "rgba(255,255,255,0.05)",
            padding: "22px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontSize: "24px" }}>
            🗺️ Route: Geneva → {selectedStation?.name}
          </h2>
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "380px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #333",
              marginTop: "12px",
            }}
          ></div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section
        style={{
          padding: "30px 20px 50px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "24px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontSize: "26px" }}>
            ⭐ Why Choose Private Driver HB?
          </h2>

          <ul style={{ marginTop: "12px", fontSize: "17px", lineHeight: 1.8 }}>
            <li>Experienced mountain driver — safe & smooth winter driving</li>
            <li>Premium sedan equipped for snow conditions</li>
            <li>Real-time flight tracking & airport meet-and-greet</li>
            <li>Assistance with ski equipment & luggage</li>
            <li>Simple booking with secure payment</li>
            <li>Available 24/7 with reservation</li>
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <a
            href="/en/reservation"
            style={{
              padding: "14px 28px",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #d4a019, #f5c451)",
              color: "#000",
              fontWeight: 600,
              textDecoration: "none",
              marginRight: "10px",
            }}
          >
            🚗 Book your ski transfer
          </a>

          <a
            href="https://wa.me/33766441270?text=Hello%2C%20I%20would%20like%20to%20book%20a%20ski%20transfer."
            target="_blank"
            style={{
              padding: "14px 28px",
              borderRadius: "999px",
              background: "#25D366",
              color: "#000",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            💬 WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
