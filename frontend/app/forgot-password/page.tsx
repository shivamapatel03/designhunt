"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

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
        setMessage(data.message || "Reset link sent to your email.");
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
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black selection:text-white overflow-hidden pt-20">
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-[340px] mx-auto w-full relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-6 text-center"
        >
             <h1 className="text-xl font-bold tracking-tight text-black">
                Reset Password
             </h1>
             <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                Identifier Recovery
             </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!message ? (
            <motion.div 
                key="forgot-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full space-y-6"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-2 bg-red-50 text-red-500 rounded-xl text-[9px] font-bold text-center border border-red-100 italic">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest" htmlFor="email">Your email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-black placeholder:text-gray-400"
                            placeholder="name@email.com"
                            required
                        />
                    </div>

                    <button 
                        disabled={loading} 
                        className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Reset Link'}
                    </button>
                </form>

                <div className="mt-2 text-center">
                    <Link href="/login" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-black transition-colors">
                       <ArrowLeft className="w-3 h-3" /> Back to login
                    </Link>
                </div>
            </motion.div>
          ) : (
            <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-white p-8 rounded-[32px] border-2 border-black flex flex-col items-center text-center space-y-4"
            >
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-black">Check your email</h2>
                    <p className="text-xs text-gray-500 font-medium">
                        If an account exists for {email}, you will receive a reset link shortly.
                    </p>
                </div>
                <div className="pt-4 flex flex-col gap-3 w-full">
                    <Link href={`/reset-password?email=${encodeURIComponent(email)}`} title="Go to Reset Password" className="w-full py-3 bg-black text-white font-bold text-xs rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#333]">
                        Enter Reset Code <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setMessage("")} className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
                        Try another email
                    </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
