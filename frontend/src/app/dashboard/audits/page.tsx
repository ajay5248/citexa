"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Loader2 } from "lucide-react";
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

export default function Audits() {
  const router = useRouter();
  const [audits, setAudits] = useState<any[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch websites
      const webRes = await fetch("/api/websites/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const webData = await webRes.json();
      setWebsites(Array.isArray(webData) ? webData : []);

      // Fetch audits
      const auditRes = await fetch("/api/audits/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const auditData = await auditRes.json();
      setAudits(Array.isArray(auditData) ? auditData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    if (websites.length === 0) {
      alert("Please add a website first.");
      window.location.href = '/dashboard/websites';
      return;
    }
    
    setRunning(true);
    try {
      const token = localStorage.getItem("token");
      // Run audit for the first website by default
      const res = await fetch("/api/audits/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ website_id: websites[0].id })
      });
      
      if (res.ok) {
        // Refresh audits
        fetchData();
      } else {
        alert("Failed to start audit.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="h-10 w-10 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AI Visibility Audits</h2>
          <p className="text-gray-400 mt-1">View past audits and run new ones to track your AI readiness.</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleRunAudit} disabled={running || websites.length === 0} className="shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all">
            {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />} 
            Run New Audit
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative"
      >
        {/* Subtle background gradient inside table container */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent bg-black/20">
              <TableHead className="text-gray-300 font-medium">Audit ID</TableHead>
              <TableHead className="text-gray-300 font-medium">Date</TableHead>
              <TableHead className="text-gray-300 font-medium">Status</TableHead>
              <TableHead className="text-gray-300 font-medium">Schema Score</TableHead>
              <TableHead className="text-gray-300 font-medium">Content Score</TableHead>
              <TableHead className="text-right text-gray-300 font-medium">Overall Score</TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-white/5"
          >
            {audits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    No audits found. Run one to get started!
                  </motion.div>
                </TableCell>
              </TableRow>
            ) : audits.map((audit) => (
              <motion.tr 
                key={audit.id} 
                className="border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                onClick={() => router.push(`/dashboard/audits/${audit.id}`)}
                variants={itemVariants}
              >
                <TableCell className="font-medium text-primary group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] transition-all">AUD-{audit.id}</TableCell>
                <TableCell className="text-gray-400">{new Date(audit.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${
                    audit.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : audit.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {audit.status.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-gray-300">{audit.schema_score}/100</TableCell>
                <TableCell className="text-gray-300">{audit.content_score}/100</TableCell>
                <TableCell className="text-right font-bold text-primary group-hover:scale-105 transition-transform origin-right">
                  {audit.overall_score}/100
                </TableCell>
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
      </motion.div>
    </div>
  );
}
