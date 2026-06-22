"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { HeroScene } from "./3d/HeroScene";

export function Hero() {

  return (
    <section className="w-full min-h-[90vh] py-24 md:py-32 lg:py-48 relative overflow-hidden flex items-center justify-center bg-transparent">
      
      <HeroScene />

      <div className="container px-4 md:px-6 mx-auto relative z-10 flex flex-col items-center pointer-events-none">
        
        {/* Main Text Content */}
        <div className="max-w-5xl w-full pointer-events-auto">
            <div className="flex flex-col items-center space-y-6 text-center">
              


              <div className="space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.1, type: "spring", bounce: 0.3 }}
                  className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6.5rem] font-extrabold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-blue-300 to-blue-600 drop-shadow-lg"
                >
                  Get Found in AI Search
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="mx-auto max-w-[800px] text-gray-300 md:text-xl lg:text-[22px] font-light leading-relaxed"
                >
                  Citexa helps businesses improve visibility across ChatGPT, Gemini, Claude, Perplexity, Copilot and Google AI Overviews through Answer Engine Optimization.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 mt-8"
              >
                <Link href="/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="w-full sm:w-auto h-12 px-6 bg-[#2b88ff] hover:bg-blue-600 text-white rounded-lg font-medium border-none shadow-none">
                      Get Free AI Visibility Audit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/contact">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6 bg-slate-900/50 border-white/10 hover:bg-white/10 text-white rounded-lg font-medium shadow-none">
                      Book a Strategy Call
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

            </div>
        </div>

      </div>
    </section>
  );
}
