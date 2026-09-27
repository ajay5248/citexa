"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface Website {
  id: number;
  url: string;
  name?: string;
}

interface Competitor {
  id: number;
  competitor_url: string;
  analysis_data: string | null;
  created_at: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")) ? "/api" : "https://citexa.onrender.com");

export default function Competitors() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<number | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newCompUrl, setNewCompUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchCompetitors = useCallback(async (websiteId: number, token: string) => {
    try {
      const compRes = await fetch(`${apiUrl}/competitors/${websiteId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (compRes.ok) {
        const compData = await compRes.json();
        setCompetitors(compData);
      } else {
        if (compRes.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Fetch websites
      const webRes = await fetch(`${apiUrl}/websites/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (webRes.ok) {
        const webData = await webRes.json();
        setWebsites(webData);
        
        if (webData.length > 0) {
          setSelectedWebsiteId(webData[0].id);
          fetchCompetitors(webData[0].id, token!);
        } else {
          setLoading(false);
        }
      } else {
        if (webRes.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [fetchCompetitors]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  // Poll for analyzing competitors dynamically
  useEffect(() => {
    const hasAnalyzing = competitors.some(c => c.analysis_data === null);
    const activeWebsiteId = selectedWebsiteId;
    if (!hasAnalyzing || !activeWebsiteId) return;

    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        fetchCompetitors(activeWebsiteId, token);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [competitors, selectedWebsiteId, fetchCompetitors]);


  const handleAddCompetitor = async () => {
    if (!selectedWebsiteId || !newCompUrl) return;
    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/competitors/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ website_id: selectedWebsiteId, competitor_url: newCompUrl })
      });
      if (res.ok) {
        setNewCompUrl("");
        fetchCompetitors(selectedWebsiteId, token!);
      } else {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        alert("Failed to add competitor");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <Loader2 className="h-10 w-10 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
      </motion.div>
    </div>
  );

  if (websites.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 bg-card/40 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-lg mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">No Websites Found</h2>
        <p className="text-gray-400 mb-6">You need to add a website before you can track competitors.</p>
        <Button onClick={() => window.location.href='/dashboard/websites'} className="shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all">Go to Websites</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Competitor Analysis</h2>
          <p className="text-gray-400 mt-1">Track and compare your AI visibility against industry rivals.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          {websites.length > 0 && (
            <select
              value={selectedWebsiteId || ""}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSelectedWebsiteId(val);
                const token = localStorage.getItem("token");
                fetchCompetitors(val, token!);
              }}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary/50 cursor-pointer h-10 w-full sm:w-[200px] transition-colors"
            >
              {websites.map((web) => (
                <option key={web.id} value={web.id} className="bg-[#121214] text-white">
                  {web.url.replace("https://", "").replace("http://", "")}
                </option>
              ))}
            </select>
          )}
          <Input 
            placeholder="competitor.com" 
            value={newCompUrl}
            onChange={(e) => setNewCompUrl(e.target.value)}
            className="bg-black/20 border-white/10 focus:border-primary/50 w-full sm:max-w-[200px] transition-colors"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Button onClick={handleAddCompetitor} disabled={adding || !newCompUrl} className="w-full sm:w-auto shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all">
              {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Add
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent bg-black/20">
              <TableHead className="text-gray-300 font-medium">Competitor URL</TableHead>
              <TableHead className="text-gray-300 font-medium">Visibility Score</TableHead>
              <TableHead className="text-gray-300 font-medium">Strengths</TableHead>
              <TableHead className="text-gray-300 font-medium">Weaknesses</TableHead>
              <TableHead className="text-right text-gray-300 font-medium">Added</TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-white/5"
          >
            {competitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    No competitors added yet.
                  </motion.div>
                </TableCell>
              </TableRow>
            ) : competitors.map((comp) => {
              const analysis = comp.analysis_data ? JSON.parse(comp.analysis_data) : null;
              
              return (
              <motion.tr 
                key={comp.id} 
                className="border-white/5 hover:bg-white/5 transition-colors group"
                variants={itemVariants}
              >
                <TableCell className="font-medium text-primary group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] transition-all">{comp.competitor_url}</TableCell>
                <TableCell className="font-bold text-gray-200">
                  {analysis && analysis.visibility_score ? `${analysis.visibility_score}/100` : "Analyzing..."}
                </TableCell>
                <TableCell>
                  {analysis && analysis.strengths ? (
                    <ul className="list-disc pl-4 text-xs text-green-400/80 group-hover:text-green-400 transition-colors">
                      {analysis.strengths.map((s:string, i:number) => <li key={i}>{s}</li>)}
                    </ul>
                  ) : <span className="text-gray-600">-</span>}
                </TableCell>
                <TableCell>
                  {analysis && analysis.weaknesses ? (
                    <ul className="list-disc pl-4 text-xs text-red-400/80 group-hover:text-red-400 transition-colors">
                      {analysis.weaknesses.map((w:string, i:number) => <li key={i}>{w}</li>)}
                    </ul>
                  ) : <span className="text-gray-600">-</span>}
                </TableCell>
                <TableCell className="text-right text-gray-400 text-sm">
                  {new Date(comp.created_at).toLocaleDateString()}
                </TableCell>
              </motion.tr>
            )})}
          </motion.tbody>
        </Table>
      </motion.div>

      {competitors.some(c => c.analysis_data) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Strategic Opportunities</h3>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {competitors.map(comp => {
              const analysis = comp.analysis_data ? JSON.parse(comp.analysis_data) : null;
              if (!analysis || !analysis.opportunities) return null;
              
              return (
                <motion.div key={`opp-${comp.id}`} variants={itemVariants} whileHover={{ scale: 1.02, y: -5 }}>
                  <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary),0.15)] h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
                        To beat {comp.competitor_url}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-decimal pl-4 space-y-2 text-sm text-gray-300">
                        {analysis.opportunities.map((opp:string, i:number) => <li key={i}>{opp}</li>)}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
