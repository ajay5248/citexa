"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Loader2, Play } from "lucide-react";
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

interface Website {
  id: number;
  url: string;
  created_at: string;
}

export default function Websites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [runningAuditId, setRunningAuditId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleLocationChange = () => {
        const query = new URLSearchParams(window.location.search).get("search") || "";
        setSearchQuery(query);
      };
      
      handleLocationChange();
      
      window.addEventListener("popstate", handleLocationChange);
      
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;
      
      window.history.pushState = function(...args) {
        originalPushState.apply(this, args);
        handleLocationChange();
      };
      window.history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        handleLocationChange();
      };
      
      return () => {
        window.removeEventListener("popstate", handleLocationChange);
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
      };
    }
  }, []);

  const fetchWebsites = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch("/api/websites/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWebsites(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Error fetching websites:", e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchWebsites();
  }, [fetchWebsites]);

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/websites/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ url: newUrl })
      });
      if (res.ok) {
        setNewUrl("");
        setShowAddDialog(false);
        fetchWebsites();
      } else {
        const errorText = await res.text();
        let message = "Failed to add website.";
        try {
          const errData = JSON.parse(errorText);
          if (errData && errData.detail) message = `Failed to add website: ${errData.detail}`;
        } catch (_) {
          message = `Failed to add website: ${res.status} ${res.statusText}`;
        }
        alert(message);
      }
    } catch (e) {
      console.error("Error adding website:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWebsite = async (id: number) => {
    if (!confirm("Are you sure you want to delete this website? This will delete all associated audits and competitors.")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/websites/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchWebsites();
      } else {
        alert("Failed to delete website.");
      }
    } catch (e) {
      console.error("Error deleting website:", e);
    }
  };

  const handleRunAudit = async (websiteId: number) => {
    setRunningAuditId(websiteId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/audits/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ website_id: websiteId })
      });
      if (res.ok) {
        const audit = await res.json();
        router.push(`/dashboard/audits/${audit.id}`);
      } else {
        alert("Failed to start audit.");
      }
    } catch (e) {
      console.error("Error running audit:", e);
    } finally {
      setRunningAuditId(null);
    }
  };

  const filteredWebsites = websites.filter(website =>
    website.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-10 w-10 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
        </motion.div>
      </div>
    );
  }

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
          <Button onClick={() => setShowAddDialog(true)} className="shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all">
            <Plus className="mr-2 h-4 w-4" /> Add Website
          </Button>
        </motion.div>
      </motion.div>

      {websites.length > 0 ? (
        filteredWebsites.length > 0 ? (
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
                  <TableHead className="text-gray-300 font-medium">Created At</TableHead>
                  <TableHead className="text-right text-gray-300 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-white/5"
              >
                {filteredWebsites.map((website) => (
                  <motion.tr 
                    key={website.id} 
                    className="border-white/5 hover:bg-white/5 transition-colors group"
                    variants={itemVariants}
                  >
                    <TableCell className="font-medium text-white group-hover:text-primary transition-colors">{website.url}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                        Active
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400">{new Date(website.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          disabled={runningAuditId === website.id}
                          onClick={() => handleRunAudit(website.id)}
                          className="text-primary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all"
                        >
                          {runningAuditId === website.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Play className="h-4 w-4 mr-1" />
                          )}
                          Run Audit
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteWebsite(website.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                ))}
              </motion.tbody>
            </Table>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-card/20 border border-white/10 rounded-2xl">
            <p className="text-gray-400 mb-4">No websites match your search: "{searchQuery}".</p>
            <Button onClick={() => { setNewUrl(searchQuery); setShowAddDialog(true); }}>
              Track "{searchQuery}"
            </Button>
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-card/20 border border-white/10 rounded-2xl">
          <p className="text-gray-400 mb-4">No websites tracked yet.</p>
          <Button onClick={() => setShowAddDialog(true)}>Track Your First Website</Button>
        </div>
      )}

      {/* Add Website Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-card border border-white/10 rounded-2xl p-6 shadow-2xl relative"
          >
            <h3 className="text-xl font-bold text-white mb-2">Add New Website</h3>
            <p className="text-gray-400 text-sm mb-6">Enter the URL of the website you want to track for AI visibility analysis.</p>
            
            <form onSubmit={handleAddWebsite} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium text-gray-300">Website URL</label>
                <input
                  id="url"
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-white/10 bg-background/50 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowAddDialog(false)}
                  className="border border-white/10 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                >
                  {submitting ? "Adding..." : "Add Website"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
