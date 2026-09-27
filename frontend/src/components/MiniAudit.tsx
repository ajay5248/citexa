"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Gauge, Loader2, Lock, XCircle } from "lucide-react";
import { runMiniAudit, unlockReport, type MiniAuditReport, type MiniAuditSummary } from "@/lib/miniAudit";

const scoreColor = (score: number) => (score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400");

export function MiniAudit() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<MiniAuditSummary | null>(null);
  const [report, setReport] = useState<MiniAuditReport | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSummary(null);
    setReport(null);
    setLoading(true);
    try {
      setSummary(await runMiniAudit(url));
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't check that website.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary) return;
    setError("");
    setUnlocking(true);
    try {
      setReport(await unlockReport(summary.id, email));
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't unlock the report.");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <section id="check" className="w-full py-24 relative border-t border-white/[0.02] scroll-mt-20">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
            <Gauge className="h-4 w-4" /> Instant check
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">How AI-ready is your website?</h2>
          <p className="text-gray-400 md:text-lg">
            Enter your website to get an AI-readiness score in about 20 seconds. No signup needed.
          </p>
        </div>

        <form onSubmit={handleCheck} className="bg-card/50 backdrop-blur border border-border/50 p-2 rounded-2xl sm:rounded-full flex flex-col sm:flex-row gap-2 shadow-2xl">
          <label htmlFor="mini-audit-url" className="sr-only">Website address</label>
          <Input
            id="mini-audit-url"
            required
            maxLength={300}
            placeholder="yourwebsite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border-0 bg-transparent h-12 px-5 text-base focus-visible:ring-0 shadow-none flex-1 text-white"
          />
          <Button type="submit" disabled={loading} className="h-12 px-8 rounded-xl sm:rounded-full text-base">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking…</> : "Check my website"}
          </Button>
        </form>

        {error && <p className="mt-4 text-center text-sm text-red-400" role="alert">{error}</p>}

        {summary && (
          <div className="mt-8 bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6" aria-live="polite">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="text-center sm:text-left">
                <p className={`text-6xl font-black ${scoreColor(summary.score)}`}>{summary.score}<span className="text-2xl text-gray-500">/100</span></p>
                <p className="text-sm text-gray-400">{summary.grade} · {summary.passed_count} of {summary.total_count} checks passed</p>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Checked</p>
                <p className="text-white font-mono text-sm break-all">{summary.url}</p>
              </div>
            </div>

            {summary.top_issues.length > 0 && (
              <div>
                <h3 className="font-bold text-white mb-3">Top issues to fix</h3>
                <ul className="space-y-2">
                  {summary.top_issues.map((issue) => (
                    <li key={issue} className="flex items-center gap-3 text-gray-300"><XCircle className="h-5 w-5 text-red-400 shrink-0" /> {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {!report ? (
              <form onSubmit={handleUnlock} className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold"><Lock className="h-4 w-4 text-primary" /> Get the full report</div>
                <p className="text-sm text-gray-400">See all {summary.total_count} checks and exactly how to fix each one.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="mini-audit-email" className="sr-only">Email</label>
                  <Input id="mini-audit-email" type="email" required placeholder="you@business.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 text-white flex-1" />
                  <Button type="submit" disabled={unlocking} className="h-11 px-6 rounded-xl">
                    {unlocking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Show full report"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">We&apos;ll only use your email to follow up about your report. See our <Link href="/privacy" className="underline">privacy policy</Link>.</p>
              </form>
            ) : (
              <div className="space-y-3">
                <h3 className="font-bold text-white">Full report</h3>
                {report.checks.map((check) => (
                  <div key={check.id} className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <div className="flex items-center gap-2 font-medium text-white">
                      {check.passed ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : <XCircle className="h-5 w-5 text-red-400 shrink-0" />}
                      {check.title}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{check.detail}</p>
                    {!check.passed && <p className="text-sm text-gray-300 mt-2"><span className="text-primary font-semibold">How to fix:</span> {check.fix}</p>}
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 leading-relaxed">
              This score comes from {summary.total_count} automated technical checks of your homepage. It shows how easy your site is for AI engines to read, not whether they recommend you today.
              For that, <Link href="/audit" className="text-primary hover:underline">request a free manual AI visibility check</Link>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
