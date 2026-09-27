import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pricing | Citexa-AI",
  description: "Citexa-AI is free during public beta. See what's included and what's coming.",
  alternates: { canonical: "/pricing" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/pricing", title: "Pricing | Citexa-AI", description: "Citexa-AI is free during public beta. See what's included and what's coming." },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
