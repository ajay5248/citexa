import { getApiUrl } from "@/lib/site";

export interface LeadInput {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  message?: string;
  source: "contact" | "free-audit" | "order";
  nickname?: string;
}

// Sends a contact form / free audit request to the backend.
export async function submitLead(lead: LeadInput) {
  // Send empty optional fields as absent so the backend's validation treats them as missing
  const body = Object.fromEntries(Object.entries(lead).filter(([, value]) => value !== ""));

  const res = await fetch(`${getApiUrl()}/contact`, {
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
