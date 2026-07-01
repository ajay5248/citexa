"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Code, MessageSquare, BarChart3, TrendingUp, Sparkles, Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Website {
  id: number;
  url: string;
  name?: string;
}

interface Audit {
  id: number;
  website_id: number;
  status: string;
  schema_score: number;
  content_score: number;
  overall_score: number;
  created_at: string;
}

export default function Dashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")) ? "/api" : "https://citexa.onrender.com");

        const [websitesRes, auditsRes] = await Promise.all([
          fetch(`${apiUrl}/websites/`, { headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${apiUrl}/audits/`, { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        if (websitesRes.ok && auditsRes.ok) {
          setWebsites(await websitesRes.json());
          setAudits(await auditsRes.json());
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  let latestAudit = null;
  if (audits && audits.length > 0) {
      latestAudit = audits.find(a => a.status === 'completed') || audits[0];
  }

  const aiScore = latestAudit ? Math.round(latestAudit.overall_score) : 0;
  const schemaScore = latestAudit ? Math.round(latestAudit.schema_score) : 0;
  const faqScore = latestAudit ? Math.round(latestAudit.content_score) : 0;

  const stats = [
    { name: "AI Visibility Score", value: isLoading ? "..." : `${aiScore}/100`, change: "Latest", icon: Sparkles, color: "text-primary" },
    { name: "Schema Health", value: isLoading ? "..." : `${schemaScore}%`, change: "Latest", icon: Code, color: "text-blue-400" },
    { name: "FAQ Readiness", value: isLoading ? "..." : `${faqScore}%`, change: "Latest", icon: MessageSquare, color: "text-purple-400" },
    { name: "Competitor Rank", value: "#3", change: "Est.", icon: BarChart3, color: "text-emerald-400" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const, 
      stiffness: 100, 
      damping: 15 
    } 
  }
};

  return (
    <div className="space-y-8 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Command Center</h2>
          <p className="text-gray-400 mt-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Real-time Answer Engine Analytics
          </p>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.name} variants={itemVariants} whileHover={{ scale: 1.02, y: -5 }}>
            <Card className="bg-card/40 backdrop-blur-xl border-border/20 hover:bg-card/60 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] relative overflow-hidden group h-full">
              {/* Subtle top border gradient */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{stat.name}</CardTitle>
                <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white drop-shadow-md">{stat.value}</div>
                <p className="text-xs text-primary flex items-center mt-2 bg-primary/10 w-max px-2 py-1 rounded-full border border-primary/20">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {stat.change} 
                  <span className="text-gray-400 ml-1">vs last week</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Bento Box Layout Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-12"
      >
        {/* Main Chart Area - Takes up 8 columns */}
        <Card className="col-span-12 lg:col-span-8 bg-card/40 backdrop-blur-xl border-border/20 hover:border-border/40 transition-all duration-300 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Visibility Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 flex justify-center items-center h-[350px] relative">
            {/* Animated Grid Lines for "Chart" vibe */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1, 0.98] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="flex flex-col items-center relative z-10"
            >
              <div className="w-24 h-24 rounded-full bg-primary/20 blur-xl absolute" />
              <TrendingUp className="h-12 w-12 mb-4 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
              <p className="text-gray-400 font-mono text-sm relative z-10">Initializing Real-time Data Stream...</p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Secondary Column - Takes up 4 columns */}
        <Card className="col-span-12 lg:col-span-4 bg-card/40 backdrop-blur-xl border-border/20 hover:border-border/40 transition-all duration-300 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-400" />
              Recent Audits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const recentAudits = audits.slice(0, 4).map(audit => {
                  const website = websites.find(w => w.id === audit.website_id);
                  const url = website ? website.url : `Website #${audit.website_id}`;
                  const date = new Date(audit.created_at).toLocaleDateString();
                  const score = Math.round(audit.overall_score).toString();
                  
                  let statusColor = "yellow";
                  if (audit.status === "completed") {
                      statusColor = audit.overall_score > 70 ? "emerald" : (audit.overall_score > 40 ? "yellow" : "red");
                  } else if (audit.status === "failed") {
                      statusColor = "red";
                  }

                  return {
                      id: audit.id,
                      url,
                      date,
                      score: audit.status === "pending" ? "..." : score,
                      status: statusColor
                  };
                });

                return recentAudits.length > 0 ? recentAudits.map((audit, i) => (
                  <motion.div 
                    key={audit.id || i} 
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-all cursor-pointer border border-transparent hover:border-white/10 group"
                  >
                    <div className={`w-2 h-2 rounded-full bg-${audit.status}-500 mr-3 shadow-[0_0_8px_rgba(var(--${audit.status}-500),0.8)]`} />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none text-gray-200 group-hover:text-white transition-colors">{audit.url}</p>
                      <p className="text-xs text-gray-500 font-mono">{audit.date}</p>
                    </div>
                    <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">{audit.score}</div>
                  </motion.div>
                )) : (
                  <div className="text-center text-gray-500 py-4 text-sm">No recent audits found.</div>
                );
              })()}
            </div>
            <Link href="/audit">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-2.5 rounded-lg border border-primary/30 text-primary font-medium text-sm hover:bg-primary/10 transition-colors shadow-[0_0_15px_rgba(var(--primary),0.1)]"
              >
                Run New Audit
              </motion.button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
