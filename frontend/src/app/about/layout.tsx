import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About | Citexa-AI",
  description: "Who we are and why we help businesses get recommended by AI search engines like ChatGPT, Gemini and Perplexity.",
  alternates: { canonical: "/about" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/about", title: "About | Citexa-AI", description: "Who we are and why we help businesses get recommended by AI search engines like ChatGPT, Gemini and Perplexity." },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
