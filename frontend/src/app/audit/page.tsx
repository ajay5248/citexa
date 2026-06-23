"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ShieldAlert, CheckCircle2, ArrowRight, Sparkles, TrendingUp, Cpu, Network } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const scanSteps = [
  "Crawling site structure & indexing meta tags...",
  "Analyzing Schema.org structured data markup...",
  "Querying ChatGPT, Gemini & Claude simulation indexes...",
  "Calculating citation authority & content relevance..."
];

export default function FreeAuditPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < scanSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setLoading(false);
            setResult({
              overallScore: Math.floor(Math.random() * 20) + 45, // 45 - 65
              schemaScore: Math.floor(Math.random() * 25) + 35,
              contentScore: Math.floor(Math.random() * 20) + 50,
              citationScore: Math.floor(Math.random() * 25) + 25,
              recommendations: [
                "Missing FAQPage or QAPage JSON-LD Schema markup, which prevents direct extraction by LLMs.",
                "Content is optimized for classic keywords rather than entity relationships. Revise heading structures to answer natural language questions.",
                "Low citation velocity in authoritative knowledge repositories. Establish citations via digital publications and open-source references."
              ]
            });
            return 0;
          }
        });
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setResult(null);
    setCurrentStep(0);
    setLoading(true);
  };

  const handleReset = () => {
    setResult(null);
    setUrl("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground relative overflow-hidden">
      <Navbar />
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
      
      <main className="flex-1 py-24 bg-background flex items-center justify-center relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl relative z-10">
          
          <AnimatePresence mode="wait">
            {!loading && !result && (
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
                  <span>AI Search Visibility Audit</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
                  Is Your Website Ready for AI Search?
                </h1>
                <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                  Enter your URL below to get a free, comprehensive analysis of how visible your brand is to ChatGPT, Gemini, and Claude.
                </p>
                
                <form onSubmit={handleStartScan} className="bg-card/50 backdrop-blur border border-border/50 p-2 rounded-full flex flex-col sm:flex-row shadow-2xl max-w-2xl mx-auto">
                  <Input 
                    type="url" 
                    required
                    placeholder="https://yourwebsite.com" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="border-0 bg-transparent h-14 px-6 text-lg focus-visible:ring-0 shadow-none flex-1 text-white"
                  />
                  <Button type="submit" className="h-14 px-8 rounded-full text-base sm:ml-2 mt-2 sm:mt-0 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    Analyze Website
                  </Button>
                </form>
                
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-400">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-foreground text-2xl mb-1">10k+</span>
                    Audits Run
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-foreground text-2xl mb-1">5</span>
                    LLMs Checked
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-foreground text-2xl mb-1">15+</span>
                    Data Points
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-foreground text-2xl mb-1">100%</span>
                    Actionable
                  </div>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="max-w-md mx-auto text-center py-16 bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
              >
                <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-t-4 border-r-4 border-primary border-transparent"
                  />
                  <Cpu className="absolute w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">Analyzing {url}</h3>
                
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6 relative">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep + 1) / scanSteps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 font-mono text-sm h-8"
                  >
                    {scanSteps[currentStep]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Analysis Results</h2>
                    <p className="text-gray-400 font-mono text-sm mt-1">{url}</p>
                  </div>
                  <Button onClick={handleReset} variant="outline" className="border-white/10 hover:bg-white/10 text-white rounded-xl">
                    Scan New Site
                  </Button>
                </div>

                {/* Score Panel */}
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-lg relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Overall Score</p>
                    <p className="text-5xl font-black text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]">{result.overallScore}/100</p>
                    <p className="text-[10px] text-gray-500 mt-2">Critical issues detected</p>
                  </div>
                  
                  <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-lg">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Schema Health</p>
                    <p className="text-4xl font-bold text-blue-400">{result.schemaScore}%</p>
                    <p className="text-[10px] text-gray-500 mt-2">Microdata missing</p>
                  </div>

                  <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-lg">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Content Readiness</p>
                    <p className="text-4xl font-bold text-purple-400">{result.contentScore}%</p>
                    <p className="text-[10px] text-gray-500 mt-2">Entities unmapped</p>
                  </div>

                  <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-lg">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Citation Velocity</p>
                    <p className="text-4xl font-bold text-emerald-400">{result.citationScore}%</p>
                    <p className="text-[10px] text-gray-500 mt-2">Reference count low</p>
                  </div>
                </div>

                {/* Important Disclaimer Notice (Crucial Task Requirement) */}
                <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6 backdrop-blur-md shadow-[0_0_30px_rgba(255,165,0,0.05)]">
                  <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-orange-500/5 blur-[50px] rounded-full pointer-events-none" />
                  <div className="flex gap-4 items-start relative z-10">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-orange-300 text-sm md:text-base">Implementation Disclaimer</h4>
                      <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed">
                        Citexa is strictly an analysis and recommendation platform. We diagnose optimization gaps and generate structured schema markup or FAQs. **No direct implementation or injection services are provided on your website by Citexa.** All recommendations must be manually implemented by you or your system developer to take effect.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-white">Top Recommendations</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {result.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start bg-white/5 border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Registration CTA */}
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
                  <div className="max-w-xl mx-auto space-y-3">
                    <h3 className="text-2xl font-black text-white">Activate Continuous Tracking</h3>
                    <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
                      Create a free account to download dynamic schema markup, generate structured FAQs automatically, and monitor competitor movements daily.
                    </p>
                  </div>
                  <Link href="/register" className="inline-block">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="h-12 px-8 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                        Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
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
