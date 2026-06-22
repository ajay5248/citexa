"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
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

export default function Reports() {
  const reports = [
    { title: "Monthly AI Visibility Report - Oct", type: "Executive Summary", date: "Oct 31, 2026", size: "1.2 MB" },
    { title: "Competitor Landscape Analysis", type: "Deep Dive", date: "Oct 15, 2026", size: "3.4 MB" },
    { title: "Schema Gap Analysis", type: "Technical Audit", date: "Sep 28, 2026", size: "840 KB" },
  ];

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
          <Button className="shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all">
            Generate New Report
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
            {reports.map((report) => (
              <motion.tr 
                key={report.title} 
                className="border-white/5 hover:bg-white/5 transition-colors group"
                variants={itemVariants}
              >
                <TableCell className="font-medium text-white group-hover:text-primary transition-colors">{report.title}</TableCell>
                <TableCell className="text-gray-400">{report.type}</TableCell>
                <TableCell className="text-gray-400">{report.date}</TableCell>
                <TableCell className="text-right">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </motion.div>
                </TableCell>
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
      </motion.div>
    </div>
  );
}
