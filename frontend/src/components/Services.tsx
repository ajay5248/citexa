"use client";

import { Search, Code, LayoutList, MessageSquare, BarChart3, Target, Eye, FileText } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

const services = [
  {
    title: "AI Visibility Audit",
    description: "Comprehensive analysis of your website's readiness for AI-powered search engines.",
    icon: Search,
    href: "/dashboard/audits",
  },
  {
    title: "Answer Engine Optimization",
    description: "Optimize your content to be easily understood and extracted by AI models.",
    icon: Target,
    href: "/dashboard/audits",
  },
  {
    title: "Schema Markup Optimization",
    description: "Implement structured data to help AI engines categorize and understand your business.",
    icon: Code,
    href: "/dashboard/tools",
  },
  {
    title: "FAQ Optimization",
    description: "Generate and format FAQs specifically designed to win featured snippets in AI search.",
    icon: MessageSquare,
    href: "/dashboard/tools",
  },
  {
    title: "Citation Tracking",
    description: "Monitor where and how often AI engines cite your brand as a source.",
    icon: LayoutList,
    href: "/dashboard/reports",
  },
  {
    title: "Competitor Analysis",
    description: "Compare your AI visibility against industry competitors and find gaps.",
    icon: BarChart3,
    href: "/dashboard/competitors",
  },
  {
    title: "Brand Mention Monitoring",
    description: "Track brand sentiment and mentions across LLM-generated answers.",
    icon: Eye,
    href: "/dashboard/reports",
  },
  {
    title: "AI Search Reporting",
    description: "Get actionable, downloadable reports on your AI visibility growth over time.",
    icon: FileText,
    href: "/dashboard/reports",
  },
];

export function Services() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      className="w-full min-h-screen py-32 bg-transparent relative overflow-hidden perspective-[2000px] flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container px-4 md:px-6 mx-auto relative z-10 flex flex-col items-center pointer-events-auto">
        
        {/* The 3D Parallax Container */}
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="w-full max-w-7xl relative"
        >
          {/* Asymmetrical Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-10">
            {services.map((service, index) => {
              
              // Create an asymmetrical layout: push even columns down
              const isEvenCol = index % 2 === 1;
              const yOffsetClass = isEvenCol ? "lg:translate-y-16" : "";

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, z: -500 }}
                  whileInView={{ opacity: 1, scale: 1, z: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 1, 
                    type: "spring", 
                    bounce: 0.4, 
                    delay: index * 0.1 
                  }}
                  className={`w-full h-[380px] relative group cursor-pointer ${yOffsetClass}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Link href={service.href} className="block w-full h-full relative z-10">
                    
                    {/* The Card Container */}
                    <motion.div 
                      animate={{ y: [0, -15, 0] }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut", 
                        delay: index * 0.2 // Stagger the bobbing so it feels organic
                      }}
                      whileHover={{ 
                        scale: 1.15, 
                        z: 100, // Snap forward out of the matrix
                      }}
                      className="w-full h-full rounded-[2rem] p-8 bg-black/20 backdrop-blur-3xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-orange-500/50 group-hover:shadow-[0_0_80px_rgba(255,165,0,0.2)] group-hover:bg-black/60 flex flex-col justify-end overflow-hidden"
                    >
                      {/* Intense glowing core on hover */}
                      <div className="absolute -inset-20 bg-gradient-to-br from-orange-400/30 to-amber-600/30 opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700 pointer-events-none rounded-full z-0" />
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <motion.div 
                          whileHover={{ scale: 1.2, rotateZ: 10 }}
                          className="mb-auto p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-orange-500/20 group-hover:border-orange-500/50 transition-colors duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] inline-block w-fit"
                        >
                          <service.icon className="h-10 w-10 text-white group-hover:text-orange-300 transition-colors drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </motion.div>
                        
                        <div className="mt-auto">
                          <h3 className="text-2xl font-black mb-3 text-white group-hover:text-orange-300 transition-colors drop-shadow-lg">{service.title}</h3>
                          <p className="text-gray-400 leading-relaxed font-light text-sm group-hover:text-gray-200 transition-colors">{service.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>

                  {/* Matrix Dimming Effect */}
                  <div className="fixed inset-0 bg-black/60 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 z-[-1]" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
