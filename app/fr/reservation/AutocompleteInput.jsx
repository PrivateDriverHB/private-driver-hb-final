"use client";
import { useEffect, useRef } from "react";

export default function AutocompleteInput({ value, onChange, placeholder }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.error("Google Maps API not loaded correctly.");
        return;
      }

      if (!autocompleteRef.current && inputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["address"],
            componentRestrictions: { country: ["fr", "ch"] },
          }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (place.formatted_address) {
            onChange(place.formatted_address);
          }
        });
      }
    };

    // Attend que l'API soit prête avant d'initialiser
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(checkInterval);
        initAutocomplete();
      }
    }, 300);

    return () => clearInterval(checkInterval);
  }, []);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #333",
        background: "#000",
        color: "#fff",
      }}
    />
  );
}
