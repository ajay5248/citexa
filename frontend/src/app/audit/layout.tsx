import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Free AI Visibility Check | Citexa-AI",
  description: "Request a free, manual check of whether ChatGPT, Gemini and Perplexity recommend your business, with the top fixes to make.",
  alternates: { canonical: "/audit" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/audit", title: "Free AI Visibility Check | Citexa-AI", description: "Request a free, manual check of whether ChatGPT, Gemini and Perplexity recommend your business, with the top fixes to make." },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
