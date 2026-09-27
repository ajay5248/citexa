import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Blog | Citexa-AI",
  description: "Practical guides on Answer Engine Optimization (AEO), schema markup and getting cited in AI search.",
  alternates: { canonical: "/blog" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/blog", title: "Blog | Citexa-AI", description: "Practical guides on Answer Engine Optimization (AEO), schema markup and getting cited in AI search." },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
