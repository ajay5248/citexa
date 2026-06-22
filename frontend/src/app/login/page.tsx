"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await fetch(`${apiUrl}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Invalid email or password");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiUrl}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        if (!res.ok) {
          throw new Error("Failed to authenticate with Google");
        }

        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        router.push("/dashboard");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Google Login Failed");
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground relative overflow-hidden">
      {/* Background Glows */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" 
      />
      
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          {/* Intense hover glow behind the card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25" />
          
          <div className="relative w-full px-8 py-10 bg-card/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-400"
              >
                Log in to your Citexa dashboard
              </motion.p>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-red-500 mb-4 text-center text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20"
              >
                {error}
              </motion.div>
            )}
            
            <motion.form 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6" 
              onSubmit={handleStandardLogin}
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@company.com" 
                  required 
                  className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors placeholder:text-gray-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 hover:underline transition-all">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full h-11 text-base shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card/50 px-2 text-gray-500 backdrop-blur-sm">Or continue with</span>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  variant="outline" 
                  className="w-full h-11 border-white/10 bg-background/50 hover:bg-white/5 transition-colors"
                  onClick={() => googleLogin()}
                  disabled={isLoading}
                  type="button"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  {isLoading ? "Signing in..." : "Google"}
                </Button>
              </motion.div>
            </motion.form>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center text-sm text-gray-400"
            >
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
                Sign up
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

