"use client";

import { useEffect, useState, useRef } from "react";

const GENEVA_AIRPORT = { lat: 46.2381, lng: 6.1089 };

const STATIONS = [
  { id: "avoriaz", name: "Avoriaz", lat: 46.1912, lng: 6.7756, price: "320 €", distance: "75 km", duration: "1h40" },
  { id: "lesgets", name: "Les Gets", lat: 46.1587, lng: 6.6647, price: "300 €", distance: "65 km", duration: "1h20" },
  { id: "morzine", name: "Morzine", lat: 46.1792, lng: 6.7085, price: "300 €", distance: "70 km", duration: "1h30" },
  { id: "megeve", name: "Megève", lat: 45.8545, lng: 6.6131, price: "340 €", distance: "72 km", duration: "1h25" },
  { id: "chamonix", name: "Chamonix – Mont Blanc", lat: 45.9237, lng: 6.8694, price: "320 €", distance: "82 km", duration: "1h15" },
  { id: "lacluzas", name: "La Clusaz", lat: 45.9045, lng: 6.4234, price: "280 €", distance: "50 km", duration: "1h00" },
];

export default function SkiTransfersPageFr() {
  const [selectedId, setSelectedId] = useState(STATIONS[0].id);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Google Maps — Itinéraire Genève -> Station
  useEffect(() => {
    if (!mapRef.current) return;

    if (!window.google || !window.google.maps) {
      setTimeout(() => setMapReady((v) => !v), 300);
      return;
    }

    const station = STATIONS.find((s) => s.id === selectedId);
    if (!station) return;

    const map = new google.maps.Map(mapRef.current, {
      center: GENEVA_AIRPORT,
      zoom: 8,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#0b0b0b" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#2f2f2f" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f5c451" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
        { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#18200e" }] },
      ],
      streetViewControl: false,
      mapTypeControl: true,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      polylineOptions: { strokeColor: "#f5c451", strokeWeight: 5 },
      suppressMarkers: false,
    });

    directionsService.route(
      {
        origin: GENEVA_AIRPORT,
        destination: { lat: station.lat, lng: station.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(GENEVA_AIRPORT);
          bounds.extend({ lat: station.lat, lng: station.lng });
          map.fitBounds(bounds);
        }
      }
    );
  }, [selectedId, mapReady]);

  const selectedStation = STATIONS.find((s) => s.id === selectedId);

  return (
    <main style={{ color: "#fff" }}>
      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(90deg, #0b0b0b, #1a1a1a)",
          padding: "150px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "42px", fontWeight: 700 }}>
          ❄️ Transferts vers les Stations de Ski depuis Genève Aéroport
        </h1>
        <p style={{ fontSize: "18px", marginTop: "10px", opacity: 0.9 }}>
          Chauffeur privé premium pour vos transferts vers Avoriaz, Morzine, Megève, Chamonix, Les Gets et La Clusaz —
          service haut de gamme et ponctuel.
        </p>
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
          <p style={{ opacity: 0.8 }}>Départs depuis Genève Aéroport (GVA)</p>

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
                  border:
                    s.id === selectedId
                      ? "1px solid #f5c451"
                      : "1px solid #333",
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

        {/* MAP + DESCRIPTION */}
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
              height: "400px",
              borderRadius: "12px",
              border: "1px solid #333",
              marginTop: "12px",
            }}
          />

          {/* BLOC PREMIUM */}
          <div
            style={{
              marginTop: "20px",
              background: "rgba(245,196,81,0.1)",
              padding: "18px 20px",
              borderRadius: "10px",
              lineHeight: 1.7,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "17px", maxWidth: "650px", margin: "0 auto" }}>
              Idéal pour un <strong>voyage en solo</strong>, en <strong>couple</strong> ou en
              <strong> petite famille (jusqu’à 4 personnes)</strong>. 
              Profitez d’un trajet confortable à bord de notre <strong>Audi Avant</strong>,
              alliant élégance, sécurité et discrétion pour vos transferts privés
              vers les stations de ski depuis <strong>Genève Aéroport</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS CHOISIR */}
      <section
        style={{
          padding: "10px 20px 50px",
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
            ⭐ Pourquoi choisir Private Driver HB ?
          </h2>

          <ul style={{ marginTop: "12px", lineHeight: 1.8 }}>
            <li>Chauffeurs expérimentés habitués aux routes enneigées</li>
            <li>Véhicules confortables et équipés de pneus neige</li>
            <li>Accueil personnalisé à Genève Aéroport</li>
            <li>Aide aux bagages et matériel de ski</li>
            <li>Transferts privés disponibles 24/7</li>
            <li>Paiement sécurisé en ligne</li>
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
              textDecoration: "none",
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
