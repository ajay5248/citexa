import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Services | Citexa-AI",
  description: "AI visibility audits, schema markup, FAQ optimization and competitor comparisons for AI search.",
  alternates: { canonical: "/services" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/services", title: "Services | Citexa-AI", description: "AI visibility audits, schema markup, FAQ optimization and competitor comparisons for AI search." },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
