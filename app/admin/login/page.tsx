"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowRight, Shield, ShieldCheck, ArrowLeft, Lock, Terminal, Radio } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";

type AuthPhase = 'identification' | 'authentication' | 'verification';

export default function AdminLoginPage() {
    const { user, loading: authLoading, login: authLogin } = useAuth();
    const [phase, setPhase] = useState<AuthPhase>('identification');
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Redundancy Fix
    useEffect(() => {
        if (!authLoading && user) {
            if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
                router.push('/super-admin');
            }
        }
    }, [user, authLoading, router]);

    const handleNextPhase = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.email) setPhase('authentication');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, step: 'login' }),
            });

            const data = await res.json();
            if (res.ok) {
                if (data.requiresOtp) {
                    setPhase('verification');
                } else {
                    if (data.user) authLogin(data.user);
                    router.push(data.redirect || "/super-admin");
                    router.refresh();
                }
            } else {
                setError(data.error || "Login unauthorized.");
            }
        } catch (err) {
            setError("Sync failure. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp, step: 'verify' }),
            });

            const data = await res.json();
            if (res.ok) {
                if (data.user) authLogin(data.user);
                router.push(data.redirect || "/super-admin");
                router.refresh();
            } else {
                setError(data.error || "Invalid Access Key.");
            }
        } catch (err) {
            setError("Connection failure.");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-black selection:text-white font-sans">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
                <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[length:24px_24px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-6 flex justify-start">
                    <button 
                         onClick={() => {
                            if (phase === 'authentication') setPhase('identification');
                            else if (phase === 'verification') setPhase('authentication');
                            else router.push('/');
                        }}
                        className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] italic hover:translate-x-[-2px] transition-transform"
                    >
                        <ArrowLeft className="w-3 h-3 mr-2" /> {phase === 'identification' ? 'Mainframe' : 'Back'}
                    </button>
                </div>

                <div className="bg-white border-[3px] border-black rounded-[32px] shadow-[8px_8px_0px_0px_#000] p-6 md:p-10 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-black px-3 py-1 rounded-full text-white font-black text-[10px] uppercase italic rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
                        Controller
                    </div>
                    
                    <div className="mb-8 text-center sm:text-left">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-black border-2 border-black rounded-xl mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-1 text-black">
                            The <span className="text-accent-blue underline decoration-black decoration-4 underline-offset-2">Controller</span>
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 italic uppercase tracking-widest leading-tight">
                            Oversee site operations and portal security.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {phase === 'identification' ? (
                            <motion.form 
                                key="admin-id"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onSubmit={handleNextPhase}
                                className="space-y-6"
                            >
                                <div className="group">
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1 ml-1 text-gray-400 group-focus-within:text-black transition-colors italic">Controller ID</label>
                                    <input 
                                        type="email" 
                                        required
                                        autoFocus
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border-[3px] border-black rounded-2xl outline-none focus:bg-white focus:translate-x-1 focus:translate-y-1 transition-all font-black text-lg shadow-[4px_4px_0px_0px_#000]"
                                        placeholder="ADMIN@DESIGNHUNT.COM"
                                    />
                                </div>
                                <button className="w-full py-4 bg-black text-white font-black rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-xl uppercase italic tracking-tighter flex items-center justify-center gap-3">
                                    Next Phase <ArrowRight className="w-6 h-6" />
                                </button>
                                <div className="text-center">
                                    <span className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-300">Auth Protocol 1.0.2</span>
                                </div>
                            </motion.form>
                        ) : phase === 'authentication' ? (
                             <motion.form 
                                key="admin-auth"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onSubmit={handleLogin}
                                className="space-y-6"
                            >
                                <div className="group">
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1 ml-1 text-gray-400 group-focus-within:text-black transition-colors italic">Access Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        autoFocus
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border-[3px] border-black rounded-2xl outline-none focus:bg-white focus:translate-x-1 focus:translate-y-1 transition-all font-black text-lg shadow-[4px_4px_0px_0px_#000]"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {error && <p className="p-3 bg-red-50 border-2 border-black rounded-xl font-black text-xs text-center italic uppercase">{error}</p>}
                                <button 
                                    disabled={loading}
                                    className="w-full py-4 bg-accent-blue text-white font-black rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-xl uppercase italic tracking-tighter flex items-center justify-center gap-3"
                                >
                                    {loading ? 'AUTHENTICATING...' : 'Authorize'} <ArrowRight className="w-6 h-6" />
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form 
                                key="admin-ver"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleVerify}
                                className="space-y-6 text-center"
                            >
                                <div className="p-6 bg-black/[0.02] border-2 border-black border-dashed rounded-2xl relative">
                                    <Radio className="absolute top-0 right-4 -translate-y-1/2 w-8 h-8 text-black opacity-10" />
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-6 italic">Enter Secure Access Key</label>
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        placeholder="000000"
                                        required
                                        autoFocus
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full bg-transparent text-center text-5xl font-black outline-none tracking-[0.2em] placeholder:text-gray-100" 
                                    />
                                </div>
                                {error && <p className="p-3 bg-red-50 border-2 border-black rounded-xl font-black text-xs italic uppercase">{error}</p>}
                                <button 
                                    disabled={loading}
                                    className="w-full py-4 bg-black text-white font-black rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_#3b82f6] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-xl uppercase italic"
                                >
                                    {loading ? 'FINALIZING...' : 'Establish Session'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
