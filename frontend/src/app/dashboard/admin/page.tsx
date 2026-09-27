"use client";

import { useEffect, useState } from "react";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileSearch, DollarSign, Loader2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/site";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

interface UserSummary {
  full_name: string;
  email: string;
  role: string;
  plan: string;
  subscription_status: string;
  created_at: string;
}

interface Lead {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  message: string | null;
  source: string | null;
  created_at: string;
}

interface Purchase {
  id: number;
  plan_id: string;
  amount_paise: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  status: string;
  razorpay_payment_id: string | null;
  created_at: string;
}

interface AdminStats {
  total_users: number;
  total_websites: number;
  total_audits: number;
  total_revenue_usd: number;
  users: UserSummary[];
}

const PLAN_LABELS: Record<string, string> = {
  report: "Report",
  audit_fix: "Audit + Fix",
  starter_monthly: "Monthly Starter",
  monthly: "Monthly Monitoring",
};

// Indian numbers are often entered without the country code
const whatsappHref = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
};

const apiUrl = getApiUrl();

export default function AdminPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${apiUrl}/admin/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.status === 403) {
          setError("access_denied");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch admin statistics");
        }

        const data = await res.json();
        setStats(data);

        const leadsRes = await fetch(`${apiUrl}/admin/leads`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (leadsRes.ok) {
          setLeads(await leadsRes.json());
        }

        const purchasesRes = await fetch(`${apiUrl}/admin/purchases`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (purchasesRes.ok) {
          setPurchases(await purchasesRes.json());
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-10 w-10 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
        </motion.div>
        <p className="text-gray-400 text-sm font-mono animate-pulse">Retrieving admin records...</p>
      </div>
    );
  }

  if (error === "access_denied") {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] max-w-md mx-auto text-center gap-6 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-yellow-500 rounded-2xl blur-xl opacity-20 pointer-events-none" />
        <div className="relative z-10 bg-card/60 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
          <div className="p-4 bg-red-500/10 rounded-full text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Access Denied</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            You do not have the required permissions to view the Admin Dashboard. Please contact the administrator if you believe this is an error.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dashboard")}
            className="w-full mt-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all"
          >
            Return to Command Center
          </motion.button>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center text-red-500 py-12">
        <p className="font-medium">Error: {error || "Failed to load admin stats"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Admin Dashboard</h2>
        <p className="text-gray-400 mt-1">Manage users, view system analytics, and monitor performance.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-card/40 backdrop-blur-md border-white/10 hover:border-primary/30 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_0_20px_rgba(var(--primary),0.15)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white drop-shadow-md">{stats.total_users}</div>
              <p className="text-xs text-green-400 mt-2 bg-green-500/10 w-max px-2 py-1 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">Platform registered</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="bg-card/40 backdrop-blur-md border-white/10 hover:border-blue-500/30 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Audits Run</CardTitle>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                <FileSearch className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white drop-shadow-md">{stats.total_audits}</div>
              <p className="text-xs text-blue-400 mt-2 bg-blue-500/10 w-max px-2 py-1 rounded-full border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">AEO runs completed</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="bg-card/40 backdrop-blur-md border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Estimated MRR</CardTitle>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-purple-500/10 transition-colors">
                <DollarSign className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white drop-shadow-md">${stats.total_revenue_usd}</div>
              <p className="text-xs text-purple-400 mt-2 bg-purple-500/10 w-max px-2 py-1 rounded-full border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]">Active subscriptions</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] mt-8 relative"
      >
        <div className="p-4 border-b border-white/10 bg-black/20">
          <h3 className="text-lg font-semibold text-white">Payments ({purchases.filter((p) => p.status === "paid" || p.status === "active").length} paid)</h3>
          <p className="text-xs text-gray-500">Razorpay checkouts. &quot;created&quot; means the buyer opened checkout but hasn&apos;t paid.</p>
        </div>
        {purchases.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-300 font-medium">Date</TableHead>
                  <TableHead className="text-gray-300 font-medium">Package</TableHead>
                  <TableHead className="text-gray-300 font-medium">Amount</TableHead>
                  <TableHead className="text-gray-300 font-medium">Status</TableHead>
                  <TableHead className="text-gray-300 font-medium">Buyer</TableHead>
                  <TableHead className="text-gray-300 font-medium">Website</TableHead>
                </TableRow>
              </TableHeader>
              <tbody className="divide-y divide-white/5">
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id} className="border-white/5 hover:bg-white/5 align-top">
                    <TableCell className="text-gray-400 text-sm whitespace-nowrap">{new Date(/[zZ]|[+-]\d\d:\d\d$/.test(purchase.created_at) ? purchase.created_at : `${purchase.created_at}Z`).toLocaleString()}</TableCell>
                    <TableCell className="text-white text-sm">{PLAN_LABELS[purchase.plan_id] ?? purchase.plan_id}</TableCell>
                    <TableCell className="text-gray-300 text-sm whitespace-nowrap">₹{(purchase.amount_paise / 100).toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase ${purchase.status === "paid" || purchase.status === "active" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-gray-400 border border-white/10"}`}>
                        {purchase.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      <div className="text-white">{purchase.name}</div>
                      {purchase.email && <div><a href={`mailto:${purchase.email}`} className="hover:text-primary">{purchase.email}</a></div>}
                      {purchase.phone && <div><a href={whatsappHref(purchase.phone)} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">{purchase.phone}</a></div>}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {purchase.website && /^https?:\/\//i.test(purchase.website) && <a href={purchase.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary break-all">{purchase.website}</a>}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] mt-8 relative"
      >
        <div className="p-4 border-b border-white/10 bg-black/20">
          <h3 className="text-lg font-semibold text-white">Leads ({leads.length})</h3>
          <p className="text-xs text-gray-500">UPI orders, free audit requests, instant-check email unlocks and contact form messages.</p>
        </div>
        {leads.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-300 font-medium">Received</TableHead>
                  <TableHead className="text-gray-300 font-medium">Type</TableHead>
                  <TableHead className="text-gray-300 font-medium">Name</TableHead>
                  <TableHead className="text-gray-300 font-medium">Contact</TableHead>
                  <TableHead className="text-gray-300 font-medium">Website</TableHead>
                  <TableHead className="text-gray-300 font-medium">Message</TableHead>
                </TableRow>
              </TableHeader>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="border-white/5 hover:bg-white/5 align-top">
                    <TableCell className="text-gray-400 text-sm whitespace-nowrap">{new Date(/[zZ]|[+-]\d\d:\d\d$/.test(lead.created_at) ? lead.created_at : `${lead.created_at}Z`).toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap ${lead.source === 'order' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : lead.source === 'free-audit' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : lead.source === 'mini-audit' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        {lead.source === 'order' ? 'UPI ORDER' : lead.source === 'free-audit' ? 'FREE AUDIT' : lead.source === 'mini-audit' ? 'MINI AUDIT' : 'CONTACT'}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-white">{lead.name}</TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {lead.email && <div><a href={`mailto:${lead.email}`} className="hover:text-primary">{lead.email}</a></div>}
                      {lead.phone && <div><a href={whatsappHref(lead.phone)} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">{lead.phone}</a></div>}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {lead.website && /^https?:\/\//i.test(lead.website) && <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary break-all">{lead.website}</a>}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm max-w-xs whitespace-pre-wrap">{lead.message}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] mt-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="p-4 border-b border-white/10 bg-black/20">
          <h3 className="text-lg font-semibold text-white">User Management</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-300 font-medium">Name</TableHead>
              <TableHead className="text-gray-300 font-medium">Email</TableHead>
              <TableHead className="text-gray-300 font-medium">Plan</TableHead>
              <TableHead className="text-gray-300 font-medium">Role</TableHead>
              <TableHead className="text-gray-300 font-medium">Registered Date</TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-white/5"
          >
            {stats.users.map((user) => (
              <motion.tr 
                key={user.email} 
                className="border-white/5 hover:bg-white/5 transition-colors group animate-none"
                variants={itemVariants}
              >
                <TableCell className="font-medium text-white group-hover:text-primary transition-colors">{user.full_name}</TableCell>
                <TableCell className="text-gray-400">{user.email}</TableCell>
                <TableCell className="text-gray-400 font-mono">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${user.plan === 'free' ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                    {user.plan.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                    {user.role.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
      </motion.div>
    </div>
  );
}
