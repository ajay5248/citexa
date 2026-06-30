"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingPage() {
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
              className="inline-flex items-center rounded-full border border-purple-500/40 bg-purple-500/10 px-6 py-2 text-sm text-purple-300 backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.3)] mb-8"
            >
              <span className="font-bold tracking-widest uppercase text-xs">Transparent Pricing</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.1, type: "spring", bounce: 0.4 }}
              className="text-[3.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] font-black tracking-tighter leading-[1] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                Simple &
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Scalable
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-[700px] mx-auto text-gray-400 text-lg md:text-2xl font-light leading-relaxed"
            >
              Choose the plan that fits your business needs. Scale up as your AI visibility grows.
            </motion.p>
          </div>
        </div>
        
        <div className="container px-4 md:px-6 mx-auto grid md:grid-cols-3 gap-8 max-w-6xl pb-32 perspective-[2000px]">
          
          {/* Starter Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotateY: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.05, rotateY: 10, rotateX: 5, z: 50 }}
            className="w-full relative group cursor-pointer"
          >
            <div className="w-full h-full rounded-[2rem] p-8 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col group-hover:border-white/30 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <p className="text-gray-400">Perfect for small websites.</p>
                <div className="mt-6 text-5xl font-black text-white">
                  $49<span className="text-xl text-gray-500 font-normal">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-purple-400" /> Track 1 Website</li>
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-purple-400" /> 10 AI Audits per month</li>
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-purple-400" /> Basic Schema Generation</li>
              </ul>
              <Link href="/register?plan=starter" className="w-full">
                <Button className="w-full h-12 text-lg font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl transition-all">Get Started</Button>
              </Link>
            </div>
          </motion.div>

          {/* Pro Plan (Highlighted) */}
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.08, z: 100 }}
            className="w-full relative group cursor-pointer md:-translate-y-8"
          >
            {/* Pulsing Neon Core */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-500 animate-pulse" />
            
            <div className="w-full h-full rounded-[2rem] p-8 bg-black/60 backdrop-blur-3xl border border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.3)] flex flex-col relative overflow-hidden z-10">
              
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-pink-500/20 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.8)]">
                MOST POPULAR
              </div>

              <div className="mb-8 relative z-10">
                <h3 className="text-3xl font-black text-white mb-2 drop-shadow-md">Pro</h3>
                <p className="text-pink-200">For growing businesses.</p>
                <div className="mt-6 text-6xl font-black text-white drop-shadow-lg">
                  $99<span className="text-xl text-pink-300/60 font-normal">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1 relative z-10">
                <li className="flex items-center text-white"><Check className="h-5 w-5 mr-3 text-pink-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]" /> Track up to 10 Websites</li>
                <li className="flex items-center text-white"><Check className="h-5 w-5 mr-3 text-pink-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]" /> Unlimited AI Audits</li>
                <li className="flex items-center text-white"><Check className="h-5 w-5 mr-3 text-pink-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]" /> Advanced Schema & FAQs</li>
                <li className="flex items-center text-white"><Check className="h-5 w-5 mr-3 text-pink-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]" /> Competitor Tracking</li>
              </ul>
              <Link href="/register?plan=pro" className="w-full relative z-10">
                <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] border-none transition-all">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotateY: -20 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.6 }}
            whileHover={{ scale: 1.05, rotateY: -10, rotateX: 5, z: 50 }}
            className="w-full relative group cursor-pointer"
          >
            <div className="w-full h-full rounded-[2rem] p-8 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col group-hover:border-white/30 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-gray-400">For large scale operations.</p>
                <div className="mt-6 text-5xl font-black text-white">
                  $299<span className="text-xl text-gray-500 font-normal">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-purple-400" /> Unlimited Websites</li>
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-purple-400" /> API Access</li>
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-purple-400" /> White-label Reports</li>
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-purple-400" /> Dedicated Account Manager</li>
              </ul>
              <Link href="/register?plan=enterprise" className="w-full">
                <Button className="w-full h-12 text-lg font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl transition-all">Contact Sales</Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
