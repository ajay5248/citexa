"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, CheckCircle2, MessageSquare, Code, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { submitLead } from "@/lib/leads";

const deliverables = [
  {
    icon: MessageSquare,
    title: "What AI says about you",
    description: "We ask ChatGPT, Gemini and Perplexity the questions your customers ask, and show you who gets recommended.",
  },
  {
    icon: Code,
    title: "Website check",
    description: "We check your schema markup, FAQs, business details and whether AI crawlers can read your site.",
  },
  {
    icon: ListChecks,
    title: "Top 3 fixes",
    description: "A short, prioritised list of what to change first, in plain language.",
  },
];

export default function FreeAuditPage() {
  const [form, setForm] = useState({ website: "", name: "", email: "", phone: "", message: "", nickname: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email && !form.phone) {
      setError("Please add an email address or a WhatsApp number so we can send your results.");
      return;
    }
    setSubmitting(true);
    try {
      await submitLead({ ...form, source: "free-audit" });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />

      <main className="flex-1 py-24 bg-background flex items-center justify-center relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl relative z-10">

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary backdrop-blur-sm mb-6">
                  <Search className="mr-2 h-4 w-4" />
                  <span>Free AI Visibility Check</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
                  Does AI recommend your business?
                </h1>
                <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                  Tell us your website and we&apos;ll check it by hand, then send you the results within 2 working days. Free, no account needed.
                </p>

                <form onSubmit={handleSubmit} className="bg-card/50 backdrop-blur border border-border/50 p-6 md:p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto text-left space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium text-gray-300">Website URL</label>
                    <Input id="website" type="url" required placeholder="https://yourwebsite.com" value={form.website} onChange={update("website")} className="h-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">Your name</label>
                    <Input id="name" required maxLength={100} placeholder="Your name" value={form.name} onChange={update("name")} className="h-12 text-white" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                      <Input id="email" type="email" placeholder="you@business.com" value={form.email} onChange={update("email")} className="h-12 text-white" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-300">WhatsApp number</label>
                      <Input id="phone" type="tel" maxLength={30} placeholder="+91 98765 43210" value={form.phone} onChange={update("phone")} className="h-12 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Add an email or a WhatsApp number (or both) so we can send your results.</p>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-300">What do customers search for to find a business like yours? <span className="text-gray-500">(optional)</span></label>
                    <Input id="message" maxLength={500} placeholder="e.g. best dentist in Noida" value={form.message} onChange={update("message")} className="h-12 text-white" />
                  </div>
                  {/* Honeypot field: hidden from people, filled in by bots */}
                  <input type="text" name="nickname" tabIndex={-1} autoComplete="off" value={form.nickname} onChange={update("nickname")} className="hidden" aria-hidden="true" />

                  {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

                  <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl text-base shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Get my free check"}
                  </Button>
                </form>

                <div className="mt-16 grid gap-6 md:grid-cols-3 text-left">
                  {deliverables.map((item) => (
                    <div key={item.title} className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <item.icon className="h-6 w-6 text-primary mb-3" />
                      <h2 className="font-bold text-white mb-1">{item.title}</h2>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto text-center bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 space-y-6"
              >
                <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto" />
                <h1 className="text-3xl font-black text-white">Request received</h1>
                <p className="text-gray-400 leading-relaxed">
                  Thanks, {form.name.split(" ")[0]}. We&apos;ll check <span className="text-white font-mono">{form.website}</span> by hand and send your results within 2 working days.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <Button variant="outline" className="border-white/10 hover:bg-white/10 text-white rounded-xl">Book a 15-minute call</Button>
                  </Link>
                  <Link href="/blog">
                    <Button variant="ghost" className="text-gray-300 rounded-xl">Read our guides</Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
      <Footer />
    </div>
  );
}
