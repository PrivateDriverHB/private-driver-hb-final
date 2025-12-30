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

  // ✅ garder les callbacks à jour sans ré-init Autocomplete
  const onChangeRef = useRef(onChange);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onChangeRef.current = onChange;
    onSelectRef.current = onSelect;
  }, [onChange, onSelect]);

  useEffect(() => {
    const init = () => {
      if (!window.google?.maps?.places) return;
      if (!inputRef.current) return;

      // ✅ prevent double init
      if (autocompleteRef.current) return;

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          // ✅ IMPORTANT: pas de types ["geocode"] (sinon aéroports parfois absents)
          fields: [
            "formatted_address",
            "place_id",
            "address_components",
            "geometry",
            "name",
          ],
          // ✅ Limite FR + CH
          componentRestrictions: { country: ["fr", "ch"] },
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace?.();
        if (!place) return;

        const address = place.formatted_address || place.name || "";
        const placeId = place.place_id || null;

        // ✅ sécurité : il faut un vrai résultat Google
        if (!address || !placeId) return;

        // ✅ met à jour l'input + déclenche parent
        onChangeRef.current?.(address);
        onSelectRef.current?.(place);

        // ✅ iPhone: ferme le clavier pour faciliter le clic
        inputRef.current?.blur?.();
      });
    };

    init();

    // ✅ si Google Maps charge après
    const handler = () => init();
    window.addEventListener("google-maps-loaded", handler);

    return () => {
      window.removeEventListener("google-maps-loaded", handler);
      // ⚠️ On ne détruit pas agressivement l'instance (sinon bugs multi-clic)
      // Laisser Google gérer, et l’instance disparaît au unmount.
      autocompleteRef.current = null;
    };
  }, []);

  return (
    <input
      ref={inputRef}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      autoComplete="off"
      inputMode="text"
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
