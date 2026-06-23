"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground relative overflow-hidden">
      <Navbar />
      
      <main className="flex-1 pt-24 relative z-10">
        <div className="py-20 md:py-32 relative flex flex-col items-center justify-center pointer-events-none">
          <div className="container px-4 md:px-6 mx-auto relative z-10 flex flex-col items-center pointer-events-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: -20, rotateX: 90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-6 py-2 text-sm text-purple-300 backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.3)] mb-8"
            >
              <FileText className="w-4 h-4" />
              <span className="font-bold tracking-widest uppercase text-xs">Agreement</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.1, type: "spring", bounce: 0.4 }}
              className="text-[3.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[6.5rem] font-black tracking-tighter leading-[1] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] text-center"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                Terms of
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
                Service
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-[800px] mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-16 text-center"
            >
              Please read these terms carefully before using Citexa's AI search visibility and auditing services.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="w-full max-w-4xl bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2rem] text-left space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">1. Acceptance of Terms</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                  By accessing or using Citexa, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you should not access or use our services.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">2. Use of Services</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                  You agree to use our platform and auditing tools only for lawful purposes. You must not attempt to compromise the integrity of our systems, run scraping mechanisms against our private API, or use the service to generate malicious scripts.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">3. Subscriptions & Payments</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                  Subscriptions to our plans are billed in advance on a recurring monthly or annual basis. You can cancel your subscription at any time. Refunds are processed according to our billing guidelines.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">4. Disclaimer of Warranties</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                  Citexa provides audit reports and recommendations "as is." AI models and search algorithms evolve dynamically, and we do not guarantee specific indexing rankings or citation rates on external search systems.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">5. Limitation of Liability</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                  To the maximum extent permitted by law, Citexa shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use our platform.
                </p>
                <p className="text-gray-500 text-xs mt-4">
                  Last Updated: June 22, 2026
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
