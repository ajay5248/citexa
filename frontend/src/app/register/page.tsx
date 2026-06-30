"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const planParam = new URLSearchParams(window.location.search).get("plan");
      if (planParam) {
        setSelectedPlan(planParam);
        localStorage.setItem("selected_plan", planParam);
      }
    }
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

  const handleStandardRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, full_name: name, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Registration failed");
      }

      // After registering, log them in to get the token
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const loginRes = await fetch(`${apiUrl}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (loginRes.ok) {
        const data = await loginRes.json();
        localStorage.setItem("token", data.access_token);
        router.push("/dashboard");
      } else {
        router.push("/login"); // fallback to login page
      }
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
      setError("Google Signup Failed");
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-8 py-10 bg-card/50 backdrop-blur border border-border/50 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
            {selectedPlan ? (
              <div className="mt-2">
                <span className="text-primary font-bold text-xs bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                  Selected Plan: {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                </span>
              </div>
            ) : (
              <p className="text-gray-400">Start optimizing for AI search today</p>
            )}
          </div>
          {error && <div className="text-red-500 mb-4 text-center text-sm">{error}</div>}
          <form className="space-y-6" onSubmit={handleStandardRegister}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                required 
                className="bg-background/50 border-border/50"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@company.com" 
                required 
                className="bg-background/50 border-border/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-background/50 border-border/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-gray-400">Or continue with</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full h-11 border-border/50 bg-background/50"
              onClick={() => googleLogin()}
              disabled={isLoading}
              type="button"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              {isLoading ? "Signing in..." : "Google"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
