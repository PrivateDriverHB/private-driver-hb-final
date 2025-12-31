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
  const pacRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const getLatestPac = () => {
      const list = document.querySelectorAll(".pac-container");
      const pac = list.length ? list[list.length - 1] : null; // ✅ dernier = le plus récent
      if (pac) {
        pacRef.current = pac;
        pac.style.zIndex = "2147483647";
        pac.style.pointerEvents = "auto";
      }
      return pac;
    };

    const positionPac = () => {
      const pac = pacRef.current || getLatestPac();
      if (!pac || !inputRef.current) return;

      const r = inputRef.current.getBoundingClientRect();

      // ✅ Position absolue dans le document
      const top = r.bottom + window.scrollY;
      const left = r.left + window.scrollX;
      const width = r.width;

      pac.style.position = "absolute";
      pac.style.top = `${top}px`;
      pac.style.left = `${left}px`;
      pac.style.width = `${width}px`;
    };

    const init = () => {
      if (!window.google?.maps?.places) return;
      if (!inputRef.current) return;

      // ✅ évite double init
      if (autocompleteRef.current) return;

      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: [
          "formatted_address",
          "place_id",
          "address_components",
          "geometry",
          "name",
        ],
      });

      // ✅ FR + CH
      ac.setComponentRestrictions({ country: ["fr", "ch"] });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (!place) return;

        const nextValue = place.formatted_address || place.name || "";
        onChange?.(nextValue);
        onSelect?.(place);

        // ✅ reposition après sélection
        setTimeout(positionPac, 0);
      });

      autocompleteRef.current = ac;

      // ✅ première capture + position
      setTimeout(() => {
        getLatestPac();
        positionPac();
      }, 0);
    };

    init();

    // ✅ MutationObserver : dès qu’un pac-container apparaît → on le capte + positionne
    observerRef.current = new MutationObserver(() => {
      const pac = getLatestPac();
      if (pac) positionPac();
    });
    observerRef.current.observe(document.body, { childList: true, subtree: true });

    // ✅ events iOS
    const onFocus = () => {
      // important: recapter le bon pac à chaque focus (pickup vs dropoff)
      setTimeout(() => {
        getLatestPac();
        positionPac();
      }, 0);
    };

    const onInput = () => setTimeout(positionPac, 0);

    input.addEventListener("focus", onFocus);
    input.addEventListener("input", onInput);

    window.addEventListener("scroll", positionPac, true);
    window.addEventListener("resize", positionPac);

    // ✅ event global quand Google Maps charge
    const handler = () => {
      init();
      setTimeout(() => {
        getLatestPac();
        positionPac();
      }, 0);
    };
    window.addEventListener("google-maps-loaded", handler);

    return () => {
      input.removeEventListener("focus", onFocus);
      input.removeEventListener("input", onInput);
      window.removeEventListener("scroll", positionPac, true);
      window.removeEventListener("resize", positionPac);
      window.removeEventListener("google-maps-loaded", handler);

      observerRef.current?.disconnect?.();
      observerRef.current = null;

      // (optionnel) nettoyage
      autocompleteRef.current = null;
      pacRef.current = null;
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
