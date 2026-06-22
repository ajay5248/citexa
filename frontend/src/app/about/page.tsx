"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Founder } from "@/components/Founder";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground relative overflow-hidden">
      <Navbar />
      
      <main className="flex-1 pt-24 relative z-10">
        <div className="py-20 md:py-32 relative flex flex-col items-center justify-center pointer-events-none">
          <div className="container px-4 md:px-6 mx-auto relative z-10 flex flex-col items-center text-center pointer-events-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: -20, rotateX: 90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.5 }}
              className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-6 py-2 text-sm text-blue-300 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.3)] mb-8"
            >
              <span className="font-bold tracking-widest uppercase text-xs">Our Mission</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.1, type: "spring", bounce: 0.4 }}
              className="text-[3.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] font-black tracking-tighter leading-[1] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                The Future of
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
                Discovery
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-[800px] mx-auto text-gray-400 text-lg md:text-2xl font-light leading-relaxed mb-16"
            >
              We help businesses become discoverable, cited, and recommended by the world's most powerful AI search engines.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="w-full max-w-4xl bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2rem] text-left space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">The Problem We Solve</h2>
                <p className="text-gray-300 leading-relaxed text-lg font-light">
                  Businesses currently optimize for traditional Google SEO but do not know how visible they are in AI-powered search systems like ChatGPT, Gemini, Claude, and Google AI Overviews. Traditional ranking factors are losing weight as generative AI shifts the paradigm toward direct answers and citations.
                </p>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">Our Vision</h2>
                <p className="text-gray-300 leading-relaxed text-lg font-light">
                  To become the leading AI Search Visibility and Answer Engine Optimization platform globally, ensuring our clients are not just found, but cited and chosen by the intelligent agents of tomorrow.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        
        <Founder />
      </main>
      <Footer />
    </div>
  );
}
