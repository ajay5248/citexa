"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
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
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-6 py-2 text-sm text-blue-300 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.3)] mb-8"
            >
              <Shield className="w-4 h-4" />
              <span className="font-bold tracking-widest uppercase text-xs">Trust & Privacy</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.1, type: "spring", bounce: 0.4 }}
              className="text-[3.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[6.5rem] font-black tracking-tighter leading-[1] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] text-center"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                Privacy
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
                Policy
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-[800px] mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-16 text-center"
            >
              At Citexa, we are committed to protecting your personal information and being transparent about how we process data.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="w-full max-w-4xl bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2rem] text-left space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">1. Information We Collect</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                  We collect information you provide directly to us when creating an account, running website audits, subscribing to our services, or contacting us. This includes your name, email address, website URLs, and organization details.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">2. How We Use Your Information</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                  We use the information we collect to operate, maintain, and improve our AI search visibility platform, process your audits, send updates, and offer technical support. We do not sell or trade your data to third parties.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">3. Data Security</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                  We implement robust technical and organizational security measures to protect your personal data from unauthorized access, modification, or disclosure. All data transmissions are encrypted using standard TLS protocols.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">4. Your Data Rights</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                  You have the right to access, rectify, or erase the personal data we store about you. You can also object to or restrict processing. To make a request, please contact us at <strong>support@citexa.online</strong>.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-md">5. Updates to This Policy</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or regulations. The updated version will be indicated by an updated date at the bottom of this page.
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
