"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
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

export default function Billing() {
  const [plan, setPlan] = useState("pro");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPlan = localStorage.getItem("selected_plan");
      if (storedPlan) {
        setPlan(storedPlan);
      }
    }
  }, []);

  const planInfo = {
    starter: {
      name: "Starter Plan",
      price: "$49",
      features: [
        "Track 1 Website",
        "10 AI Audits per month",
        "Basic Schema Generation"
      ]
    },
    pro: {
      name: "Pro Plan",
      price: "$99",
      features: [
        "Track up to 10 Websites",
        "Unlimited AI Audits",
        "Advanced Schema & FAQs",
        "Competitor Tracking"
      ]
    },
    enterprise: {
      name: "Enterprise Plan",
      price: "$299",
      features: [
        "Unlimited Websites",
        "API Access",
        "White-label Reports",
        "Dedicated Account Manager"
      ]
    }
  };

  const currentPlan = planInfo[plan as keyof typeof planInfo] || planInfo.pro;

  return (
    <div className="space-y-8 max-w-4xl relative">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Billing & Plans</h2>
        <p className="text-gray-400 mt-1">Manage your subscription and billing details.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] h-full relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
              <CardTitle className="text-white">Current Plan</CardTitle>
              <CardDescription className="text-primary">You are currently on the {currentPlan.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold text-white drop-shadow-md flex items-end">
                {currentPlan.price}<span className="text-xl text-gray-400 font-normal ml-1 mb-1">/mo</span>
              </div>
              <ul className="space-y-3">
                {currentPlan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-300 group-hover:text-white transition-colors">
                    <Check className="h-4 w-4 mr-2 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" /> 
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full bg-black/20 border-white/10 hover:border-primary/50 hover:bg-primary/10 text-primary transition-all shadow-[0_0_15px_rgba(var(--primary),0.05)] hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                  Manage Subscription
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] h-full relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader>
              <CardTitle className="text-white">Payment Method</CardTitle>
              <CardDescription className="text-gray-400">Update your billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-4 p-4 border border-white/10 rounded-md bg-black/20 hover:border-blue-500/30 transition-colors"
              >
                <div className="bg-blue-500/20 p-2 rounded relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-md rounded" />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 relative z-10 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Visa ending in 4242</p>
                  <p className="text-xs text-gray-400">Expires 12/28</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all">
                  Update Payment Method
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
