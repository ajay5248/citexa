import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { MiniAudit } from "@/components/MiniAudit";
import { Founder } from "@/components/Founder";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

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

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      "url": SITE_URL,
      "name": "Citexa-AI | AI Search Visibility Platform",
      "description": "Find out whether ChatGPT, Gemini and Perplexity recommend your business, and fix the gaps.",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": { "@id": `${SITE_URL}/#organization` },
      "inLanguage": "en"
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      "name": "Citexa-AI",
      "url": SITE_URL,
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Answer Engine Optimization",
      "operatingSystem": "Web",
      "description": "Checks how visible a business is in AI search engines such as ChatGPT, Gemini and Perplexity, and generates schema markup and FAQ content to fix the gaps.",
      "publisher": { "@id": `${SITE_URL}/#organization` },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
        "description": "Free during public beta",
        "url": `${SITE_URL}/pricing`
      }
    }
  ]
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <JsonLd data={homeSchema} />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MiniAudit />
        <HowItWorks />
        <Founder />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

