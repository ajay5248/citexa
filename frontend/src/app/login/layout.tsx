import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Log in | Citexa-AI",
  description: "Log in to your Citexa-AI account.",
  alternates: { canonical: "/login" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/login", title: "Log in | Citexa-AI", description: "Log in to your Citexa-AI account." },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
