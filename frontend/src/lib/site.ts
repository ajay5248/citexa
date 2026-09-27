// Single source of truth for the public site URL and contact channels.
// Contact channels are only shown when configured, so the site never
// advertises an address that can't receive messages.
export const SITE_URL = "https://www.citexa.online";

// e.g. "hello@citexa.online" — set only once the mailbox actually receives mail
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";

// Digits only, with country code, e.g. "919876543210"
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

// e.g. a Cal.com or Calendly link for 15-minute calls
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "";

export const whatsappLink = (text: string) =>
  WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}` : "";

// Backend base URL: local dev goes through the Next.js /api proxy, production calls Render directly
export const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1"))
    ? "/api"
    : "https://citexa.onrender.com");

// Direct UPI payments, used when Razorpay isn't set up yet, e.g. "yourname@okhdfcbank"
export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "";
export const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME || "Citexa-AI";

// Opens the buyer's UPI app with the payee and amount filled in (works on phones)
// The UPI ID is left unencoded because some UPI apps don't decode "%40" back to "@"
export const upiLink = (amountInr: number, note: string) =>
  `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amountInr.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note.slice(0, 50))}`;
