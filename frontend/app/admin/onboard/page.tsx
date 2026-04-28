"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2, Lock, Mail, Key, UserCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminOnboardPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const res = await fetch("/api/auth/onboard-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, password }),
        });
        const data = await res.json();
        
        if (res.ok) {
            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/login");
            }, 2000);
        } else {
            setError(data.error || "Failed to activate account");
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
                <UserCheck className="w-10 h-10 text-black" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">Account Activation</h1>
            <p className="text-gray-500 font-mono text-xs tracking-[0.2em] uppercase">Set your admin credentials</p>
        </div>

        <motion.div 
            className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6"
        >
            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-white font-bold text-xl mb-2">Success!</h2>
                        <p className="text-gray-500 text-sm">Your account is now active. Redirecting to login...</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                <input 
                                    type="email" 
                                    value={email}
                                    readOnly
                                    className="w-full pl-12 pr-4 py-4 bg-black/30 border border-white/5 rounded-xl text-gray-500 font-bold focus:outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Verification Code</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    placeholder="6-DIGIT OTP"
                                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-white/30 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Set Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="MIN 8 CHARACTERS"
                                    minLength={8}
                                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-white/30 transition-colors"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-white text-black rounded-xl font-black uppercase text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Activate Account <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
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
