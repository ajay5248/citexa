// Paid packages shown on the pricing page and in structured data.
// Amounts charged are defined on the backend (backend/routers/payments.py); keep the two in sync.
export interface Plan {
  id: "report" | "audit_fix" | "starter_monthly" | "monthly";
  name: string;
  priceInr: number;
  billing: "one-time" | "monthly";
  description: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "report",
    name: "AI Visibility Report",
    priceInr: 2999,
    billing: "one-time",
    description: "Find out exactly where you stand, with a fix list you can follow yourself.",
    features: [
      "10 customer questions checked on ChatGPT, Gemini and Perplexity",
      "Who AI recommends instead of you",
      "Website check: schema markup, FAQs and AI crawler access",
      "Written, prioritised fix list for you or your developer",
      "Price credited if you upgrade to Audit + Fix",
    ],
  },
  {
    id: "audit_fix",
    name: "AI Visibility Audit + Fix",
    priceInr: 14999,
    billing: "one-time",
    description: "We find out what AI says about your business and fix the gaps on your website.",
    features: [
      "10 customer questions checked on ChatGPT, Gemini and Perplexity",
      "Website review: schema markup, FAQs, business details, AI crawler access",
      "Ready-to-add schema markup (JSON-LD) and FAQ content",
      "Google Business Profile and listings review",
      "Re-check after 30 days with a before-and-after report",
    ],
  },
  {
    id: "starter_monthly",
    name: "Monthly Starter",
    priceInr: 2499,
    billing: "monthly",
    description: "A light monthly check to see whether AI starts naming you.",
    features: [
      "Monthly re-check of 5 customer questions on ChatGPT, Gemini and Perplexity",
      "Short monthly report: what changed and what to try next",
      "Cancel any time",
    ],
  },
  {
    id: "monthly",
    name: "Monthly AI Visibility Monitoring",
    priceInr: 7499,
    billing: "monthly",
    description: "Keep checking what AI says about you, and keep improving.",
    features: [
      "Monthly re-check of your customer questions on ChatGPT, Gemini and Perplexity",
      "Short monthly report: what changed and what to do next",
      "New FAQ and schema updates as your business changes",
      "Competitor comparison each month",
      "Cancel any time",
    ],
  },
];

export const formatInr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
