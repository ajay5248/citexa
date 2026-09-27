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
