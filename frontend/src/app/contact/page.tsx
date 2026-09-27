"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock, CheckCircle2, Loader2, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { submitLead } from "@/lib/leads";
import { BOOKING_URL, CONTACT_EMAIL, whatsappLink } from "@/lib/site";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "", message: "", nickname: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const whatsapp = whatsappLink("Hi Citexa-AI, I'd like to know more about AI search visibility for my business.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email && !form.phone) {
      setError("Please add an email address or a WhatsApp number so we can reply.");
      return;
    }
    setSubmitting(true);
    try {
      await submitLead({ ...form, source: "contact" });
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

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60%] h-[50%] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />

      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-4">Talk to us</h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Questions about AI search visibility, or want us to look at your business? Send a message and we&apos;ll reply within 1 working day.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Direct channels */}
            <div className="lg:col-span-2 space-y-4">
              {BOOKING_URL && (
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="flex gap-4 items-start bg-card/40 backdrop-blur-xl border border-white/10 hover:border-primary/40 rounded-2xl p-6 transition-colors">
                  <CalendarClock className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h2 className="font-bold text-white">Book a 15-minute call</h2>
                    <p className="text-sm text-gray-400">We&apos;ll check live what AI says about your business.</p>
                  </div>
                </a>
              )}
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex gap-4 items-start bg-card/40 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 rounded-2xl p-6 transition-colors">
                  <MessageCircle className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div>
                    <h2 className="font-bold text-white">Chat on WhatsApp</h2>
                    <p className="text-sm text-gray-400">The fastest way to reach us.</p>
                  </div>
                </a>
              )}
              {CONTACT_EMAIL && (
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex gap-4 items-start bg-card/40 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 rounded-2xl p-6 transition-colors">
                  <Mail className="h-6 w-6 text-indigo-400 shrink-0" />
                  <div>
                    <h2 className="font-bold text-white">Email</h2>
                    <p className="text-sm text-gray-400">{CONTACT_EMAIL}</p>
                  </div>
                </a>
              )}
              <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="font-bold text-white mb-1">Want a free check instead?</h2>
                <p className="text-sm text-gray-400 mb-3">We&apos;ll look at what ChatGPT, Gemini and Perplexity say about your business.</p>
                <Link href="/audit" className="text-sm font-semibold text-primary hover:underline">Request a free AI visibility check →</Link>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 space-y-4">
                  <CheckCircle2 className="h-14 w-14 text-emerald-400" />
                  <h2 className="text-2xl font-black text-white">Message sent</h2>
                  <p className="text-gray-400">Thanks, {form.name.split(" ")[0]}. We&apos;ll get back to you within 1 working day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card/50 backdrop-blur border border-border/50 p-6 md:p-8 rounded-3xl shadow-2xl space-y-4">
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
                  <p className="text-xs text-gray-500">Add an email or a WhatsApp number (or both) so we can reply.</p>
                  <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium text-gray-300">Website <span className="text-gray-500">(optional)</span></label>
                    <Input id="website" type="url" placeholder="https://yourwebsite.com" value={form.website} onChange={update("website")} className="h-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                    <Textarea id="message" required maxLength={2000} rows={5} placeholder="How can we help?" value={form.message} onChange={update("message")} className="text-white min-h-32" />
                  </div>
                  {/* Honeypot field: hidden from people, filled in by bots */}
                  <input type="text" name="nickname" tabIndex={-1} autoComplete="off" value={form.nickname} onChange={update("nickname")} className="hidden" aria-hidden="true" />

                  {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

                  <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl text-base">
                    {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
