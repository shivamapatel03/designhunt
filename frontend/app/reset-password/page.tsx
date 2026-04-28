"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Key, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    token: searchParams.get("token") || "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          token: formData.token,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset successful!");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Reset failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!message ? (
          <motion.div 
            key="reset-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
               <h1 className="text-xl font-bold tracking-tight text-black">
                  New Password
               </h1>
               <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                  Secure access recovery
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                  <div className="p-2 bg-red-50 text-red-500 rounded-xl text-[9px] font-bold text-center border border-red-100 italic">
                      {error}
                  </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700 uppercase tracking-widest" htmlFor="email">
                    Email <Lock className="w-3 h-3 text-gray-400" />
                  </label>
                  <input 
                    type="email" 
                    readOnly
                    value={formData.email}
                    className="w-full px-4 py-2.5 bg-[#E0F2FE] border-none rounded-xl font-bold text-xs focus:outline-none transition-all text-black cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest" htmlFor="token">Code</label>
                  <input 
                    type="text" 
                    required
                    value={formData.token}
                    onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-black text-center tracking-[0.2em]"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest" htmlFor="password">New Password</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-black"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest" htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-black"
                  placeholder="••••••••"
                />
              </div>

              <button disabled={loading} className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set New Password'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
                   <ArrowLeft className="w-3 h-3" /> Back to Login
                </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success-message"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[32px] border-2 border-black flex flex-col items-center text-center space-y-4 shadow-[4px_4px_0_0_#000]"
          >
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div className="space-y-2">
                <h2 className="text-lg font-bold text-black">Reset Successful</h2>
                <p className="text-xs text-gray-500 font-medium">Your password has been updated. You'll be redirected to login shortly.</p>
            </div>
            <Link href="/login" className="w-full py-3 bg-black text-white font-bold text-xs rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center shadow-[4px_4px_0_0_#333]">
                Go to Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence } from "framer-motion";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black selection:text-white overflow-hidden">


      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-[400px] mx-auto w-full relative z-10">
        <Suspense fallback={<div className="text-[10px] font-bold text-gray-400 animate-pulse uppercase tracking-widest">Waking Up Session...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
