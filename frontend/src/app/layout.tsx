import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BackgroundWrapper } from "@/components/BackgroundWrapper";
import { SITE_URL, CONTACT_EMAIL } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  verification: {
    google: "ZeCO4ktJ1U1njavxnFKHwx0FScUqSptpU6bE2rD1cR4",
  },
  title: "Citexa-AI | AI Search Visibility Platform",
  description: "Find out whether ChatGPT, Gemini and Perplexity recommend your business. Citexa-AI checks your AI search visibility and helps you fix the gaps.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Citexa-AI | AI Search Visibility Platform',
    description: 'Find out whether ChatGPT, Gemini and Perplexity recommend your business, and fix the gaps.',
    siteName: 'Citexa-AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Citexa-AI | AI Search Visibility',
    description: 'Find out whether ChatGPT, Gemini and Perplexity recommend your business, and fix the gaps.',
  },
  authors: [
    {
      name: "Ajay Adhikari",
      url: `${SITE_URL}/about`,
    }
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "Citexa-AI",
      "url": `${SITE_URL}`,
      "logo": {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        "url": `${SITE_URL}/logo.png`,
        "contentUrl": `${SITE_URL}/logo.png`,
        "caption": "Citexa-AI Logo"
      },
      "image": {
        "@id": `${SITE_URL}/#logo`
      },
      "founder": {
        "@type": "Person",
        "@id": `${SITE_URL}/#founder`,
        "name": "Ajay Adhikari",
        "jobTitle": "Founder & CEO",
        "url": `${SITE_URL}/about`,
        ...(CONTACT_EMAIL ? { "email": CONTACT_EMAIL } : {}),
        "sameAs": [
          "https://github.com/ajay5248",
          "https://www.linkedin.com/in/ajay-adhikari-419a3b320/"
        ],
        "knowsAbout": [
          "Artificial Intelligence",
          "Machine Learning",
          "Answer Engine Optimization",
          "Search Engine Optimization",
          "AEO",
          "AI Search Optimization",
          "Generative AI",
          "Web Development"
        ]
      },
      "foundingDate": "2026",
      "legalName": "Citexa-AI Technologies",
      ...(CONTACT_EMAIL ? {
        "email": CONTACT_EMAIL,
        "contactPoint": {
          "@type": "ContactPoint",
          "email": CONTACT_EMAIL,
          "contactType": "customer support",
          "url": `${SITE_URL}/contact`
        },
      } : {}),
      "sameAs": [
        "https://linkedin.com/company/citexa-ai"
      ],
      "description": "Citexa-AI helps businesses improve visibility across AI search engines through Answer Engine Optimization.",
      "knowsAbout": [
        "Answer Engine Optimization",
        "AEO",
        "AI Search Visibility",
        "Search Engine Optimization",
        "SEO",
        "Artificial Intelligence",
        "Large Language Models"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": `${SITE_URL}`,
      "name": "Citexa-AI",
      "description": "AI Search Visibility Platform",
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      }
    }
  ]
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "478451688381-jf3a7edng18f93kr83s4f21j865cmkkc.apps.googleusercontent.com";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <JsonLd data={jsonLd} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <BackgroundWrapper />
          <GoogleOAuthProvider clientId={clientId}>
            <div className="relative z-10">
              {children}
            </div>
          </GoogleOAuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
