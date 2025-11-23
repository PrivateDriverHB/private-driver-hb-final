"use client";
import { useEffect, useRef } from "react";

export default function AutocompleteInput({ value, onChange, placeholder }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    // Attendre que Google Maps soit chargé
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    if (!autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        fields: ["formatted_address", "geometry"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        }
      });
    }
  }, []);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="autocomplete-input"
      style={{
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #333",
        background: "#000",
        color: "#fff",
        width: "100%",
      }}
    />
  );
}
