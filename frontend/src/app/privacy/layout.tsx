import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy | Citexa-AI",
  description: "How Citexa-AI collects, uses and protects your data.",
  alternates: { canonical: "/privacy" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/privacy", title: "Privacy Policy | Citexa-AI", description: "How Citexa-AI collects, uses and protects your data." },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
