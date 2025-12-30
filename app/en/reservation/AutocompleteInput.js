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
      if (!window.google?.maps?.places) return;
      if (!inputRef.current) return;

      // ✅ Prevent double init
      if (autocompleteRef.current) return;

      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        // ✅ Keep airports etc (no "geocode" filter)
        fields: [
          "formatted_address",
          "place_id",
          "address_components",
          "geometry",
          "name",
        ],
        componentRestrictions: { country: ["ch", "fr"] },
      });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (!place) return;

        const address = place.formatted_address || place.name || "";

        // ✅ Must have a real selection (place_id)
        if (!place.place_id || !address) {
          // If Google returns incomplete place, do nothing (force user to reselect)
          return;
        }

        // ✅ iOS fix: first tap sometimes just changes focus/keyboard
        // blur makes the selection stick immediately
        inputRef.current?.blur();

        // ✅ Update input value with full address (never country-only)
        onChange?.(address);

        // ✅ Send full place object to parent
        onSelect?.(place);
      });

      autocompleteRef.current = ac;
    };

    init();

    // ✅ If Google script loads later, initialize then
    const handler = () => init();
    window.addEventListener("google-maps-loaded", handler);

    return () => {
      window.removeEventListener("google-maps-loaded", handler);

      // ✅ Cleanup (avoid issues when switching EN <-> FR)
      try {
        autocompleteRef.current?.unbindAll?.();
      } catch {}
      autocompleteRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelect, onChange]);

  return (
    <input
      ref={inputRef}
      value={value}
      disabled={disabled}
      onChange={(e) => {
        // ✅ When typing manually, we keep value updating,
        // but the parent should mark "selected:false" until a real place is picked.
        onChange?.(e.target.value);
      }}
      onFocus={() => {
        // ✅ Optional but helps iOS: put cursor properly, keep dropdown near input
        // (also helps when page is scrollable)
        try {
          inputRef.current?.scrollIntoView?.({ block: "center", behavior: "smooth" });
        } catch {}
      }}
      placeholder={placeholder}
      autoComplete="off"
      inputMode="search"
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
