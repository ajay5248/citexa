"use client";

import { Navbar } from "@/components/Navbar";
import { Services as ServicesComponent } from "@/components/Services";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    // Transparent background to allow the global CinematicParticleScene to show through
    <div className="flex min-h-screen flex-col bg-transparent text-foreground relative z-20">

      <Navbar />
      
      <main className="flex-1 relative z-10 pt-24">
        <div className="py-20 md:py-32 relative flex flex-col items-center justify-center min-h-[60vh] pointer-events-none">
          
          <div className="container px-4 md:px-6 mx-auto relative z-10 flex flex-col items-center text-center pointer-events-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: -20, rotateX: 90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.5 }}
              className="inline-flex items-center rounded-full border border-orange-500/40 bg-orange-500/10 px-6 py-2 text-sm text-orange-300 backdrop-blur-md shadow-[0_0_40px_rgba(255,165,0,0.3)] mb-8"
            >
              <span className="font-bold tracking-widest uppercase text-xs">Our Capabilities</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.1, type: "spring", bounce: 0.4 }}
              className="text-[3.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] font-black tracking-tighter leading-[1] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                AI Optimization
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500">
                Services
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-[800px] mx-auto text-gray-400 text-lg md:text-2xl font-light leading-relaxed"
            >
              From in-depth technical audits to automated schema markup, we provide the ultimate toolset to dominate the Answer Engine ecosystem.
            </motion.p>
          </div>
        </div>

        {/* The elegant floating holographic matrix component */}
        <ServicesComponent />
      </main>
      <Footer />
    </div>
  );
}
