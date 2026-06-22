import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BackgroundWrapper } from "@/components/BackgroundWrapper";
const inter = Inter({ subsets: ["latin"] });

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
  "@type": "Organization",
  "name": "Citexa",
  "url": "https://citexa.online",
  "logo": "https://citexa.online/logo.png",
  "founder": {
    "@type": "Person",
    "name": "Ajay Adhikari",
    "jobTitle": "Founder & CEO"
  },
  "sameAs": [
    "https://twitter.com/citexa",
    "https://linkedin.com/company/citexa"
  ],
  "description": "Citexa helps businesses improve visibility across AI search engines through Answer Engine Optimization."
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
