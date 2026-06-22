"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function BlogPage() {
  const posts = [
    { title: "The Rise of Answer Engine Optimization", date: "Oct 24, 2026", excerpt: "Why traditional SEO is dying and how AEO is taking its place in the era of LLMs." },
    { title: "How to Format FAQ Schema for ChatGPT", date: "Oct 18, 2026", excerpt: "A step-by-step guide to structuring your FAQ pages so AI models can digest them." },
    { title: "Understanding AI Search Visibility Scores", date: "Oct 12, 2026", excerpt: "What goes into calculating your AI readiness and how you can improve it today." },
  ];

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
              <span className="font-bold tracking-widest uppercase text-xs">Research & News</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.1, type: "spring", bounce: 0.4 }}
              className="text-[3.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] font-black tracking-tighter leading-[1] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                Insights &
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-500 to-cyan-500">
                Updates
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-[700px] mx-auto text-gray-400 text-lg md:text-2xl font-light leading-relaxed mb-16"
            >
              Deep dives into AI Search algorithms, new schema formats, and case studies on how businesses are adapting to AEO.
            </motion.p>
          </div>
        </div>

        <div className="container px-4 md:px-6 mx-auto max-w-6xl pb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-[1500px]">
            {posts.map((post, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: i * 0.15 }}
                whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5, z: 40 }}
                className="group cursor-pointer"
              >
                <div className="w-full h-full rounded-[2rem] p-8 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-green-500/50 group-hover:shadow-[0_20px_50px_rgba(34,197,94,0.2)] flex flex-col relative overflow-hidden">
                  
                  {/* Glowing Core on Hover */}
                  <div className="absolute -inset-10 bg-gradient-to-br from-green-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 blur-[50px] transition-opacity duration-700 pointer-events-none rounded-full" />
                  
                  <div className="text-sm font-bold text-green-400 mb-4 tracking-wider relative z-10">{post.date}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-green-300 transition-colors drop-shadow-md relative z-10">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-lg font-light leading-relaxed flex-1 relative z-10 group-hover:text-gray-200 transition-colors">
                    {post.excerpt}
                  </p>
                  <div className="mt-8 text-sm font-black text-green-400 tracking-widest uppercase hover:underline relative z-10">
                    Read more →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
