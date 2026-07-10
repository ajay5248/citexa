import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BackgroundWrapper } from "@/components/BackgroundWrapper";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  verification: {
    google: "ZeCO4ktJ1U1njavxnFKHwx0FScUqSptpU6bE2rD1cR4",
  },
  title: "Citexa-AI | AI Search Visibility Platform",
  description: "Citexa-AI helps businesses improve visibility across ChatGPT, Gemini, Claude, Perplexity, Copilot and Google AI Overviews through AI Search Optimization and Answer Engine Optimization.",
  metadataBase: new URL('https://citexa-ai.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Citexa-AI | AI Search Visibility Platform',
    description: 'Optimize your website for ChatGPT, Gemini, and Claude.',
    url: 'https://citexa-ai.online',
    siteName: 'Citexa-AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Citexa-AI | AI Search Visibility',
    description: 'Optimize your website for ChatGPT, Gemini, and Claude.',
  },
  authors: [
    {
      name: "Ajay Adhikari",
      url: "https://citexa-ai.online",
    }
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://citexa-ai.online/#organization",
      "name": "Citexa-AI",
      "url": "https://citexa-ai.online",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://citexa-ai.online/#logo",
        "url": "https://citexa-ai.online/logo.png",
        "contentUrl": "https://citexa-ai.online/logo.png",
        "caption": "Citexa-AI Logo"
      },
      "image": {
        "@id": "https://citexa-ai.online/#logo"
      },
      "founder": {
        "@type": "Person",
        "@id": "https://citexa-ai.online/#founder",
        "name": "Ajay Adhikari",
        "jobTitle": "Founder & CEO",
        "url": "https://citexa-ai.online/about",
        "email": "ajay@citexa-ai.com",
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "B.Tech in Computer Science and Engineering (Artificial Intelligence and Machine Learning)"
        },
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
      "email": "support@citexa-ai.online",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@citexa-ai.online",
        "contactType": "customer support"
      },
      "sameAs": [
        "https://twitter.com/citexa-ai",
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
      "@id": "https://citexa-ai.online/#website",
      "url": "https://citexa-ai.online",
      "name": "Citexa-AI",
      "description": "AI Search Visibility Platform",
      "publisher": {
        "@id": "https://citexa-ai.online/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://citexa-ai.online/#webpage",
      "url": "https://citexa-ai.online",
      "name": "Citexa-AI | AI Search Visibility Platform",
      "isPartOf": {
        "@id": "https://citexa-ai.online/#website"
      },
      "about": {
        "@id": "https://citexa-ai.online/#organization"
      },
      "description": "Citexa-AI helps businesses improve visibility across ChatGPT, Gemini, Claude, Perplexity, Copilot and Google AI Overviews through AI Search Optimization and Answer Engine Optimization."
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
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
