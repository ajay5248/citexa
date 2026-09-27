import { getApiUrl } from "@/lib/site";

export interface MiniAuditSummary {
  id: string;
  url: string;
  score: number;
  grade: string;
  passed_count: number;
  total_count: number;
  top_issues: string[];
}

export interface MiniAuditCheck {
  id: string;
  title: string;
  passed: boolean;
  weight: number;
  detail: string;
  fix: string;
}

export interface MiniAuditReport extends MiniAuditSummary {
  checks: MiniAuditCheck[];
}

async function post<T>(path: string, body: unknown, fallback: string): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? String(detail[0]?.msg || "").replace(/^Value error, /, "")
      : typeof detail === "string" ? detail : "";
    throw new Error(message || fallback);
  }
  return res.json();
}

export const runMiniAudit = (url: string) =>
  post<MiniAuditSummary>("/mini-audit", { url }, "We couldn't check that website. Please try again.");

export const unlockReport = (id: string, email: string) =>
  post<MiniAuditReport>(`/mini-audit/${encodeURIComponent(id)}/unlock`, { email }, "We couldn't unlock the report. Please try again.");
