"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Settings() {
  return (
    <div className="space-y-8 max-w-2xl relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Settings</h2>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <div className="space-y-4 rounded-xl border border-white/10 bg-card/40 p-6 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
              Profile Information
            </h3>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input id="name" defaultValue="Ajay Adhikari" className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input id="email" defaultValue="ajay@citexa.com" type="email" className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors" />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all">
                Save Changes
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="space-y-4 rounded-xl border border-white/10 bg-card/40 p-6 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
              Password
            </h3>
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-gray-300">Current Password</Label>
              <Input id="current-password" type="password" className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-gray-300">New Password</Label>
              <Input id="new-password" type="password" className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors" />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
              <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10 transition-colors shadow-[0_0_15px_rgba(var(--primary),0.1)] hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                Update Password
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
