"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function AdminLoginPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user) login(data.user);
        // Force full reload to ensure cookie is picked up by middleware/server
        window.location.href = "/admin"; 
      } else {
        setError(data.message || "Access Denied");
      }
    } catch (err) {
      setError("Secure Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0px_0px_50px_rgba(255,255,255,0.2)]"
            >
                <ShieldCheck className="w-10 h-10 text-black" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">Admin Access</h1>
            <p className="text-gray-500 font-mono text-xs tracking-[0.2em] uppercase">Team Portal</p>
        </div>

        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-2"
        >
            <form onSubmit={handleLogin} className="relative">
                <div className="relative flex items-center">
                    <div className="absolute left-6 text-gray-500">
                        <Lock className="w-5 h-5" />
                    </div>
                    <input 
                        type="password" 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="w-full pl-16 pr-32 py-6 bg-transparent text-white font-mono text-xl tracking-[0.5em] focus:outline-none placeholder:text-gray-800 placeholder:tracking-normal placeholder:font-sans"
                        placeholder="ENTER ACCESS CODE"
                        maxLength={20}
                    />
                    <button 
                        type="submit"
                        disabled={loading || code.length < 3}
                        className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black rounded-[1.5rem] font-black uppercase text-sm hover:scale-95 active:scale-90 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </form>
        </motion.div>

        {error && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
            >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/20">
                    <ShieldCheck className="w-3 h-3" /> {error}
                </span>
            </motion.div>
        )}
      </div>
    </div>
  );
}
