import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { PLANS } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing | Citexa-AI",
  description: "Free AI visibility check. One-time AI Visibility Report ₹2,999 or Audit + Fix ₹14,999. Monthly plans from ₹2,499/month.",
  alternates: { canonical: "/pricing" },
  openGraph: { siteName: "Citexa-AI", type: "website", images: ["/opengraph-image"], url: "/pricing", title: "Pricing | Citexa-AI", description: "Free AI visibility check. One-time AI Visibility Report ₹2,999 or Audit + Fix ₹14,999. Monthly plans from ₹2,499/month." },
};

const pricingSchema = {
  "@context": "https://schema.org",
  "@graph": PLANS.map((plan) => ({
    "@type": "Product",
    "@id": `${SITE_URL}/pricing#${plan.id}`,
    "name": plan.name,
    "description": plan.description,
    "brand": { "@id": `${SITE_URL}/#organization` },
    "category": "Answer Engine Optimization service",
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/pricing`,
      "priceCurrency": "INR",
      "price": String(plan.priceInr),
      "availability": "https://schema.org/InStock",
      "seller": { "@id": `${SITE_URL}/#organization` },
      ...(plan.billing === "monthly"
        ? {
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": String(plan.priceInr),
              "priceCurrency": "INR",
              "unitCode": "MON",
              "referenceQuantity": { "@type": "QuantitativeValue", "value": 1, "unitCode": "MON" }
            }
          }
        : {})
    }
  }))
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={pricingSchema} />
      {children}
    </>
  );
}
