"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, CheckCircle2, Copy, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PLANS, formatInr, type Plan } from "@/lib/plans";
import { paymentsEnabled, startCheckout } from "@/lib/razorpay";
import { submitLead } from "@/lib/leads";
import { UPI_ID, upiLink, whatsappLink } from "@/lib/site";

const freeFeatures = [
  "What ChatGPT, Gemini and Perplexity say about your business",
  "Quick check of your schema markup and FAQs",
  "Top 3 fixes, sent within 2 working days",
];

const PLAN_GROUPS = [
  { billing: "one-time", title: "One-time", subtitle: "Pay once. Start with the report, or have us fix everything." },
  { billing: "monthly", title: "Monthly", subtitle: "Ongoing checks so you can see whether AI starts recommending you." },
] as const;

const FEATURED_PLAN: Plan["id"] = "audit_fix";

export default function PricingPage() {
  const [canPay, setCanPay] = useState(false);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [buyer, setBuyer] = useState({ name: "", email: "", phone: "", website: "" });
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [paidPlan, setPaidPlan] = useState<Plan | null>(null);
  // Set once a UPI order is saved; the modal then shows payment instructions
  const [upiOrder, setUpiOrder] = useState<Plan | null>(null);
  const [copied, setCopied] = useState(false);
  // Razorpay when it's configured, otherwise direct UPI if a UPI ID is set, otherwise contact us
  const canOrder = canPay || Boolean(UPI_ID);

  useEffect(() => {
    paymentsEnabled().then(setCanPay);
  }, []);

  const update = (field: keyof typeof buyer) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setBuyer({ ...buyer, [field]: e.target.value });

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setError("");
    setPaying(true);
    try {
      if (!canPay) {
        await submitLead({
          ...buyer,
          message: `UPI order: ${selected.name} (${formatInr(selected.priceInr)}${selected.billing === "monthly" ? "/month" : ""})`,
          source: "order",
        });
        setUpiOrder(selected);
        return;
      }
      const result = await startCheckout(selected, buyer);
      if (result) {
        setPaidPlan(selected);
        setSelected(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "The payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground relative overflow-hidden">
      <Navbar />

      <main className="flex-1 pt-24 relative z-10">
        <div className="py-16 md:py-24 relative flex flex-col items-center justify-center">
          <div className="container px-4 md:px-6 mx-auto relative z-10 flex flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="text-[2.75rem] sm:text-[4rem] md:text-[5rem] font-black tracking-tighter leading-[1.05] mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50">
                Simple pricing
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-[700px] mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed"
            >
              Start with a free check. If AI isn&apos;t recommending you, we fix it once, then keep checking every month if you want us to.
            </motion.p>
          </div>
        </div>

        {paidPlan && (
          <div className="container px-4 md:px-6 mx-auto max-w-3xl mb-10">
            <div className="flex gap-4 items-start rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
              <div>
                <h2 className="font-bold text-white">Payment received. Thank you!</h2>
                <p className="text-sm text-gray-300">
                  You&apos;ve bought {paidPlan.name}. Razorpay has emailed your receipt, and we&apos;ll contact you within 1 working day to get started.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Free check */}
        <div className="container px-4 md:px-6 mx-auto max-w-5xl mb-14">
          <div className="rounded-[2rem] p-6 md:p-8 bg-zinc-950/60 backdrop-blur-2xl border border-green-500/20 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">Free AI Visibility Check <span className="text-green-400">₹0</span></h2>
              <p className="text-gray-400 mb-3">See where you stand before you spend anything.</p>
              <ul className="flex flex-col lg:flex-row lg:flex-wrap gap-x-6 gap-y-2">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-gray-300"><Check className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-green-400" /> {feature}</li>
                ))}
              </ul>
            </div>
            <Link href="/audit" className="md:w-56 shrink-0">
              <Button variant="outline" className="w-full h-12 text-base font-bold rounded-xl border-white/15 hover:bg-white/10 text-white">
                Get my free check
              </Button>
            </Link>
          </div>
        </div>

        {PLAN_GROUPS.map((group) => (
          <section key={group.billing} className="container px-4 md:px-6 mx-auto max-w-5xl pb-14" aria-labelledby={`plans-${group.billing}`}>
            <h2 id={`plans-${group.billing}`} className="text-xl font-bold text-white mb-1">{group.title}</h2>
            <p className="text-gray-400 mb-6">{group.subtitle}</p>
            <div className="grid md:grid-cols-2 gap-8">
              {PLANS.filter((plan) => plan.billing === group.billing).map((plan) => {
                const featured = plan.id === FEATURED_PLAN;
                return (
                  <div
                    key={plan.id}
                    className={`w-full h-full rounded-[2rem] p-8 backdrop-blur-2xl flex flex-col relative ${featured ? "bg-zinc-950/80 border border-blue-500/40 shadow-[0_0_40px_rgba(43,136,255,0.15)]" : "bg-zinc-950/60 border border-white/10"}`}
                  >
                    {featured && (
                      <div className="absolute top-4 right-4 bg-[#2b88ff] text-white px-3 py-1 rounded-full text-xs font-black tracking-wider">
                        MOST POPULAR
                      </div>
                    )}
                    <h3 className={`text-2xl font-bold text-white mb-2 ${featured ? "pr-28" : ""}`}>{plan.name}</h3>
                    <p className="text-gray-400">{plan.description}</p>
                    <div className="mt-6 mb-8 text-5xl font-black text-white">
                      {formatInr(plan.priceInr)}
                      <span className="text-lg text-gray-500 font-normal">{plan.billing === "monthly" ? "/month" : " one-time"}</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start text-gray-300"><Check className="h-5 w-5 mr-3 mt-0.5 shrink-0 text-blue-400" /> {feature}</li>
                      ))}
                    </ul>
                    {canOrder ? (
                      <Button
                        onClick={() => { setError(""); setUpiOrder(null); setSelected(plan); }}
                        className={`w-full h-12 text-base font-bold rounded-xl ${featured ? "bg-[#2b88ff] hover:bg-blue-600 text-white" : ""}`}
                      >
                        {plan.billing === "monthly" ? "Subscribe" : "Buy now"}
                      </Button>
                    ) : (
                      <Link href="/contact" className="w-full">
                        <Button className="w-full h-12 text-base font-bold rounded-xl">Talk to us to get started</Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <div className="container px-4 md:px-6 mx-auto max-w-3xl pb-32 text-center text-sm text-gray-500 space-y-2">
          <p>
            {canPay
              ? "Payments are processed securely by Razorpay (UPI, cards, net banking). Monthly plans renew automatically and you can cancel any time."
              : "Pay by UPI. We confirm your payment and start work within 1 working day. Monthly plans are billed each month and you can cancel any time."}
          </p>
          <p>
            AI answers change from one question to the next, so no one can guarantee a recommendation. We guarantee the work and a before-and-after report.
            The Citexa-AI dashboard stays free during beta. <Link href="/register" className="text-primary hover:underline">Create a free account</Link>.
          </p>
        </div>
      </main>

      {/* Buyer details, collected before opening Razorpay Checkout */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4"
            onClick={() => !paying && setSelected(null)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-title"
              className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelected(null)} disabled={paying} className="absolute top-4 right-4 text-gray-400 hover:text-white" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
              <h2 id="checkout-title" className="text-xl font-bold text-white mb-1">{selected.name}</h2>
              <p className="text-gray-400 text-sm mb-6">
                {formatInr(selected.priceInr)}{selected.billing === "monthly" ? " per month" : " one-time"}
              </p>
              {upiOrder ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">Your order is saved. Pay <span className="text-white font-bold">{formatInr(upiOrder.priceInr)}</span> by UPI to:</p>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="flex-1 font-mono text-white break-all">{UPI_ID}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { navigator.clipboard?.writeText(UPI_ID).then(() => setCopied(true)).catch(() => {}); }}
                    >
                      <Copy className="h-4 w-4 mr-1" /> {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <a href={upiLink(upiOrder.priceInr, `Citexa-AI ${upiOrder.name}`)} className="block md:hidden">
                    <Button type="button" className="w-full h-12 rounded-xl text-base font-bold bg-[#2b88ff] hover:bg-blue-600 text-white">Open UPI app</Button>
                  </a>
                  <p className="text-sm text-gray-400">
                    After paying, send the payment screenshot or UTR number
                    {whatsappLink("") ? <> on <a href={whatsappLink(`Hi, I've paid ${formatInr(upiOrder.priceInr)} for ${upiOrder.name}. Name: ${buyer.name}`)} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">WhatsApp</a></> : <> through our <Link href="/contact" className="text-primary underline">contact page</Link></>}.
                    We&apos;ll confirm and start within 1 working day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePay} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="buyer-name" className="text-sm font-medium text-gray-300">Your name</label>
                    <Input id="buyer-name" required maxLength={100} value={buyer.name} onChange={update("name")} className="h-11 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="buyer-email" className="text-sm font-medium text-gray-300">Email</label>
                    <Input id="buyer-email" type="email" required value={buyer.email} onChange={update("email")} className="h-11 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="buyer-phone" className="text-sm font-medium text-gray-300">Phone / WhatsApp</label>
                    <Input id="buyer-phone" type="tel" required minLength={8} maxLength={20} placeholder="+91 98765 43210" value={buyer.phone} onChange={update("phone")} className="h-11 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="buyer-website" className="text-sm font-medium text-gray-300">Website</label>
                    <Input id="buyer-website" type="url" required placeholder="https://yourwebsite.com" value={buyer.website} onChange={update("website")} className="h-11 text-white" />
                  </div>
                  {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
                  <Button type="submit" disabled={paying} className="w-full h-12 rounded-xl text-base font-bold bg-[#2b88ff] hover:bg-blue-600 text-white">
                    {paying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait…</> : `Continue to pay ${formatInr(selected.priceInr)}`}
                  </Button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
