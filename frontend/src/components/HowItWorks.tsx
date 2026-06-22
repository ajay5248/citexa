"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

interface Step {
  number: string;
  title: string;
  description: string;
  href: string;
}

function StepItem({ step, index, scrollYProgress }: { step: Step; index: number; scrollYProgress: MotionValue<number> }) {
  const isEven = index % 2 === 0;
  
  // Parallax effect values based on index
  const yOffset = useTransform(scrollYProgress, [0, 1], [100 - index * 20, -100 + index * 20]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 150, scale: 0.8, rotateX: 45, rotateY: isEven ? 20 : -20 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, type: "spring", stiffness: 50, damping: 20 }}
      className={`flex flex-col md:flex-row items-center justify-between relative ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="w-full md:w-5/12 mb-8 md:mb-0 relative z-10" />
      
      {/* Glowing 3D Number Circle with Parallax */}
      <motion.div 
        style={{ y: yOffset }}
        className="z-20 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-black text-white font-black text-2xl shrink-0 mb-8 md:mb-0 shadow-[0_0_40px_rgba(var(--primary),0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] border border-white/20 relative"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md -z-10" />
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          {step.number}
        </span>
      </motion.div>

      {/* Horizontal 3D Connector Line (Desktop Only) */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`hidden md:block absolute top-1/2 h-[2px] bg-gradient-to-r from-primary/80 to-purple-500/80 z-0 ${isEven ? 'right-1/2 origin-right' : 'left-1/2 origin-left'} w-[8.333333%] shadow-[0_0_10px_rgba(168,85,247,0.8)]`}
        style={{ transform: 'translateY(-50%)' }}
      />

      {/* Holographic Panel Content */}
      <Link href={step.href} className={`w-full md:w-5/12 block ${isEven ? 'md:text-left' : 'md:text-right'} group`}>
        <motion.div 
          whileHover={{ scale: 1.05, rotateY: isEven ? -5 : 5, rotateX: 5 }}
          className="w-full h-full cursor-pointer relative"
        >
          {/* Holographic Border Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-primary to-purple-600 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-70 transition duration-500" />
          
          <div className="w-full h-full p-8 md:p-12 rounded-[2rem] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Grid scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col justify-center h-full">
              <h3 className="text-4xl font-black mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:text-cyan-300 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-gray-300 font-light text-xl leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Setup scroll tracking for parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const steps = [
    {
      number: "01",
      title: "Add Website",
      description: "Connect your website to the Citexa platform.",
      href: "/dashboard/websites",
    },
    {
      number: "02",
      title: "Run AI Audit",
      description: "Our system analyzes your entire site for AI search readiness.",
      href: "/dashboard/audits",
    },
    {
      number: "03",
      title: "Identify Issues",
      description: "Get a detailed breakdown of missing schemas, bad FAQs, and structure gaps.",
      href: "/dashboard/audits",
    },
    {
      number: "04",
      title: "Apply Recommendations",
      description: "Use our generated JSON-LD and optimized content to fix the issues.",
      href: "/dashboard/tools",
    },
    {
      number: "05",
      title: "Track Growth",
      description: "Monitor your visibility score and citations across LLMs over time.",
      href: "/dashboard/reports",
    },
  ];

  return (
    <section ref={containerRef} className="w-full py-32 bg-transparent relative border-t border-white/[0.02] overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-24"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl text-white drop-shadow-lg">
              The Path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Visibility</span>
            </h2>
            <p className="max-w-[900px] text-gray-400 md:text-xl font-light">
              Five simple steps to future-proof your digital presence in 3D.
            </p>
          </div>
        </motion.div>
        
        <div className="mx-auto max-w-5xl relative">
          {/* Animated vertical 3D glowing line */}
          <motion.div 
            style={{ 
              scaleY: scrollYProgress,
              transformOrigin: "top"
            }}
            className="absolute left-1/2 -ml-[2px] w-[4px] h-full bg-gradient-to-b from-primary via-purple-500 to-transparent hidden md:block z-0 shadow-[0_0_20px_rgba(168,85,247,1)] rounded-full" 
          />
          <div className="absolute left-1/2 -ml-[1px] w-[2px] h-full bg-white/5 hidden md:block -z-10 rounded-full" />

          <div className="space-y-20">
            {steps.map((step, index) => (
              <StepItem key={index} step={step} index={index} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
