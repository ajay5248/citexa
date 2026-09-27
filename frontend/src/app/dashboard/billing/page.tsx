"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const apiUrl = getApiUrl();

export default function Billing() {
  const [activePlan, setActivePlan] = useState<string>("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("inactive");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch(`${apiUrl}/billing/status`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setActivePlan(data.plan);
        setSubscriptionStatus(data.subscription_status);
      }
    } catch (e) {
      console.error("Error fetching billing status:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleUrlCallback = async () => {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      const statusParam = params.get("status");
      const planParam = params.get("plan");

      if (statusParam === "success" && planParam) {
        try {
          const token = localStorage.getItem("token");
          // Trigger simulated database update in backend
          const res = await fetch(`${apiUrl}/billing/simulate-checkout-success`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ plan_name: planParam })
          });

          if (res.ok) {
            setMessage({
              text: `Congratulations! You have successfully upgraded to the ${planParam.toUpperCase()} plan!`,
              type: "success"
            });
            // Clear search params
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (e) {
          console.error(e);
        }
      } else if (statusParam === "cancelled") {
        setMessage({
          text: "Checkout cancelled. You have not been charged.",
          type: "error"
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      await fetchStatus();
    };

    handleUrlCallback();
  }, [router]);

  const handleUpgrade = async (planName: string) => {
    setActionLoading(planName);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/billing/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ plan_name: planName })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.checkout_url) {
          if (data.simulated) {
            // Simulated local redirect
            router.push(data.checkout_url);
          } else {
            // Real Stripe Checkout redirect
            window.location.href = data.checkout_url;
          }
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to create checkout session");
      }
    } catch (e) {
      setMessage({
        text: e instanceof Error ? e.message : "Failed to initiate checkout process",
        type: "error"
      });
      setActionLoading(null);
    }
  };

  const planInfo = {
    free: {
      name: "Free Trial",
      price: "$0",
      features: [
        "Track 1 Website",
        "3 AI Audits total",
        "AEO Schema & FAQ Tool access",
        "Wikipedia Crawl simulation"
      ]
    },
    starter: {
      name: "Starter Plan",
      price: "$49",
      features: [
        "Track 2 Websites",
        "10 AI Audits total",
        "Full AEO FAQ Generator",
        "JSON-LD Schema Creator"
      ]
    },
    pro: {
      name: "Pro Plan",
      price: "$99",
      features: [
        "Track up to 10 Websites",
        "Unlimited AI Audits",
        "Competitor Tracking (Compare URL)",
        "Advanced LLM Audit Recommendations"
      ]
    },
    enterprise: {
      name: "Enterprise Plan",
      price: "$299",
      features: [
        "Unlimited Websites",
        "Unlimited Audits",
        "Custom PDF Executive Reports",
        "Dedicated Platform Support"
      ]
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
    <div className="space-y-8 max-w-5xl relative">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[20%] w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Billing & Plans</h2>
        <p className="text-gray-400 mt-1">Select and manage your subscription plans.</p>
      </motion.div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-xl border text-sm text-center font-medium flex items-center justify-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
        >
          {message.type === 'success' ? <Sparkles className="h-5 w-5 animate-bounce" /> : <AlertCircle className="h-5 w-5" />}
          {message.text}
        </motion.div>
      )}

      {/* Plan Display Cards Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {(Object.keys(planInfo) as Array<keyof typeof planInfo>).map((planKey) => {
          const plan = planInfo[planKey];
          const isCurrent = activePlan === planKey;
          const isPaid = planKey !== "free";

          return (
            <motion.div key={planKey} variants={itemVariants} whileHover={{ y: -5 }}>
              <Card className={`h-full flex flex-col justify-between backdrop-blur-md shadow-lg transition-all duration-300 relative overflow-hidden group ${
                isCurrent 
                  ? "bg-primary/5 border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.15)]" 
                  : "bg-card/40 border-white/10 hover:border-white/20"
              }`}>
                {/* Visual indicator for current active plan */}
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider px-3 py-1 rounded-bl-lg shadow-md uppercase">
                    Current Active
                  </div>
                )}
                {isPaid && (
                  <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-400 border-l border-b border-amber-500/30 text-[9px] font-bold tracking-wider px-3 py-1 rounded-bl-lg uppercase">
                    Upcoming
                  </div>
                )}
                
                <div>
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-400">Subscription Tier</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-extrabold text-white flex items-end">
                      {plan.price}
                      <span className="text-sm font-normal text-gray-400 ml-1 mb-1">/mo</span>
                    </div>
                    <ul className="space-y-2.5 pt-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-xs text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                          <Check className="h-3.5 w-3.5 mr-2 text-green-400 shrink-0 mt-0.5" /> 
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>

                <div className="p-6 pt-0 mt-4">
                  {isPaid ? (
                    <Button 
                      disabled
                      className="w-full text-xs font-semibold h-10 bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed"
                    >
                      Upcoming Tier
                    </Button>
                  ) : (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        onClick={() => handleUpgrade(planKey)}
                        disabled={isCurrent || actionLoading !== null}
                        variant={isCurrent ? "outline" : "default"}
                        className={`w-full text-xs font-semibold h-10 ${
                          isCurrent 
                            ? "border-primary/50 text-primary cursor-default hover:bg-transparent" 
                            : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                        }`}
                      >
                        {actionLoading === planKey ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Active Plan"
                        )}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
