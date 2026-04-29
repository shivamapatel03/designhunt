"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, CheckCircle2, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

function LoginForm() {
  const { user, loading: authLoading, login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  // Redundancy Fix
  useEffect(() => {
    if (user) {
      const target = user.role === 'SUPER_ADMIN' ? '/super-admin' 
        : user.role === 'ADMIN' ? '/admin' 
        : user.role === 'TUTOR' ? '/tutor-dashboard' 
        : '/profile';
      
      router.replace(redirectPath || target);
    }
  }, [user, router, redirectPath]);

  useEffect(() => {
    if (showOtp && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [showOtp, timeLeft]);

  const handleResend = async () => {
    if (!canResend || resendLoading) return;

    setResendLoading(true);
    setError("");
    setResendMessage("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, type: "login" }),
      });

      const data = await res.json();

      if (data.success) {
        setResendMessage("New code sent!");
        setTimeLeft(30);
        setCanResend(false);
      } else {
        setError(data.error || "Failed to resend");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showOtp ? { ...formData, otp, step: 'verify' } : { ...formData, step: 'login' }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requiresOtp) {
          setShowOtp(true);
          setMessage(data.message);
        } else {
          login(data.user);
          router.push(redirectPath || data.redirect || "/");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black selection:text-white overflow-hidden pt-8 md:pt-20">

      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-[340px] mx-auto w-full relative z-10">
        <motion.div 
            initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center mb-6"
        >
             <Link href="/" className="mb-3">
               <div className="text-2xl font-bold tracking-tighter text-black font-plus-jakarta transition-colors group-hover:text-blue-600">
                  Designhunt<span className="text-[#2B7FFF]">.</span>
               </div>
             </Link>
             <h1 className="text-xl font-black tracking-tight text-black font-plus-jakarta">
                {showOtp ? "Verification" : "Welcome Back"}
             </h1>
             {showOtp && (
                <p className="text-[10px] font-black text-gray-400 mt-1 text-center font-plus-jakarta">
                    SECURE LOGIN REQUIRED
                </p>
             )}
        </motion.div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {!showOtp ? (
            <motion.div 
                key="login-form"
                initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="w-full space-y-6"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black text-center border border-red-100 font-plus-jakarta uppercase tracking-wider">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider font-plus-jakarta" htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-black placeholder:text-gray-400 font-plus-jakarta"
                                placeholder="name@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider font-plus-jakarta" htmlFor="password">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-black placeholder:text-gray-400 pr-10 font-plus-jakarta"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end pt-1">
                                <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-black text-gray-400 hover:text-black transition-colors font-plus-jakarta">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={loading} 
                        className="w-full py-3.5 bg-black text-white font-black text-[11px] rounded-[18px] transition-all shadow-[0_4px_0_0_#222] active:shadow-none active:translate-y-[4px] flex items-center justify-center gap-2 uppercase tracking-widest font-plus-jakarta"
                    >
                        {loading ? 'Entering...' : 'Sign In'}
                    </button>
                </form>

                {/* Signup Link */}
                <div className="mt-4 text-center">
                    <p className="text-[10px] font-black text-gray-400 font-plus-jakarta">
                        New here?{' '}
                        <Link href="/signup" className="text-black hover:underline underline-offset-4 transition-all">
                           Create Account
                        </Link>
                    </p>
                </div>

                {/* Separator */}
                <div className="w-full flex items-center gap-3 my-3">
                    <div className="flex-1 h-[1px] bg-black/5"></div>
                    <span className="text-[9px] font-black text-gray-300 uppercase font-plus-jakarta">Or</span>
                    <div className="flex-1 h-[1px] bg-black/5"></div>
                </div>

                {/* Google Signup */}
                <button 
                  onClick={() => window.location.href = '/api/auth/google'}
                  className="w-full flex items-center justify-center py-2.5 bg-white border-2 border-gray-100 border-b-[3px] rounded-[16px] transition-all active:border-b-[1px] active:translate-y-[2px] hover:bg-gray-50 group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>
            </motion.div>
          ) : (
            <motion.form 
                key="otp-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onSubmit={handleSubmit}
                className="w-full space-y-6"
            >
                <div className="space-y-3">
                    <div className="bg-gray-100/50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center">
                        <label className="text-[10px] font-bold tracking-wider text-gray-400 mb-2 uppercase" htmlFor="otp">Security Code</label>
                        <input 
                            type="text" 
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            className="w-full bg-transparent text-center text-2xl font-bold tracking-[0.2em] outline-none placeholder:text-gray-200 text-black appearance-none"
                            placeholder="000000"
                            required
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold text-center border border-red-100 italic">
                            {error}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <button 
                        disabled={loading || otp.length !== 6} 
                        className="w-full py-3 bg-[#6366F1] text-white font-bold text-sm rounded-xl border-b-4 border-[#4F46E5] hover:bg-[#5558e2] active:border-b-0 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify Code'} <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        {!canResend ? (
                            <p className="text-[10px] font-bold text-gray-400">
                                Resend code in <span className="text-black">{timeLeft}s</span>
                            </p>
                        ) : (
                            <button 
                                type="button" 
                                onClick={handleResend}
                                disabled={resendLoading}
                                className="text-[10px] font-bold text-black hover:underline underline-offset-4"
                            >
                                {resendLoading ? "Requesting..." : "Resend Security Code"}
                            </button>
                        )}
                        
                        <button 
                            type="button" 
                            onClick={() => setShowOtp(false)} 
                            className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafafa]"><Loader2 className="w-6 h-6 animate-spin text-black" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
