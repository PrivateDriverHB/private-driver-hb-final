// Règles tarifaires centralisées

function isSwissAddress(str = "") {
  const s = str.toLowerCase();
  return (
    s.includes("suisse") ||
    s.includes("switzerland") ||
    s.includes("ch-") ||
    s.includes("genève") ||
    s.includes("geneva")
  );
}

export function calculatePrice({ distanceKm, origin, destination }) {
  const hasSwiss = isSwissAddress(origin) || isSwissAddress(destination);

  let ratePerKm = 2; // France
  let minPrice = 0;

  if (hasSwiss) {
    minPrice = 50;
    ratePerKm = distanceKm > 50 ? 4 : 3.5;
  }

  const rawPrice = distanceKm * ratePerKm;
  const total = Math.max(minPrice, rawPrice);

  return {
    hasSwiss,
    distanceKm: Number(distanceKm.toFixed(1)),
    ratePerKm,
    minPrice,
    total: Number(total.toFixed(2)),
    currency: "EUR",
  };
}
