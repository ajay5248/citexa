import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create your account | Citexa-AI",
  description: "Create a free Citexa-AI account.",
  alternates: { canonical: "/register" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/register", title: "Create your account | Citexa-AI", description: "Create a free Citexa-AI account." },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
