"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Code, Loader2 } from "lucide-react";
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

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<"faq" | "schema">("faq");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState("");
  
  // Schema specific state
  const [businessType, setBusinessType] = useState("Organization");
  const [businessName, setBusinessName] = useState("");
  const [businessDesc, setBusinessDesc] = useState("");

  const [result, setResult] = useState<any>(null);

  const handleGenerateFAQ = async () => {
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tools/generate-faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ url: url || undefined, topic: topic || undefined }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
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
      const res = await fetch("/api/tools/generate-schema", {
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
        alert(data.detail || "Failed to generate Schema");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
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
        className="flex space-x-4 mb-6 border-b border-white/10 pb-2 relative"
      >
        <button 
          onClick={() => { setActiveTab("faq"); setResult(null); }}
          className={`flex items-center space-x-2 pb-2 px-4 transition-colors relative ${activeTab === "faq" ? "text-primary" : "text-gray-400 hover:text-white"}`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>FAQ Generator</span>
          {activeTab === "faq" && (
            <motion.div layoutId="activeTab" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
          )}
        </button>
        <button 
          onClick={() => { setActiveTab("schema"); setResult(null); }}
          className={`flex items-center space-x-2 pb-2 px-4 transition-colors relative ${activeTab === "schema" ? "text-primary" : "text-gray-400 hover:text-white"}`}
        >
          <Code className="h-4 w-4" />
          <span>Schema Generator</span>
          {activeTab === "schema" && (
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
                className="space-y-6"
              >
                <Card className="bg-primary/5 border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.1)] backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)] animate-pulse" />
                      Generated FAQs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.faqs.map((faq: any, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
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
                    <CardDescription className="text-gray-400">Inject this into your website's &lt;head&gt;.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-xs text-blue-300 border border-white/10">
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
                      placeholder="Citexa" 
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
                    <CardDescription className="text-gray-400">Inject this into your website's &lt;head&gt;.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-sm text-blue-300 border border-white/10">
                      <code>{result.json_ld}</code>
                    </pre>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        className="mt-6 w-full border-primary/50 text-primary hover:bg-primary/10 transition-colors shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(result.json_ld);
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
      </AnimatePresence>
    </div>
  );
}
