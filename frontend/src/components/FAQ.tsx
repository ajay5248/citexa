"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Citexa?",
    answer: "Citexa is an AI Search Visibility and Answer Engine Optimization (AEO) platform. It helps businesses track, audit, and improve how their brand is recommended and cited across Generative AI search systems like ChatGPT, Google Gemini, Claude, Perplexity, and Microsoft Copilot.",
  },
  {
    question: "How does Answer Engine Optimization (AEO) work?",
    answer: "AEO is the practice of optimizing web content for AI search engines. Unlike traditional SEO (which targets keyword rankings in blue links), AEO focuses on structuring information, schema markups, and factual query matching so that LLMs can easily retrieve, synthesize, and source your content.",
  },
  {
    question: "Why is AI Search Visibility important for businesses?",
    answer: "AI search engines and AI Overviews provide direct answers, reducing the need for users to click on external links. If your business is not cited as a source or recommended in these AI answers, you lose traffic and customers. Citexa helps ensure your brand remains highly visible in the era of AI-driven search.",
  },
  {
    question: "How can I run a free AI Search Visibility audit for my site?",
    answer: "You can sign up on Citexa and enter your website's URL. Our engine will crawl your pages, evaluate your schema structure, check readability, and simulate AI search queries to generate a comprehensive AI Search Visibility audit report with actionable fixes.",
  },
];

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section className="w-full py-32 bg-transparent relative border-t border-white/[0.02] overflow-hidden">
      {/* FAQ Schema Markup for Google AI Overview Crawling */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/5 px-3.5 py-1 text-xs text-blue-400 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)] uppercase tracking-widest font-bold font-mono">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl text-white drop-shadow-lg">
              Answer Engine <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">FAQ</span>
            </h2>
            <p className="max-w-[900px] text-gray-400 md:text-xl font-light">
              Learn how Citexa helps prepare your digital footprint for the future of search.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl hover:border-blue-500/20 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-6 px-8 flex items-center justify-between text-left group"
                >
                  <span className="text-lg md:text-xl font-medium text-gray-200 group-hover:text-white transition-colors">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="p-1 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-colors"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-8 pb-6 text-gray-400 font-light text-base md:text-lg leading-relaxed border-t border-white/[0.03] pt-4 bg-black/20">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
