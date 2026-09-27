import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact | Citexa-AI",
  description: "Talk to Citexa-AI about your AI search visibility. Send a message or book a 15-minute call.",
  alternates: { canonical: "/contact" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/contact", title: "Contact | Citexa-AI", description: "Talk to Citexa-AI about your AI search visibility. Send a message or book a 15-minute call." },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
