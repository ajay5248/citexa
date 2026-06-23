"use client";

import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
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

export default function Websites() {
  const websites = [
    { url: "https://example.com", status: "Active", lastAudit: "2 hours ago" },
    { url: "https://mycompany.io", status: "Active", lastAudit: "Yesterday" },
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
          <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Websites</h2>
          <p className="text-gray-400 mt-1">Manage the websites you are tracking for AI visibility.</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all">
            <Plus className="mr-2 h-4 w-4" /> Add Website
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
              <TableHead className="text-gray-300 font-medium">Website URL</TableHead>
              <TableHead className="text-gray-300 font-medium">Status</TableHead>
              <TableHead className="text-gray-300 font-medium">Last Audit</TableHead>
              <TableHead className="text-right text-gray-300 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-white/5"
          >
            {websites.map((website) => (
              <motion.tr 
                key={website.url} 
                className="border-white/5 hover:bg-white/5 transition-colors group"
                variants={itemVariants}
              >
                <TableCell className="font-medium text-white group-hover:text-primary transition-colors">{website.url}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                    {website.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400">{website.lastAudit}</TableCell>
                <TableCell className="text-right">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all">
                      Run Audit
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
