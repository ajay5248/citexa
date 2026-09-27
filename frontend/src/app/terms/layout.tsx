import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms of Service | Citexa-AI",
  description: "The terms for using Citexa-AI.",
  alternates: { canonical: "/terms" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/terms", title: "Terms of Service | Citexa-AI", description: "The terms for using Citexa-AI." },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
