"use client";

import { useEffect, useState, useRef } from "react";

const GENEVA_AIRPORT = { lat: 46.2381, lng: 6.1089 };

const STATIONS = [
  { id: "avoriaz", name: "Avoriaz", lat: 46.1912, lng: 6.7756, price: "320 €", distance: "75 km", duration: "1h40",
    img: "https://images.unsplash.com/photo-1518173946687-a4c889be6ecb?auto=format&fit=crop&w=1500&q=80" },

  { id: "lesgets", name: "Les Gets", lat: 46.1587, lng: 6.6647, price: "300 €", distance: "65 km", duration: "1h20",
    img: "https://images.unsplash.com/photo-1549893075-4a7a5f76c43b?auto=format&fit=crop&w=1500&q=80" },

  { id: "morzine", name: "Morzine", lat: 46.1792, lng: 6.7085, price: "300 €", distance: "70 km", duration: "1h30",
    img: "https://images.unsplash.com/photo-1612810806546-6195c2d3bd87?auto=format&fit=crop&w=1500&q=80" },

  { id: "megeve", name: "Megève", lat: 45.8545, lng: 6.6131, price: "340 €", distance: "72 km", duration: "1h25",
    img: "https://images.unsplash.com/photo-1601134467661-3d5f0d00116a?auto=format&fit=crop&w=1500&q=80" },

  { id: "chamonix", name: "Chamonix – Mont Blanc", lat: 45.9237, lng: 6.8694, price: "320 €", distance: "82 km", duration: "1h15",
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1500&q=80" },

  { id: "lacluzas", name: "La Clusaz", lat: 45.9045, lng: 6.4234, price: "280 €", distance: "50 km", duration: "1h00",
    img: "https://images.unsplash.com/photo-1516569422860-0b485f4a8fea?auto=format&fit=crop&w=1500&q=80" },
];

export default function SkiTransfersPageFr() {
  const [selectedId, setSelectedId] = useState(STATIONS[0].id);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // ⭐ Google Maps + Directions
  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.google || !window.google.maps) {
      setTimeout(() => setMapReady(!mapReady), 300);
      return;
    }

    const station = STATIONS.find((s) => s.id === selectedId);
    if (!station) return;

    const map = new google.maps.Map(mapRef.current, {
      center: GENEVA_AIRPORT,
      zoom: 8,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1f1f1f" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#f5c451" }] },
      ],
      streetViewControl: false,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
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
  }, [selectedId, mapReady]);

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
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)"
        }} />

        <div style={{ position: "relative", zIndex: 10 }}>
          <h1 style={{ fontSize: "42px", fontWeight: 700 }}>
            ❄️ Transferts vers les Stations de Ski
          </h1>
          <p style={{ fontSize: "18px", marginTop: "10px", opacity: 0.9 }}>
            Chauffeur privé premium depuis Genève Aéroport —
            service fiable, confortable et adapté aux routes de montagne.
          </p>
        </div>
      </section>

      {/* SLIDER STATIONS */}
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
              width: "260px",
              height: "160px",
              borderRadius: "12px",
              overflow: "hidden",
              border: station.id === selectedId ? "3px solid #f5c451" : "1px solid #333",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <img
              src={station.img}
              alt={station.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                background: "rgba(0,0,0,0.6)",
                padding: "6px 0",
                textAlign: "center",
              }}
            >
              {station.name}
            </div>
          </div>
        ))}
      </section>

      {/* LISTE + MAP */}
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
        {/* LISTE GAUCHE */}
        <div
          style={{
            flex: "1 1 40%",
            background: "rgba(255,255,255,0.05)",
            padding: "24px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontSize: "26px" }}>🎿 Stations desservies</h2>
          <p style={{ opacity: 0.8 }}>Depuis Genève Aéroport</p>

          <ul style={{ listStyle: "none", padding: 0, marginTop: "15px" }}>
            {STATIONS.map((s) => (
              <li
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                style={{
                  padding: "12px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    s.id === selectedId ? "#2b220f" : "rgba(0,0,0,0.4)",
                  border: s.id === selectedId ? "1px solid #f5c451" : "1px solid #333",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
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

        {/* MAP */}
        <div
          style={{
            flex: "1 1 55%",
            background: "rgba(255,255,255,0.05)",
            padding: "24px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontSize: "24px" }}>
            🗺️ Itinéraire : Genève → {selectedStation?.name}
          </h2>

          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "380px",
              borderRadius: "12px",
              border: "1px solid #333",
              marginTop: "12px",
            }}
          />
        </div>
      </section>

      {/* POURQUOI CHOISIR */}
      <section
        style={{ padding: "30px 20px 50px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "24px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ fontSize: "26px" }}>
            ⭐ Pourquoi choisir Private Driver HB ?
          </h2>

          <ul style={{ marginTop: "12px", lineHeight: 1.8 }}>
            <li>Chauffeur habitué aux routes enneigées</li>
            <li>Berline confortable — pneus neige</li>
            <li>Suivi de vol + accueil personnalisé</li>
            <li>Aide bagages & matériel ski</li>
            <li>Transfert privé 24/7</li>
            <li>Paiement sécurisé</li>
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <a
            href="/fr/reservation"
            style={{
              padding: "14px 28px",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #d4a019, #f5c451)",
              color: "#000",
              fontWeight: 600,
              marginRight: "10px",
            }}
          >
            🚗 Réserver un transfert ski
          </a>

          <a
            href="https://wa.me/33766441270?text=Bonjour%2C%20je%20souhaite%20réserver%20un%20transfert%20vers%20une%20station%20de%20ski."
            target="_blank"
            style={{
              padding: "14px 24px",
              borderRadius: "999px",
              background: "#25D366",
              color: "#000",
              fontWeight: 600,
            }}
          >
            💬 WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
