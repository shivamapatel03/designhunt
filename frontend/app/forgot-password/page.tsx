"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Zap, Mail } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Reset code sent to your email.");
      } else {
        setError(data.error || "Request failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-accent-yellow selection:text-black">
      {/* Brutalist Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[length:40px_40px]" />
      </div>

      <div className="p-4 md:p-8 relative z-10">
        <Link href="/login" className="inline-flex items-center text-xs font-black uppercase tracking-widest hover:translate-x-[-2px] transition-transform">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-[3px] border-black rounded-[32px] shadow-[8px_8px_0px_0px_#000] p-6 md:p-10 relative overflow-hidden"
          >
            <div className="mb-8 text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-yellow border-2 border-black rounded-xl mb-4 shadow-[4px_4px_0px_0px_#000]">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-1">
                Forgot <span className="text-accent-blue">Passkey?</span>
              </h1>
              <p className="text-sm font-bold text-gray-400 italic">Enter your identifier to receive a restoration hash.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm" htmlFor="email">Recovery Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-2xl font-black text-base outline-none focus:bg-accent-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-1 focus:translate-y-1 transition-all"
                  placeholder="NAME@URL.COM"
                />
              </div>

              {error && <p className="p-3 bg-red-50 border-2 border-black rounded-xl font-black text-xs text-center italic">{error}</p>}
              {message && (
                <div className="p-4 bg-green-50 border-2 border-black rounded-2xl text-center">
                  <p className="font-black text-xs uppercase mb-4 text-green-700">{message}</p>
                  <Link href="/reset-password" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl font-black text-[10px] uppercase italic hover:bg-gray-800 transition-all">
                    Enter Code <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {!message && (
                <button disabled={loading} className="w-full py-4 bg-black text-white font-black text-xl rounded-[24px] shadow-[6px_6px_0px_0px_#ffd700] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 italic uppercase">
                  {loading ? 'SENDING...' : 'Request Hash'} <ArrowRight className="w-6 h-6" />
                </button>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-base font-black text-gray-300">
                Remembered?{' '}
                <Link href="/login" className="text-black hover:underline underline-offset-4 decoration-accent-blue decoration-2">
                  Back to Login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
