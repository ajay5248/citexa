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
  title: "Citexa | AI Search Visibility Platform",
  description: "Citexa helps businesses improve visibility across ChatGPT, Gemini, Claude, Perplexity, Copilot and Google AI Overviews through AI Search Optimization and Answer Engine Optimization.",
  metadataBase: new URL('https://citexa.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Citexa | AI Search Visibility Platform',
    description: 'Optimize your website for ChatGPT, Gemini, and Claude.',
    url: 'https://citexa.online',
    siteName: 'Citexa',
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
    title: 'Citexa | AI Search Visibility',
    description: 'Optimize your website for ChatGPT, Gemini, and Claude.',
  },
  authors: [
    {
      name: "Ajay Adhikari",
      url: "https://citexa.online",
    }
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://citexa.online/#organization",
      "name": "Citexa",
      "url": "https://citexa.online",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://citexa.online/#logo",
        "url": "https://citexa.online/logo.png",
        "contentUrl": "https://citexa.online/logo.png",
        "caption": "Citexa Logo"
      },
      "image": {
        "@id": "https://citexa.online/#logo"
      },
      "founder": {
        "@type": "Person",
        "@id": "https://citexa.online/#founder",
        "name": "Ajay Adhikari",
        "jobTitle": "Founder & CEO",
        "url": "https://citexa.online/about",
        "email": "ajay@citexa.com",
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
      "legalName": "Citexa Technologies",
      "email": "support@citexa.online",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@citexa.online",
        "contactType": "customer support"
      },
      "sameAs": [
        "https://twitter.com/citexa",
        "https://linkedin.com/company/citexa"
      ],
      "description": "Citexa helps businesses improve visibility across AI search engines through Answer Engine Optimization.",
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
      "@id": "https://citexa.online/#website",
      "url": "https://citexa.online",
      "name": "Citexa",
      "description": "AI Search Visibility Platform",
      "publisher": {
        "@id": "https://citexa.online/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://citexa.online/#webpage",
      "url": "https://citexa.online",
      "name": "Citexa | AI Search Visibility Platform",
      "isPartOf": {
        "@id": "https://citexa.online/#website"
      },
      "about": {
        "@id": "https://citexa.online/#organization"
      },
      "description": "Citexa helps businesses improve visibility across ChatGPT, Gemini, Claude, Perplexity, Copilot and Google AI Overviews through AI Search Optimization and Answer Engine Optimization."
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
