"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Key } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white border-[3px] border-black rounded-[32px] shadow-[8px_8px_0px_0px_#000] p-6 md:p-10 relative overflow-hidden"
    >
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-blue border-2 border-black rounded-xl mb-4 shadow-[4px_4px_0px_0px_#000]">
          <Key className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-1">
          Set New <span className="text-accent-yellow text-shadow-black">Passkey</span>
        </h1>
        <p className="text-sm font-bold text-gray-400 italic">Inject a new security layer into your account.</p>
      </div>

      {message ? (
        <div className="space-y-6 text-center">
          <div className="p-8 bg-green-50 border-[3px] border-black rounded-[32px] border-dashed">
            <ShieldCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-black uppercase italic mb-2">Access Restored</h3>
            <p className="text-sm font-bold text-gray-500">{message}</p>
          </div>
          <p className="text-xs font-black uppercase italic text-gray-400 animate-pulse">Redirecting to login terminal...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm" htmlFor="email">Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-2xl font-black text-xs outline-none focus:bg-accent-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-1 focus:translate-y-1 transition-all"
                placeholder="NAME@URL.COM"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm" htmlFor="token">Recovery Hash</label>
              <input 
                type="text" 
                required
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-2xl font-black text-xs outline-none focus:bg-accent-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-1 focus:translate-y-1 transition-all"
                placeholder="000000"
                maxLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm" htmlFor="password">New Passkey</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-2xl font-black text-base outline-none focus:bg-accent-blue focus:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-1 focus:translate-y-1 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm" htmlFor="confirmPassword">Confirm Passkey</label>
            <input 
              type="password" 
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-2xl font-black text-base outline-none focus:bg-accent-blue focus:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-1 focus:translate-y-1 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="p-3 bg-red-50 border-2 border-black rounded-xl font-black text-xs text-center italic">{error}</p>}

          <button disabled={loading} className="w-full py-4 bg-black text-white font-black text-xl rounded-[24px] shadow-[6px_6px_0px_0px_#ffd700] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 italic uppercase">
            {loading ? 'REWRITING...' : 'Update Passkey'} <ArrowRight className="w-6 h-6" />
          </button>
        </form>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-accent-yellow selection:text-black">
      {/* Brutalist Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[length:40px_40px]" />
      </div>

      <div className="p-4 md:p-8 relative z-10">
        <Link href="/login" className="inline-flex items-center text-xs font-black uppercase tracking-widest hover:translate-x-[-2px] transition-transform">
          <ArrowLeft className="w-4 h-4 mr-2" /> Abort Mission
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-lg">
          <Suspense fallback={<div className="text-center font-black animate-pulse uppercase tracking-widest">Loading Recovery Interface...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
