"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Hourglass } from "lucide-react";
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
              className="inline-flex items-center rounded-full border border-green-500/40 bg-green-500/10 px-6 py-2 text-sm text-green-300 backdrop-blur-md shadow-[0_0_40px_rgba(34,197,94,0.3)] mb-8"
            >
              <span className="font-bold tracking-widest uppercase text-xs">Public Beta Open</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.1, type: "spring", bounce: 0.4 }}
              className="text-[3.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] font-black tracking-tighter leading-[1] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                100% Free
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-500 to-cyan-500">
                During Beta
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-[700px] mx-auto text-gray-400 text-lg md:text-2xl font-light leading-relaxed"
            >
              Citexa is currently in open beta. Create an account today and optimize your brand's AI search footprint for free.
            </motion.p>
          </div>
        </div>
        
        <div className="container px-4 md:px-6 mx-auto grid md:grid-cols-3 gap-8 max-w-6xl pb-32 perspective-[2000px]">
          
          {/* Public Beta (Active / Free) */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotateY: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.05, rotateY: 10, rotateX: 5, z: 50 }}
            className="w-full relative group cursor-pointer"
          >
            {/* Glowing Accent */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-500 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-75 transition duration-500" />
            
            <div className="w-full h-full rounded-[2rem] p-8 bg-zinc-950/80 backdrop-blur-2xl border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-500 flex flex-col relative z-10">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-teal-500 text-black px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                ACTIVE
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Public Beta</h3>
                <p className="text-gray-400">Available to all web operators.</p>
                <div className="mt-6 text-5xl font-black text-white">
                  $0<span className="text-xl text-gray-500 font-normal">/forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-green-400" /> Track up to 5 Websites</li>
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-green-400" /> 30 Real-time Audits / mo</li>
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-green-400" /> FAQ & LocalBusiness Schemas</li>
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-green-400" /> Competitor Tracking lists</li>
                <li className="flex items-center text-gray-300"><Check className="h-5 w-5 mr-3 text-green-400" /> Download Text Reports</li>
              </ul>
              <Link href="/register" className="w-full">
                <Button className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-black rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all border-none">
                  Get Free Access
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Pro Plan (Upcoming) */}
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.4 }}
            className="w-full relative group opacity-60 md:-translate-y-8"
          >
            <div className="w-full h-full rounded-[2rem] p-8 bg-zinc-950/40 backdrop-blur-3xl border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden z-10">
              
              <div className="absolute top-4 right-4 bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-xs font-black tracking-wider">
                UPCOMING
              </div>

              <div className="mb-8">
                <h3 className="text-3xl font-black text-zinc-300 mb-2">Pro</h3>
                <p className="text-zinc-500">For professional marketing campaigns.</p>
                <div className="mt-6 text-6xl font-black text-zinc-400">
                  --<span className="text-xl text-zinc-600 font-normal">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-zinc-500"><Hourglass className="h-4 w-4 mr-3 text-zinc-600" /> Track up to 25 Websites</li>
                <li className="flex items-center text-zinc-500"><Hourglass className="h-4 w-4 mr-3 text-zinc-600" /> Unlimited Real-time Audits</li>
                <li className="flex items-center text-zinc-500"><Hourglass className="h-4 w-4 mr-3 text-zinc-600" /> Proactive Daily Audit Agents</li>
                <li className="flex items-center text-zinc-500"><Hourglass className="h-4 w-4 mr-3 text-zinc-600" /> Comprehensive PDF Report Exports</li>
              </ul>
              <Button disabled className="w-full h-14 text-lg font-bold bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl cursor-not-allowed">
                Coming Soon
              </Button>
            </div>
          </motion.div>

          {/* Enterprise Plan (Upcoming) */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotateY: -20 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.6 }}
            className="w-full relative group opacity-60"
          >
            <div className="w-full h-full rounded-[2rem] p-8 bg-zinc-950/40 backdrop-blur-2xl border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col">
              <div className="absolute top-4 right-4 bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-xs font-black tracking-wider">
                UPCOMING
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-zinc-300 mb-2">Enterprise</h3>
                <p className="text-zinc-500">For large scale operations.</p>
                <div className="mt-6 text-5xl font-black text-zinc-400">
                  --<span className="text-xl text-zinc-600 font-normal">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-zinc-500"><Hourglass className="h-4 w-4 mr-3 text-zinc-600" /> Unlimited Website tracking</li>
                <li className="flex items-center text-zinc-500"><Hourglass className="h-4 w-4 mr-3 text-zinc-600" /> API Access Keys & Endpoints</li>
                <li className="flex items-center text-zinc-500"><Hourglass className="h-4 w-4 mr-3 text-zinc-600" /> White-label customized PDFs</li>
                <li className="flex items-center text-zinc-500"><Hourglass className="h-4 w-4 mr-3 text-zinc-600" /> Custom multi-tenant databases</li>
              </ul>
              <Button disabled className="w-full h-12 text-lg font-bold bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl cursor-not-allowed">
                Coming Soon
              </Button>
            </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

