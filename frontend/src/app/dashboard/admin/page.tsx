"use client";

import { useEffect, useState } from "react";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileSearch, DollarSign, Loader2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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

interface AdminStats {
  total_users: number;
  total_websites: number;
  total_audits: number;
  total_revenue_usd: number;
  users: UserSummary[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")) ? "/api" : "https://citexa-ai.onrender.com");

export default function AdminPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
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
