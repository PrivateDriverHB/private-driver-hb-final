"use client";
import { useEffect, useRef } from "react";

export default function AutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder,
  disabled,
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const init = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) return;
      if (!inputRef.current) return;

      // ✅ prevent double init
      if (autocompleteRef.current) return;

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          // ✅ IMPORTANT:
          // - remove "geocode" filter so airports (establishments) appear
          // types: ["geocode"],

          // ✅ Keep the fields you need
          fields: ["formatted_address", "place_id", "address_components", "geometry", "name"],

          // ✅ Strongly recommended to avoid USA/other countries
          componentRestrictions: { country: ["ch", "fr"] },
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place) return;

        // ✅ best value: formatted_address (fallback: name)
        const nextValue = place.formatted_address || place.name || value || "";
        onChange?.(nextValue);

        onSelect?.(place);
      });
    };

    init();

    const handler = () => init();
    window.addEventListener("google-maps-loaded", handler);

    return () => {
      window.removeEventListener("google-maps-loaded", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelect, onChange]);

  return (
    <input
      ref={inputRef}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      autoComplete="off"
      style={{
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #333",
        background: "#000",
        color: "#fff",
        width: "100%",
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? "not-allowed" : "text",
      }}
    />
  );
}
