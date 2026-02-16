"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
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
          <div className="text-center">
              <h1 className="text-2xl font-black">Invalid Request</h1>
              <p className="text-gray-500">No email address provided.</p>
          </div>
      )
  }

  return (
    <div className="max-w-md w-full bg-white border-4 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_#000]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-accent-yellow border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_black]">
          <Mail className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-3xl font-black mb-2">Check your inbox</h1>
        <p className="text-gray-500 font-medium">
          We sent a verification code to <br />
          <span className="font-bold text-black">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Verification Code</label>
            <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full text-center text-3xl tracking-[1rem] font-black p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none placeholder:text-gray-200"
            required
            pattern="[0-9]{6}"
            />
        </div>

        {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 font-bold text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
            </div>
        )}

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full py-4 bg-black text-white font-black text-lg rounded-xl shadow-[4px_4px_0px_0px_#3b82f6] hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Verifying..." : "Verify Email"} <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4">
             <Suspense fallback={<div>Loading...</div>}>
                <VerifyEmailContent />
             </Suspense>
        </div>
    )
}
