"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldAlert, Cpu, Network, ArrowLeft, Zap, Orbit } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";

type AuthPhase = 'identification' | 'authentication' | 'verification';

export default function SuperAdminLoginPage() {
    const { user, loading: authLoading, login: authLogin } = useAuth();
    const [phase, setPhase] = useState<AuthPhase>('identification');
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [bootLog, setBootLog] = useState<string[]>([]);
    const router = useRouter();

    // Redundancy Fix
    useEffect(() => {
        if (!authLoading && user) {
            if (user.role === 'SUPER_ADMIN') {
                router.push('/super-admin');
            }
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const logs = [
            "Initializing secure uplink...",
            "Loading root protocols...",
            "Ready for Architect login sequence."
        ];
        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                setBootLog(prev => [...prev, logs[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 150);
        return () => clearInterval(interval);
    }, []);

    const addLog = (msg: string) => setBootLog(prev => [...prev.slice(-3), msg]);

    const handleNextPhase = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.email) {
            addLog(`Identity recognized: ${formData.email}`);
            setPhase('authentication');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        addLog("Verifying master password...");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, step: 'login' }),
            });

            const data = await res.json();
            if (res.ok) {
                if (data.requiresOtp) {
                    addLog("Primary auth OK. Verification required.");
                    setPhase('verification');
                } else {
                    addLog("Override detected. Accessing root...");
                    if (data.user) authLogin(data.user);
                    router.push(data.redirect || "/super-admin");
                    router.refresh();
                }
            } else {
                setError(data.error || "Access Denied.");
                addLog("Security Breach: Invalid Credentials");
            }
        } catch (err) {
            setError("Neural link failure.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        addLog("Analyzing verification key...");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp, step: 'verify' }),
            });

            const data = await res.json();
            if (res.ok) {
                addLog("Root access granted. Welcome, Architect.");
                if (data.user) authLogin(data.user);
                router.push(data.redirect || "/super-admin");
                router.refresh();
            } else {
                setError(data.error || "Invalid Protocol.");
                addLog("Verification Failed: Code Rejected");
            }
        } catch (err) {
            setError("Core Sync Failure");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono selection:bg-red-600 selection:text-white">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.05)_0%,transparent_70%)]" />
                <div className="h-full w-full bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[length:32px_32px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-6 flex justify-between items-center bg-black/40 backdrop-blur-md p-3 border border-red-900/30 rounded-xl">
                    <button 
                         onClick={() => {
                            if (phase === 'authentication') setPhase('identification');
                            else if (phase === 'verification') setPhase('authentication');
                            else router.push('/');
                        }}
                        className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-3 h-3" /> System Root
                    </button>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-900 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-red-700 animate-pulse delay-75" />
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse delay-150" />
                    </div>
                </div>

                <div className="bg-black border-[3px] border-red-600 rounded-[32px] shadow-[0px_0px_40px_rgba(220,38,38,0.2)] p-6 md:p-10 relative overflow-hidden group">
                    <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full text-black font-black text-[10px] uppercase italic -rotate-12">
                        ARCHITECT
                    </div>
                    
                    <div className="mb-8 border-b border-red-900/30 pb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-600 border-2 border-red-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                                <Terminal className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tighter text-white leading-none mb-1">
                                    THE <span className="text-red-600 underline decoration-white/20 underline-offset-4">ARCHITECT</span>
                                </h1>
                                <p className="text-[9px] text-red-900 font-bold uppercase tracking-[0.2em] leading-tight">Full systems access and root configuration.</p>
                            </div>
                        </div>
                        
                        <div className="bg-red-950/20 rounded-lg p-3 border border-red-900/20">
                            {bootLog.map((log, i) => (
                                <p key={i} className="text-[9px] text-red-500/60 leading-tight">
                                    {`> ${log}`}
                                </p>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {phase === 'identification' ? (
                            <motion.form 
                                key="sa-id"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onSubmit={handleNextPhase}
                                className="space-y-6"
                            >
                                <div className="group">
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-red-900 group-focus-within:text-red-500 transition-colors">Neural Signature</label>
                                    <input 
                                        type="email" 
                                        required
                                        autoFocus
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-4 bg-black border-2 border-red-900 rounded-2xl outline-none focus:border-red-500 transition-all font-bold text-white shadow-[0_0_20px_rgba(255,0,0,0.02)]"
                                        placeholder="ARCHITECT@DESIGNHUNT.COM"
                                    />
                                </div>
                                <button className="w-full py-4 bg-red-600 text-black font-black rounded-2xl border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all text-xl uppercase italic tracking-tighter flex items-center justify-center gap-3">
                                    Next Phase <Zap className="w-6 h-6" />
                                </button>
                                <div className="text-center opacity-20 hover:opacity-100 transition-opacity">
                                    <span className="text-[7px] text-red-500 uppercase tracking-widest">Biological Override Protocol Active</span>
                                </div>
                            </motion.form>
                        ) : phase === 'authentication' ? (
                            <motion.form 
                                key="sa-auth"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onSubmit={handleLogin}
                                className="space-y-6"
                            >
                                <div className="group">
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-red-900 group-focus-within:text-red-500 transition-colors">Root Credentials</label>
                                    <input 
                                        type="password" 
                                        required
                                        autoFocus
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full p-4 bg-black border-2 border-red-900 rounded-2xl outline-none focus:border-red-500 transition-all font-bold text-white shadow-[0_0_20px_rgba(255,0,0,0.02)]"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {error && <p className="p-3 bg-red-900/10 border border-red-600 rounded-xl font-black text-xs text-center text-red-600 uppercase italic">{error}</p>}
                                <button 
                                    disabled={loading}
                                    className="w-full py-4 bg-red-950 text-red-500 font-black rounded-2xl border-2 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:bg-red-600 hover:text-black transition-all text-xl uppercase italic tracking-tighter flex items-center justify-center gap-3"
                                >
                                    {loading ? 'ANALYZING...' : 'Verify Root'} <Cpu className="w-6 h-6" />
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form 
                                key="sa-ver"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleVerify}
                                className="space-y-6 text-center"
                            >
                                <div className="p-8 bg-black border-2 border-red-600 border-dashed rounded-3xl relative">
                                    <Orbit className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-red-600 bg-black p-1" />
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-6 text-red-900">Enter Encryption Key</label>
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        placeholder="000000"
                                        required
                                        autoFocus
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full bg-transparent text-center text-5xl font-black outline-none tracking-[0.2em] text-white placeholder:text-red-900/20" 
                                    />
                                </div>
                                {error && <p className="p-3 bg-red-900/10 border border-red-600 rounded-xl font-black text-xs text-center text-red-600 uppercase italic">{error}</p>}
                                <button 
                                    disabled={loading}
                                    className="w-full py-4 bg-white text-black font-black rounded-2xl border-2 border-red-600 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all text-xl uppercase italic flex items-center justify-center gap-3"
                                >
                                    {loading ? 'DECRYPTING...' : 'Authorize Full Access'} <Network className="w-6 h-6" />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 text-center opacity-30">
                    <p className="text-[8px] font-black uppercase text-red-900 tracking-[0.4em]">
                        Systems Online // Root Protocol 4.0 // ARCHITECT V1
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
