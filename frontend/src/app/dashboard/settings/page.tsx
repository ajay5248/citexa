"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/site";

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

interface UserProfile {
  email: string;
  full_name: string;
  company: string | null;
  plan: string;
  subscription_status: string;
}

const apiUrl = getApiUrl();

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${apiUrl}/users/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFullName(data.full_name);
          setCompanyName(data.company || "");
        } else {
          if (res.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: fullName,
          company: companyName || null
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setMessage({ text: "Profile updated successfully!", type: "success" });
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to save profile changes");
      }
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "An error occurred", type: "error" });
    } finally {
      setSaving(false);
    }
  };

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
    <div className="space-y-8 max-w-2xl relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Settings</h2>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </motion.div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-xl border text-sm text-center font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
        >
          {message.text}
        </motion.div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <form onSubmit={handleSaveChanges} className="space-y-4 rounded-xl border border-white/10 bg-card/40 p-6 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
              Profile Information
            </h3>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input 
                id="name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-300">Company Name</Label>
              <Input 
                id="company" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
                className="bg-black/20 border-white/10 focus:border-primary/50 transition-colors" 
              />
            </div>
            <div className="space-y-2 opacity-80">
              <Label htmlFor="email" className="text-gray-300">Email Address (Read-only)</Label>
              <Input 
                id="email" 
                value={profile?.email || ""} 
                disabled 
                className="bg-black/40 border-white/5 text-gray-500 cursor-not-allowed" 
              />
            </div>
            <div className="space-y-2 opacity-80">
              <Label className="text-gray-300">Current Subscription Plan</Label>
              <Input 
                value={profile?.plan ? profile.plan.toUpperCase() : "FREE"} 
                disabled 
                className="bg-black/40 border-white/5 text-primary font-bold cursor-not-allowed" 
              />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
              <Button type="submit" disabled={saving} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all">
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
