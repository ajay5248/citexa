import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Founder } from "@/components/Founder";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Citexa-AI",
    type: "website",
    url: "/",
    title: "Citexa-AI | AI Search Visibility Platform",
    description: "Find out whether ChatGPT, Gemini and Perplexity recommend your business, and fix the gaps.",
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Founder />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

