"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ChevronDown, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

function VerifyEmailContent() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    if (!canResend || resendLoading) return;

    setResendLoading(true);
    setError("");
    setResendMessage("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "signup" }),
      });

      const data = await res.json();

      if (data.success) {
        setResendMessage("Verification code resent!");
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

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        login(data.user);
        router.push(data.redirect || "/onboarding");
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
      return (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <AlertCircle className="w-8 h-8 text-red-500" />
               </div>
               <h1 className="text-2xl font-bold tracking-tight">Invalid Request</h1>
               <p className="text-sm text-gray-500 font-medium">No email address provided for verification.</p>
               <Link href="/signup" className="text-xs font-black uppercase tracking-widest text-black hover:underline underline-offset-4 decoration-2">
                    Return to Signup
               </Link>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black selection:text-white overflow-hidden">
      {/* Header - Top Icons */}
      <div className="w-full p-8 md:p-12 flex justify-start items-center absolute top-0 left-0 z-20">
        <Link href="/" className="transition-all hover:scale-105 active:scale-95">
           <Image src="/logo/gloom.png" alt="logo" width={40} height={40} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-[340px] mx-auto w-full relative z-10">
        {/* Main Branding */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center mb-4"
        >
             <h1 className="text-2xl font-bold tracking-tight text-center">Check your inbox</h1>
             <p className="text-[10px] font-bold text-gray-400 mt-1 text-center">
                Sent to <span className="text-black">{email}</span>
             </p>
        </motion.div>

        {/* OTP Form */}
        <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="w-full space-y-4"
        >
            <div className="space-y-2">
                <div className="bg-gray-100/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100">
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
                    <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold text-center border border-red-100 italic transition-all animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}
            </div>

            <button 
                disabled={loading || otp.length !== 6} 
                type="submit"
                className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl shadow-sm hover:bg-gray-900 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
                {loading ? 'Verifying...' : 'Verify Email'} <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center gap-2 mt-2">
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
                
                <Link 
                    href="/signup" 
                    className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors"
                >
                    Sign up with another email
                </Link>
            </div>
        </motion.form>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
             <Suspense fallback={<div className="flex items-center justify-center min-h-screen font-black uppercase tracking-widest text-gray-300">Syncing...</div>}>
                <VerifyEmailContent />
             </Suspense>
        </div>
    )
}
