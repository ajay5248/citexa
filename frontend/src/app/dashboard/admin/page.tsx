"use client";

import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileSearch, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

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

export default function AdminPanel() {
  const users = [
    { name: "Ajay Adhikari", email: "ajay@citexa.com", role: "Admin", status: "Active" },
    { name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
  ];

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
              <div className="text-3xl font-bold text-white drop-shadow-md">1,204</div>
              <p className="text-xs text-green-400 mt-2 bg-green-500/10 w-max px-2 py-1 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">+120 this month</p>
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
              <div className="text-3xl font-bold text-white drop-shadow-md">8,540</div>
              <p className="text-xs text-green-400 mt-2 bg-green-500/10 w-max px-2 py-1 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">+450 this week</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="bg-card/40 backdrop-blur-md border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Monthly Revenue</CardTitle>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-purple-500/10 transition-colors">
                <DollarSign className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white drop-shadow-md">₹1,24,000</div>
              <p className="text-xs text-green-400 mt-2 bg-green-500/10 w-max px-2 py-1 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">+15% from last month</p>
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
              <TableHead className="text-gray-300 font-medium">Role</TableHead>
              <TableHead className="text-gray-300 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-white/5"
          >
            {users.map((user) => (
              <motion.tr 
                key={user.email} 
                className="border-white/5 hover:bg-white/5 transition-colors group"
                variants={itemVariants}
              >
                <TableCell className="font-medium text-white group-hover:text-primary transition-colors">{user.name}</TableCell>
                <TableCell className="text-gray-400">{user.email}</TableCell>
                <TableCell className="text-gray-400">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${user.role === 'Admin' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/10 text-gray-300 border border-white/20'}`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                    {user.status}
                  </span>
                </TableCell>
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
      </motion.div>
    </div>
  );
}
