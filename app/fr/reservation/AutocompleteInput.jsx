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
    if (!window.google?.maps?.places) return;
    if (!inputRef.current) return;

    // 🔥 Nettoyage si déjà initialisé (navigation EN ⇄ FR)
    if (autocompleteRef.current) {
      autocompleteRef.current.unbindAll?.();
      autocompleteRef.current = null;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: [
          "formatted_address",
          "place_id",
          "address_components",
          "geometry",
          "name",
        ],
      }
    );

    // ✅ Limite FR + CH
    autocomplete.setComponentRestrictions({
      country: ["fr", "ch"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place) return;

      if (place.formatted_address) {
        onChange?.(place.formatted_address);
      }
      onSelect?.(place);
    });

    autocompleteRef.current = autocomplete;

    return () => {
      autocompleteRef.current?.unbindAll?.();
      autocompleteRef.current = null;
    };
  }, [onChange, onSelect]);

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
