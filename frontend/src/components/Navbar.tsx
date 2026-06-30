"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 border-b border-border/40 shadow-lg" 
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Citexa" 
              width={120} 
              height={40} 
              className="object-contain dark:grayscale dark:contrast-200 dark:invert dark:mix-blend-screen" 
            />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {["Services", "Pricing", "About", "Blog"].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                className="relative group transition-colors hover:text-foreground text-foreground/60"
              >
                {item}
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" 
                />
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" className="text-sm transition-transform hover:scale-105">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="text-sm transition-transform hover:scale-105 shadow-[0_0_10px_rgba(var(--primary),0.3)] hover:shadow-[0_0_20px_rgba(var(--primary),0.5)]">Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
