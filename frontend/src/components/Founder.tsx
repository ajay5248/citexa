"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

// Custom LinkedIn SVG Icon matching Lucide style
function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// Custom GitHub SVG Icon matching Lucide style
function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function Founder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects for ambient light shapes and background grids
  const yGlow1 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const yGlow2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yGrid = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    // Generate random background particles safely on client mount
    const generatedParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * -10,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full py-32 bg-gradient-to-b from-black via-[#03030f] to-black relative overflow-hidden border-t border-white/[0.02]"
    >
      {/* 1. Animated Cyber Grid Pattern with Parallax */}
      <motion.div 
        style={{ y: yGrid }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-80 pointer-events-none"
      />

      {/* 2. Abstract Ambient Light Shapes / Gradients (Blue and Purple) */}
      <motion.div 
        style={{ y: yGlow1 }}
        className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        style={{ y: yGlow2 }}
        className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 3. Floating Background Particles */}
      {isMounted && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-400/20 pointer-events-none z-0"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -120],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 max-w-6xl mx-auto">
          
          {/* LEFT COLUMN: Founder Image Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="w-full lg:w-[45%] flex justify-center group relative z-10"
          >
            {/* Neon Glow Pulse Shadow around image */}
            <motion.div 
              className="absolute -inset-2 rounded-[28px] bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-purple-500/30 blur-2xl pointer-events-none"
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.97, 1.03, 0.97] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Continuous Floating Container */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-[380px] aspect-[4/5] rounded-[24px] overflow-hidden"
            >
              <TiltCard className="rounded-[24px]">
                <div className="w-full h-full rounded-[24px] border border-white/10 bg-black/60 backdrop-blur-2xl overflow-hidden p-3 flex flex-col justify-between relative shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_0_50px_rgba(0,0,0,0.8)]">
                  
                  {/* Glowing Animated Outer Border Line */}
                  <div className="absolute inset-0 rounded-[24px] border border-white/5 pointer-events-none z-30 group-hover:border-blue-500/30 transition-colors duration-500" />
                  
                  {/* Smooth reflective glare on image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 z-20 pointer-events-none" />

                  {/* Image wrapper */}
                  <div className="relative w-full h-[83%] rounded-[18px] overflow-hidden border border-white/5 bg-neutral-900">
                    <Image 
                      src="/founder.jpg" 
                      alt="Ajay Adhikari" 
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-[center_18%] transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    
                    {/* Shadow overlay at bottom of image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                  </div>

                  {/* Glassmorphic Metadata strip under image */}
                  <div className="h-[17%] flex items-center justify-between px-3 z-20">
                    <div className="space-y-0.5">
                      <p className="text-white font-semibold text-base tracking-wide leading-tight">Ajay Adhikari</p>
                      <p className="text-xs text-blue-400 font-medium tracking-wide">B.Tech CSE (AI & ML)</p>
                    </div>
                    <div className="text-[10px] text-gray-400 border border-white/10 rounded-full px-2.5 py-0.5 bg-white/5 uppercase tracking-widest font-mono">
                      Founder
                    </div>
                  </div>

                </div>
              </TiltCard>
            </motion.div>
          </motion.div>
          
          {/* RIGHT COLUMN: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100, delay: 0.1 }}
            className="w-full lg:w-[55%] space-y-6"
          >
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/5 px-3.5 py-1 text-xs text-blue-400 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)] uppercase tracking-widest font-bold font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
              FOUNDER & CEO
            </div>

            {/* Heading & Name */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                Meet the Founder
              </h2>
              <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            </div>

            {/* Mission Statement */}
            <div className="relative pl-5 border-l-2 border-blue-500/40 py-1">
              <p className="text-lg md:text-xl font-medium text-gray-200 leading-relaxed italic">
                "Building AI-powered digital experiences, intelligent automation systems, and modern web solutions that help businesses thrive in the age of AI."
              </p>
            </div>

            {/* Description Paragraph */}
            <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
              Ajay Adhikari founded Citexa with a vision to bridge the gap between cutting-edge technology and real-world business growth. With expertise in AI, web development, automation, and Answer Engine Optimization (AEO), he focuses on creating innovative digital solutions that help startups and businesses scale faster.
            </p>

            {/* Social Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="https://www.linkedin.com/in/ajay-adhikari-419a3b320/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.02] hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/40 text-gray-300 hover:text-white transition-all duration-300 group/social hover:-translate-y-0.5"
              >
                <Linkedin className="size-4 text-[#0a66c2] transition-transform group-hover/social:scale-110" />
                <span className="text-sm font-semibold tracking-wide">LinkedIn</span>
              </a>
              <a 
                href="https://github.com/ajay5248" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.02] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/40 text-gray-300 hover:text-white transition-all duration-300 group/social hover:-translate-y-0.5"
              >
                <Github className="size-4 text-white transition-transform group-hover/social:scale-110" />
                <span className="text-sm font-semibold tracking-wide">GitHub</span>
              </a>
              <a 
                href="mailto:ajay@citexa.com"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.02] hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/40 text-gray-300 hover:text-white transition-all duration-300 group/social hover:-translate-y-0.5"
              >
                <Mail className="size-4 text-indigo-400 transition-transform group-hover/social:scale-110" />
                <span className="text-sm font-semibold tracking-wide">Email</span>
              </a>
            </div>

            {/* Gradient Call-To-Action Button */}
            <div className="pt-6">
              <div className="relative group/cta inline-block">
                {/* Glow behind CTA */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl blur opacity-50 group-hover/cta:opacity-90 transition duration-500 group-hover/cta:duration-200" />
                <Link
                  href="/#contact"
                  className="relative flex items-center gap-2.5 px-8 py-4 bg-[#0a0a0d] hover:bg-transparent border border-white/10 hover:border-transparent rounded-xl text-white font-bold transition-all duration-500 leading-none group/btn hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                >
                  <span className="text-base tracking-wide">Let's Build Something Amazing</span>
                  <ArrowRight className="size-5 text-indigo-400 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
