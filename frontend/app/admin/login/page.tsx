"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2, Lock, Mail, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function AdminLoginPage() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth(); 

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const res = await fetch("/api/auth/admin-login-step1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        
        if (res.ok) {
            setStep("otp");
        } else {
            setError(data.message || "Invalid credentials");
        }
    } catch (err) {
        setError("Connection failed");
    } finally {
        setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const res = await fetch("/api/auth/admin-login-step2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        
        if (res.ok) {
            login(data.user);
            window.location.href = "/admin";
        } else {
            setError(data.message || "Invalid OTP");
        }
    } catch (err) {
        setError("Connection failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0px_0px_50px_rgba(255,255,255,0.2)]"
            >
                <ShieldCheck className="w-10 h-10 text-black" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">Admin Access</h1>
            <p className="text-gray-500 font-mono text-xs tracking-[0.2em] uppercase">Team Portal</p>
        </div>

        <motion.div 
            layout
            className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-2 overflow-hidden"
        >
            <AnimatePresence mode="wait">
                {step === "credentials" ? (
                    <motion.form 
                        key="credentials"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleCredentialsSubmit} 
                        className="space-y-2 p-2"
                    >
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-white/30 transition-colors"
                                placeholder="ADMIN EMAIL"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-white/30 transition-colors"
                                placeholder="PASSWORD"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-white text-black rounded-xl font-black uppercase text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </motion.form>
                ) : (
                    <motion.form 
                        key="otp"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleOtpSubmit} 
                        className="relative"
                    >
                        <div className="relative flex items-center">
                            <div className="absolute left-6 text-gray-500">
                                <Key className="w-5 h-5" />
                            </div>
                            <input 
                                type="text" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full pl-16 pr-32 py-6 bg-transparent text-white font-mono text-xl tracking-[0.5em] focus:outline-none placeholder:text-gray-800 placeholder:tracking-normal placeholder:font-sans"
                                placeholder="ENTER OTP"
                                maxLength={6}
                                autoFocus
                            />
                            <button 
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black rounded-[1.5rem] font-black uppercase text-sm hover:scale-95 active:scale-90 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>

        {error && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
            >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/20">
                    <ShieldCheck className="w-3 h-3" /> {error}
                </span>
            </motion.div>
        )}
      </div>
    </div>
  );
}
