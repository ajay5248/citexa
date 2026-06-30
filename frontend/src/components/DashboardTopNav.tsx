"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function DashboardTopNav() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search).get("search") || "";
      setSearch(query);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-background/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <motion.form 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative flex flex-1 items-center" 
          onSubmit={handleSearchSubmit}
        >
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute left-0 h-4 w-4 text-gray-500"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-10 w-full md:max-w-md border border-white/10 rounded-full bg-black/20 py-0 pl-8 pr-4 text-foreground placeholder:text-gray-500 focus:border-primary/50 focus:bg-black/40 transition-all sm:text-sm shadow-none"
            placeholder="Search audits, websites..."
            type="search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </motion.form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary transition-colors hover:bg-primary/10 rounded-full h-10 w-10">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
            </Button>
          </motion.div>
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10" aria-hidden="true" />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" className="-m-1.5 flex items-center p-1.5 hover:bg-white/5 rounded-full pr-4 transition-colors">
              <span className="sr-only">Open user menu</span>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-blue-600/30 flex items-center justify-center border border-primary/40 shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                <User className="h-4 w-4 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-3 text-sm font-medium leading-6 text-gray-300" aria-hidden="true">
                  Ajay
                </span>
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
