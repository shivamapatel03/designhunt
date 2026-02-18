"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Server, 
  Activity, 
  ArrowLeft,
  ScanFace,
  KeyRound
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

type AuthPhase = 'identify' | 'verify';

export default function StaffLoginPage() {
    const { user, loading: authLoading, login: authLogin } = useAuth();
    const [phase, setPhase] = useState<AuthPhase>('identify');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            if (user.role === 'SUPER_ADMIN') router.push('/super-admin');
            else if (user.role === 'ADMIN') router.push('/admin');
            else if (user.role === 'TUTOR') router.push('/tutor-dashboard');
        }
    }, [user, authLoading, router]);

    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // First step: Verify credentials and trigger OTP
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, step: 'login' }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.requiresOtp) {
                    setPhase('verify');
                    toast.success("Credentials Verified. Sending Secure Key...");
                } else {
                    // Regular user erroneously trying to login here?
                    // Or maybe a staff role that doesn't strictly need OTP (though we enforce it)
                    toast.error("Unauthorized Access Protocol.");
                }
            } else {
                toast.error(data.error || "Authentication Failed");
            }
        } catch (err) {
            toast.error("System Connection Error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, step: 'verify' }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.user) authLogin(data.user);
                toast.success("Secure Session Established");
                
                // Smart Redirect
                const role = data.user.role;
                if (role === 'SUPER_ADMIN') router.push('/super-admin');
                else if (role === 'ADMIN') router.push('/admin');
                else if (role === 'TUTOR') router.push('/tutor-dashboard');
                else router.push('/profile');
            } else {
                toast.error(data.error || "Invalid Security Key");
            }
        } catch (err) {
            toast.error("Verification Failed");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#222_0%,_#000_100%)]" />
            <div className="fixed inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mb-4 backdrop-blur-sm">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Staff Portal</h1>
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        SYSTEM OPERATIONAL
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <AnimatePresence mode="wait">
                        {phase === 'identify' ? (
                            <motion.form 
                                key="identify"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleIdentify}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Staff ID (Email)</label>
                                        <div className="relative">
                                            <ScanFace className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                            <input 
                                                type="email" 
                                                required
                                                autoFocus
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-white/30 focus:bg-black/60 transition-all font-medium"
                                                placeholder="user@designhunt.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                                            <input 
                                                type="password" 
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-white/30 focus:bg-black/60 transition-all font-medium"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    disabled={loading}
                                    className="w-full py-4 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Activity className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Authenticate <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form 
                                key="verify"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleVerify}
                                className="space-y-6"
                            >
                                <button 
                                    onClick={() => setPhase('identify')}
                                    type="button"
                                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors mb-4 uppercase tracking-widest"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Back to Identification
                                </button>

                                <div className="text-center mb-6">
                                    <h3 className="text-white font-bold mb-1">Enter Verification Code</h3>
                                    <p className="text-xs text-gray-500">A one-time secure key has been sent to {email}</p>
                                </div>

                                <div className="relative">
                                    <Server className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input 
                                        type="text" 
                                        required
                                        autoFocus
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-accent-blue/50 focus:bg-black/60 transition-all"
                                        placeholder="000000"
                                    />
                                </div>

                                <button 
                                    disabled={loading}
                                    className="w-full py-4 bg-accent-blue text-white font-black uppercase tracking-wider rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-[0px_0px_20px_rgba(37,99,235,0.3)] hover:shadow-[0px_0px_30px_rgba(37,99,235,0.5)] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Activity className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" /> Verify & Access
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="text-center mt-8">
                    <p className="text-[10px] text-gray-600 font-mono uppercase">
                        Restricted Area • Authorized Personnel Only
                        <br />
                        IP LOGGED • SECURE CONNECTION
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
