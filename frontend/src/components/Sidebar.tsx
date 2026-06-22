"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Globe, FileSearch, Users, FileText, Settings, CreditCard, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Websites", href: "/dashboard/websites", icon: Globe },
    { name: "Tools", href: "/dashboard/tools", icon: Wand2 },
    { name: "Audits", href: "/dashboard/audits", icon: FileSearch },
    { name: "Competitors", href: "/dashboard/competitors", icon: Users },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  ];

  return (
    <div className="hidden border-r border-border/10 bg-background/95 backdrop-blur-xl md:block w-64 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      <div className="flex h-16 items-center px-6 border-b border-border/10 relative overflow-hidden">
        {/* Subtle glowing orb behind logo */}
        <div className="absolute -left-4 -top-4 w-16 h-16 bg-primary/20 rounded-full blur-xl pointer-events-none" />
        <Link href="/dashboard" className="flex items-center space-x-2 relative z-10">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.5)]">
              <span className="font-bold text-white text-lg">C</span>
            </div>
          </motion.div>
          <span className="font-bold text-xl tracking-wider text-white">Citexa</span>
        </Link>
      </div>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
        className="space-y-2 p-4"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
          
          return (
            <motion.div key={item.name} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
              <Link
                href={item.href}
                className={`group relative flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden ${
                  isActive 
                    ? "text-white bg-primary/10 shadow-[inset_2px_0_0_0_rgba(var(--primary),1)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {/* Neon Background Pulse for Active State */}
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <motion.div whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }} transition={{ duration: 0.3 }}>
                  <item.icon className={`h-4 w-4 relative z-10 transition-colors ${isActive ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" : "group-hover:text-primary/70"}`} />
                </motion.div>
                <span className="relative z-10">{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
