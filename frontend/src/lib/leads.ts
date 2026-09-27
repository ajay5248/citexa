const apiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1"))
    ? "/api"
    : "https://citexa.onrender.com");

export interface LeadInput {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  message?: string;
  source: "contact" | "free-audit";
  nickname?: string;
}

// Sends a contact form / free audit request to the backend.
export async function submitLead(lead: LeadInput) {
  // Send empty optional fields as absent so the backend's validation treats them as missing
  const body = Object.fromEntries(Object.entries(lead).filter(([, value]) => value !== ""));

  const res = await fetch(`${apiUrl()}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? String(detail[0]?.msg || "").replace(/^Value error, /, "")
      : typeof detail === "string" ? detail : "";
    throw new Error(message || "Something went wrong. Please try again.");
  }
}
