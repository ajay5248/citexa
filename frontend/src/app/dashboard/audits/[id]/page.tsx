"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, ShieldAlert, Sparkles, Code, MessageSquare, BarChart3, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AuditDetail() {
  const params = useParams();
  const router = useRouter();
  const [audit, setAudit] = useState<any>(null);
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        // Fetch specific audit
        const auditRes = await fetch(`${apiUrl}/audits/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!auditRes.ok) {
          if (auditRes.status === 404) {
            throw new Error("Audit not found");
          } else if (auditRes.status === 403) {
            throw new Error("Not authorized to view this audit");
          } else {
            throw new Error("Failed to load audit details");
          }
        }

        const auditData = await auditRes.json();
        setAudit(auditData);

        // Fetch websites list to cross-reference URL
        const webRes = await fetch(`${apiUrl}/websites/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (webRes.ok) {
          const webData = await webRes.json();
          const matchedWeb = webData.find((w: any) => w.id === auditData.website_id);
          setWebsite(matchedWeb);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchAuditData();
    }
  }, [params, router]);

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

  if (error || !audit) {
    return (
      <div className="space-y-6 max-w-xl mx-auto text-center py-16 bg-card/20 border border-red-500/20 rounded-2xl p-8 shadow-2xl">
        <ShieldAlert className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white">Error Loading Audit</h3>
        <p className="text-gray-400 font-light text-sm">{error || "Audit not found."}</p>
        <Button onClick={() => router.push("/dashboard/audits")} variant="outline" className="mt-6 border-white/10 text-white rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Audits
        </Button>
      </div>
    );
  }

  // Parse audit data recommendations
  let recommendations = [];
  try {
    if (audit.audit_data) {
      const parsedData = JSON.parse(audit.audit_data);
      recommendations = parsedData.recommendations || [];
    }
  } catch (e) {
    console.error("Error parsing audit recommendations:", e);
  }

  const websiteUrl = website?.url || "Scanning Website";
  const dateFormatted = new Date(audit.created_at).toLocaleString();

  return (
    <div className="space-y-8 relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => router.push("/dashboard/audits")} variant="ghost" className="text-gray-400 hover:text-white border border-white/10 p-2.5 rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Audit Report Details
            </h2>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <span className="font-bold text-primary font-mono">AUD-{audit.id}</span>
              <span className="text-gray-600">|</span>
              <span className="font-mono text-sm">{websiteUrl}</span>
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500 font-mono self-end md:self-center">
          Generated: {dateFormatted}
        </div>
      </div>

      {/* Audit Status/Scores Section */}
      {audit.status === "pending" ? (
        <Card className="bg-card/40 backdrop-blur-xl border-border/20 py-16 text-center shadow-lg">
          <CardContent className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Audit Analysis in Progress...</h3>
            <p className="text-gray-400 font-light text-sm max-w-sm">
              We are querying search engine simulation models and computing citation velocity metrics. This usually takes under a minute.
            </p>
          </CardContent>
        </Card>
      ) : audit.status === "failed" ? (
        <Card className="bg-card/40 backdrop-blur-xl border-red-500/20 py-16 text-center shadow-lg">
          <CardContent className="flex flex-col items-center">
            <ShieldAlert className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Audit Analysis Failed</h3>
            <p className="text-gray-400 font-light text-sm max-w-md font-mono bg-black/30 p-3 rounded-lg border border-white/5">
              {audit.audit_data ? JSON.parse(audit.audit_data).error : "Unknown backend execution error."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Audit Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-4">
            <motion.div whileHover={{ y: -5 }}>
              <Card className="bg-card/40 backdrop-blur-xl border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-lg relative overflow-hidden group h-full">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-white drop-shadow-md flex items-baseline">
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-white to-primary/80">{Math.round(audit.overall_score)}</span>
                    <span className="text-lg text-gray-500 font-normal ml-1">/100</span>
                  </div>
                  <div className="mt-2 text-[10px] text-primary flex items-center bg-primary/10 w-max px-2 py-0.5 rounded-full border border-primary/20">
                    <Sparkles className="w-3 h-3 mr-1" /> Real-time AEO index
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }}>
              <Card className="bg-card/40 backdrop-blur-xl border-border/20 hover:border-blue-400/50 transition-all duration-300 shadow-lg h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Schema Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white flex items-baseline">
                    <span className="text-blue-400">{Math.round(audit.schema_score)}</span>
                    <span className="text-lg text-gray-500 font-normal ml-1">%</span>
                  </div>
                  <div className="mt-2 text-[10px] text-blue-400 flex items-center bg-blue-400/10 w-max px-2 py-0.5 rounded-full border border-blue-400/20">
                    <Code className="w-3 h-3 mr-1" /> JSON-LD validation
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }}>
              <Card className="bg-card/40 backdrop-blur-xl border-border/20 hover:border-purple-400/50 transition-all duration-300 shadow-lg h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider">FAQ Readiness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white flex items-baseline">
                    <span className="text-purple-400">{Math.round(audit.content_score)}</span>
                    <span className="text-lg text-gray-500 font-normal ml-1">%</span>
                  </div>
                  <div className="mt-2 text-[10px] text-purple-400 flex items-center bg-purple-400/10 w-max px-2 py-0.5 rounded-full border border-purple-400/20">
                    <MessageSquare className="w-3 h-3 mr-1" /> Content Q&A mapped
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }}>
              <Card className="bg-card/40 backdrop-blur-xl border-border/20 hover:border-emerald-400/50 transition-all duration-300 shadow-lg h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Citation Velocity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white flex items-baseline">
                    <span className="text-emerald-400">{Math.round(audit.citation_score)}</span>
                    <span className="text-lg text-gray-500 font-normal ml-1">%</span>
                  </div>
                  <div className="mt-2 text-[10px] text-emerald-400 flex items-center bg-emerald-400/10 w-max px-2 py-0.5 rounded-full border border-emerald-400/20">
                    <BarChart3 className="w-3 h-3 mr-1" /> Reference tracking
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Important Implementation Disclaimer */}
          <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6 backdrop-blur-md shadow-[0_0_30px_rgba(255,165,0,0.05)]">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-orange-500/5 blur-[50px] rounded-full pointer-events-none" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-orange-300 text-sm md:text-base">Implementation Notice</h4>
                <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed">
                  Citexa provides Answer Engine Optimization audits, automated markup definitions, and structured recommendations. **Citexa does not directly edit, update, inject, or deploy code or optimization services onto your live website.** All recommendations must be manually implemented by you or your technical administrator.
                </p>
              </div>
            </div>
          </div>

          {/* Audit Recommendations */}
          <Card className="bg-card/40 backdrop-blur-xl border-border/20 shadow-lg">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Strategic AEO Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex gap-4 items-start bg-white/5 border border-white/5 p-4 rounded-xl">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6 text-sm flex flex-col items-center justify-center gap-2">
                  <HelpCircle className="h-8 w-8 text-gray-600" />
                  <span>No specific recommendations returned. Check configuration settings.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
