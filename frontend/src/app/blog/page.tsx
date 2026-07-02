"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Post {
  title: string;
  date: string;
  excerpt: string;
  content: string[];
}

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const posts: Post[] = [
    { 
      title: "The Rise of Answer Engine Optimization", 
      date: "Jun 24, 2026", 
      excerpt: "Why traditional SEO is dying and how AEO is taking its place in the era of LLMs.",
      content: [
        "Traditional Search Engine Optimization (SEO) has focused on keywords, backlinks, and search engine results pages (SERPs) containing ten blue links. However, the rise of LLMs and conversational agents (like ChatGPT, Gemini, and Perplexity) has shifted search towards direct, synthesized answers.",
        "This shift is known as Answer Engine Optimization (AEO). AI answer engines do not simply direct users to a link; they crawl the web, synthesize insights from multiple sources, and present a unified summary with direct inline citations.",
        "To remain visible, brands must structure their digital content so that AI crawlers can easily ingest, catalog, and reference it. Optimization is no longer about matching queries; it is about building entity authority, providing clean structured schemas, and offering clear factual answers."
      ]
    },
    { 
      title: "How to Format FAQ Schema for ChatGPT", 
      date: "Jun 18, 2026", 
      excerpt: "A step-by-step guide to structuring your FAQ pages so AI models can digest them.",
      content: [
        "Search crawlers use structured data to verify facts and entities. Among various schema markup styles, FAQPage schema in JSON-LD format is one of the most powerful instruments for AEO.",
        "When an LLM search engine indexes an FAQ, it maps questions and answers directly into its RAG (Retrieval-Augmented Generation) context window. This makes your page highly likely to be selected as a source when a user asks a matching question.",
        "Always keep answers concise, objective, and structured. Use JSON-LD format in your site header, verify it using search console diagnostics, and align the schema content with the visible text on the page to prevent indexing penalties."
      ]
    },
    { 
      title: "Understanding AI Search Visibility Scores", 
      date: "Jun 12, 2026", 
      excerpt: "What goes into calculating your AI readiness and how you can improve it today.",
      content: [
        "At Citexa, we evaluate your digital presence using four core indexes: Overall AEO Score, Schema Score, Content Readiness, and Citation Velocity.",
        "Your Schema Score tests the implementation of semantic headers and JSON-LD data. Content Readiness evaluates search authority, checking if your articles contain direct answers to natural language questions.",
        "Citation Velocity tracks how often your brand is mentioned across authoritative domains and public wikis. Improving these metrics ensures that when LLM search engines synthesize answers, your brand receives the citation."
      ]
    },
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
                onClick={() => setSelectedPost(post)}
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

        {/* Dynamic Glassmorphic Article Modal */}
        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPost(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="bg-zinc-950 border border-white/10 rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl relative z-10 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto"
              >
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl transition-colors font-bold"
                >
                  ✕
                </button>

                <div className="text-sm font-bold text-green-400 mb-2 tracking-widest">{selectedPost.date}</div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                  {selectedPost.title}
                </h2>

                <div className="space-y-4 text-gray-300 text-lg font-light leading-relaxed">
                  {selectedPost.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-black font-bold text-sm tracking-wider transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  >
                    Close Article
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

