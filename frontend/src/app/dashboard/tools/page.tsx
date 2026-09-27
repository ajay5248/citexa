"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Code, Loader2, Database, Download, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, staggerChildren: 0.1 } 
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")) ? "/api" : "https://citexa.onrender.com");

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<"faq" | "schema" | "bulk">("faq");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [userPlan, setUserPlan] = useState("free");
  
  // Single Schema state
  const [businessType, setBusinessType] = useState("Organization");
  const [businessName, setBusinessName] = useState("");
  const [businessDesc, setBusinessDesc] = useState("");

  // Bulk Schema state
  const [bulkPlatform, setBulkPlatform] = useState("WordPress");
  const [bulkSchemaType, setBulkSchemaType] = useState("Product");
  const [bulkCsvText, setBulkCsvText] = useState(
    "https://example.com/product-1,Product Alpha,Amazing AI enabled camera\nhttps://example.com/product-2,Product Beta,Smart robotic assistant"
  );

  interface FAQ {
    question: string;
    answer: string;
  }

  interface ToolsResult {
    faqs?: FAQ[];
    json_ld?: string;
  }

  interface BulkResultItem {
    url: string;
    json_ld: string;
  }

  const [result, setResult] = useState<ToolsResult | null>(null);
  const [bulkResult, setBulkResult] = useState<BulkResultItem[] | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${apiUrl}/users/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setUserPlan(user.plan || "free");
        }
      } catch (e) {
        console.error("Error fetching user role in tools page:", e);
      }
    };
    fetchUser();
  }, []);

  const handleGenerateFAQ = async () => {
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/tools/generate-faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          url: url || undefined, 
          topic: topic || undefined,
          count: count
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        alert(data.detail || "Failed to generate FAQ");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSchema = async () => {
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/tools/generate-schema`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ url, business_type: businessType, name: businessName, description: businessDesc }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        alert(data.detail || "Failed to generate Schema");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBulkSchema = async () => {
    setLoading(true);
    setBulkResult(null);
    try {
      const token = localStorage.getItem("token");
      const lines = bulkCsvText.split("\n").filter(line => line.trim() !== "");
      const items = lines.map(line => {
        const parts = line.split(",");
        return {
          url: parts[0]?.trim() || "https://example.com",
          name: parts[1]?.trim() || "Entity Name",
          description: parts[2]?.trim() || ""
        };
      });

      const res = await fetch(`${apiUrl}/tools/generate-bulk-schema`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform: bulkPlatform,
          schema_type: bulkSchemaType,
          items: items
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBulkResult(data.schemas);
      } else {
        alert(data.detail || "Failed to generate bulk schemas");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBulk = () => {
    if (!bulkResult) return;
    const combinedContent = bulkResult.map(item => `<!-- URL: ${item.url} -->\n${item.json_ld}\n`).join("\n");
    const blob = new Blob([combinedContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `citexa-ai_bulk_schemas_${bulkSchemaType.toLowerCase()}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6 relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AEO Tools</h1>
        <p className="text-gray-400 mt-2">Generate optimized content and markup for Answer Engines.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex space-x-4 mb-6 border-b border-white/10 pb-2 relative overflow-x-auto scrollbar-none"
      >
        <button 
          onClick={() => { setActiveTab("faq"); setResult(null); setBulkResult(null); }}
          className={`flex items-center space-x-2 pb-2 px-4 transition-colors relative whitespace-nowrap ${activeTab === "faq" ? "text-primary" : "text-gray-400 hover:text-white"}`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>FAQ Generator</span>
          {activeTab === "faq" && (
            <motion.div layoutId="activeTab" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
          )}
        </button>
        <button 
          onClick={() => { setActiveTab("schema"); setResult(null); setBulkResult(null); }}
          className={`flex items-center space-x-2 pb-2 px-4 transition-colors relative whitespace-nowrap ${activeTab === "schema" ? "text-primary" : "text-gray-400 hover:text-white"}`}
        >
          <Code className="h-4 w-4" />
          <span>Schema Generator</span>
          {activeTab === "schema" && (
            <motion.div layoutId="activeTab" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
          )}
        </button>
        <button 
          onClick={() => { setActiveTab("bulk"); setResult(null); setBulkResult(null); }}
          className={`flex items-center space-x-2 pb-2 px-4 transition-colors relative whitespace-nowrap ${activeTab === "bulk" ? "text-primary" : "text-gray-400 hover:text-white"}`}
        >
          <Database className="h-4 w-4" />
          <span>Bulk Schema Automation</span>
          {activeTab === "bulk" && (
            <motion.div layoutId="activeTab" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
          )}
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "faq" && (
          <motion.div 
            key="faq"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <CardHeader>
                  <CardTitle className="text-white">Generate AEO FAQs</CardTitle>
                  <CardDescription className="text-gray-400">Enter a topic or URL to generate FAQs designed for featured snippets.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Target URL (Optional)</label>
                    <Input 
                      placeholder="https://example.com" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)} 
                      className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Topic (Optional)</label>
                    <Input 
                      placeholder="e.g. AI Search Visibility" 
                      value={topic} 
                      onChange={(e) => setTopic(e.target.value)} 
                      className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Number of FAQs</label>
                    <select
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-md bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors text-sm"
                    >
                      <option value={5} className="bg-neutral-900">5 FAQs (Free)</option>
                      <option value={10} className="bg-neutral-900">10 FAQs (Free)</option>
                      <option value={50} className="bg-neutral-900">50 FAQs (Free)</option>
                      <option value={100} className="bg-neutral-900">100 FAQs (Free)</option>
                      <option value={500} className="bg-neutral-900">500 FAQs (Free)</option>
                      <option value={1000} className="bg-neutral-900">1000+ FAQs (Free)</option>
                    </select>
                    <p className="text-[10px] text-primary flex items-center gap-1 mt-1 leading-normal">
                      🎉 Multi-batch FAQ generation is fully unlocked! Generate up to 1000+ FAQs for free.
                    </p>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all mt-4" 
                      onClick={handleGenerateFAQ}
                      disabled={loading || (!url && !topic)}
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                      Generate FAQs
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {result && result.faqs && (
              <motion.div 
                variants={itemVariants}
                className="space-y-6 max-h-[600px] overflow-y-auto pr-2"
              >
                <Card className="bg-primary/5 border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.1)] backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)] animate-pulse" />
                      Generated FAQs ({result.faqs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.faqs.map((faq: FAQ, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="bg-black/40 p-4 rounded-lg border border-white/10 hover:border-primary/30 transition-colors"
                      >
                        <h4 className="font-semibold text-white mb-2 leading-relaxed">Q: {faq.question}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">A: {faq.answer}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                  <CardHeader>
                    <CardTitle className="text-white">JSON-LD Code</CardTitle>
                    <CardDescription className="text-gray-400">Inject this into your {"website's"} &lt;head&gt;.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-xs text-blue-300 border border-white/10 max-h-[300px] overflow-y-auto">
                      <code>{result.json_ld}</code>
                    </pre>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "schema" && (
          <motion.div 
            key="schema"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <CardHeader>
                  <CardTitle className="text-white">Generate JSON-LD Schema</CardTitle>
                  <CardDescription className="text-gray-400">Create accurate schema markup to help AI engines categorize you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Website URL</label>
                    <Input 
                      placeholder="https://example.com" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)} 
                      className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Business Name</label>
                    <Input 
                      placeholder="Citexa-AI" 
                      value={businessName} 
                      onChange={(e) => setBusinessName(e.target.value)} 
                      className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Business Type</label>
                    <Input 
                      placeholder="Organization, LocalBusiness, etc." 
                      value={businessType} 
                      onChange={(e) => setBusinessType(e.target.value)} 
                      className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Short Description</label>
                    <Textarea 
                      placeholder="Describe what your business does..." 
                      value={businessDesc} 
                      onChange={(e) => setBusinessDesc(e.target.value)} 
                      className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all mt-4" 
                      onClick={handleGenerateSchema}
                      disabled={loading || !url || !businessName}
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Code className="mr-2 h-4 w-4" />}
                      Generate Schema
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {result && result.json_ld && (
              <motion.div variants={itemVariants}>
                <Card className="bg-primary/5 border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.1)] backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)] animate-pulse" />
                      Generated JSON-LD
                    </CardTitle>
                    <CardDescription className="text-gray-400">Inject this into your {"website's"} &lt;head&gt;.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-sm text-blue-300 border border-white/10 max-h-[300px] overflow-y-auto">
                      <code>{result.json_ld}</code>
                    </pre>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        className="mt-6 w-full border-primary/50 text-primary hover:bg-primary/10 transition-colors shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(result.json_ld || "");
                          alert("Copied to clipboard!");
                        }}
                      >
                        Copy to Clipboard
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "bulk" && (
          <motion.div 
            key="bulk"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Bulk Schema Automation
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Auto-generate thousands of schemas at scale for your headless CMS or bulk imports.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Target Platform</label>
                      <select 
                        value={bulkPlatform}
                        onChange={(e) => setBulkPlatform(e.target.value)}
                        className="w-full h-11 px-3 rounded-md bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors text-sm"
                      >
                        <option value="WordPress" className="bg-neutral-900">WordPress (AIOSEO/RankMath)</option>
                        <option value="Shopify" className="bg-neutral-900">Shopify Template</option>
                        <option value="Custom API" className="bg-neutral-900">Custom Code (Node.js/Python)</option>
                        <option value="Enterprise Webflow" className="bg-neutral-900">Webflow Headless</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Schema Type</label>
                      <select 
                        value={bulkSchemaType}
                        onChange={(e) => setBulkSchemaType(e.target.value)}
                        className="w-full h-11 px-3 rounded-md bg-black/20 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-colors text-sm"
                      >
                        <option value="Product" className="bg-neutral-900">Product Schema</option>
                        <option value="Article" className="bg-neutral-900">Article Schema</option>
                        <option value="LocalBusiness" className="bg-neutral-900">Local Business Schema</option>
                        <option value="Organization" className="bg-neutral-900">Organization Schema</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex justify-between items-center">
                      <span>Import Page Content (CSV format: URL, Name, Description)</span>
                      <span className="text-[10px] text-gray-400">Paste up to 1000 pages</span>
                    </label>
                    <Textarea 
                      value={bulkCsvText}
                      onChange={(e) => setBulkCsvText(e.target.value)}
                      placeholder="https://example.com/page-1,Page Alpha,Description Alpha"
                      rows={6}
                      className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors font-mono text-xs"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all mt-2" 
                      onClick={handleGenerateBulkSchema}
                      disabled={loading || !bulkCsvText}
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                      Deploy Bulk Automation ({bulkCsvText.split("\n").filter(l => l.trim() !== "").length} Pages)
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {bulkResult && (
              <motion.div variants={itemVariants} className="space-y-6">
                <Card className="bg-primary/5 border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.1)] backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-primary flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)] animate-pulse" />
                        Automation Live: Generated {bulkResult.length} Schemas
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        JSON-LD schema templates successfully packaged for your {bulkPlatform} database injection.
                      </CardDescription>
                    </div>
                    <Button 
                      size="sm"
                      onClick={handleDownloadBulk}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                      <Download className="h-4 w-4" />
                      Download Export
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {bulkResult.map((item, i) => (
                      <div key={i} className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-2">
                        <div className="text-[10px] text-gray-400 font-mono select-all">URL: {item.url}</div>
                        <pre className="bg-black/60 p-2 rounded text-[10px] text-blue-300 border border-white/5 overflow-x-auto max-h-[120px]">
                          <code>{item.json_ld}</code>
                        </pre>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
