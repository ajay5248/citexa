"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}

export function TiltCard({ children, className = "", depth = 20 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the motion
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  // Transform coordinates into degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [depth, -depth]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-depth, depth]);

  const [isHovering, setIsHovering] = useState(false);

  const bgPositionX = useTransform(x, (xVal) => (xVal + 0.5) * 100);
  const bgPositionY = useTransform(y, (yVal) => (yVal + 0.5) * 100);
  const bgPosition = useMotionTemplate`${bgPositionX}% ${bgPositionY}%`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the card
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      initial={{ perspective: 1000 }}
      animate={{ 
        scale: isHovering ? 1.02 : 1,
        zIndex: isHovering ? 10 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative w-full h-full ${className}`}
    >
      {/* Glare effect */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] bg-gradient-to-tr from-white/0 via-white/10 to-white/0"
        style={{
          opacity: isHovering ? 1 : 0,
          backgroundPosition: bgPosition,
          transition: "opacity 0.3s ease"
        }}
      />
      
      {/* Ensure children also preserve 3d space for nested depths */}
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d", height: "100%", width: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
}
