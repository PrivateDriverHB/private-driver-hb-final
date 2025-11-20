import { redirect } from "next/navigation";

// Cette page sert juste de pont : /reservation/success -> /fr/reservation/success
export default function LegacySuccessRedirect({ searchParams }) {
  // On reconstruit la query string ?session_id=...&cid=...
  const qs = new URLSearchParams(searchParams).toString();
  const target = `/fr/reservation/success${qs ? `?${qs}` : ""}`;

  redirect(target);
}
