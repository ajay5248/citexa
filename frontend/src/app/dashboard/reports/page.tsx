"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

interface Report {
  id: number;
  title: string;
  report_type: string;
  created_at: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")) ? "/api" : "https://citexa.onrender.com");

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState("executive_summary");
  const [generating, setGenerating] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const res = await fetch(`${apiUrl}/reports/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(Array.isArray(data) ? data : []);
      } else {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/reports/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, report_type: reportType })
      });
      if (res.ok) {
        setTitle("");
        setReportType("executive_summary");
        setShowModal(false);
        fetchReports();
      } else {
        alert("Failed to generate report.");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating report.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (reportId: number, reportTitle: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/reports/${reportId}/download`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${reportTitle.replace(/\s+/g, "_")}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to download report.");
      }
    } catch (e) {
      console.error(e);
      alert("Error downloading report.");
    }
  };

  const getFriendlyType = (type: string) => {
    switch (type) {
      case "executive_summary":
        return "Executive Summary";
      case "deep_dive":
        return "Deep Dive";
      case "technical_audit":
        return "Technical Audit";
      default:
        return type;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
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
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Reports</h2>
          <p className="text-gray-400 mt-1">Download and share your AI Search performance reports.</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setShowModal(true)} className="shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all">
            <Plus className="mr-2 h-4 w-4" /> Generate New Report
          </Button>
        </motion.div>
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
              <TableHead className="text-gray-300 font-medium">Report Title</TableHead>
              <TableHead className="text-gray-300 font-medium">Type</TableHead>
              <TableHead className="text-gray-300 font-medium">Date Generated</TableHead>
              <TableHead className="text-right text-gray-300 font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-white/5"
          >
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                  No reports generated yet. Click "Generate New Report" to create one.
                </TableCell>
              </TableRow>
            ) : reports.map((report) => (
              <motion.tr 
                key={report.id} 
                className="border-white/5 hover:bg-white/5 transition-colors group"
                variants={itemVariants}
              >
                <TableCell className="font-medium text-white group-hover:text-primary transition-colors">{report.title}</TableCell>
                <TableCell className="text-gray-400">{getFriendlyType(report.report_type)}</TableCell>
                <TableCell className="text-gray-400">{new Date(report.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                    <Button onClick={() => handleDownload(report.id, report.title)} variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </motion.div>
                </TableCell>
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
      </motion.div>

      {/* Generate Report Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-card border border-white/10 rounded-2xl p-6 shadow-2xl relative"
          >
            <h3 className="text-xl font-bold text-white mb-2">Generate New Report</h3>
            <p className="text-gray-400 text-sm mb-6">Create a summary report containing visibility audit data or competitor comparisons.</p>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-300">Report Title</label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g. AI Search Visibility - Q2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-white/10 bg-background/50 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium text-gray-300">Report Type</label>
                <select
                  id="type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#121214] text-white focus:outline-none focus:border-primary/50 text-sm cursor-pointer"
                >
                  <option value="executive_summary">Executive Summary</option>
                  <option value="deep_dive">Competitor Landscape (Deep Dive)</option>
                  <option value="technical_audit">Schema & Technical Audit</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowModal(false)}
                  className="border border-white/10 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={generating || !title}
                  className="bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                >
                  {generating ? "Generating..." : "Generate"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
