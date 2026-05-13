"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Loader2, Mail, Lock, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, masterKey }),
      });
      const data = await res.json();

      if (res.ok) {
        login(data.user);
        router.push("/super-admin");
      } else {
        setAttempts((a) => a + 1);
        setError(data.message || "Invalid credentials");
        // Clear master key on failure for security
        setMasterKey("");
      }
    } catch (err) {
      setError("Connection failed. Check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0px_0px_50px_rgba(255,255,255,0.2)]"
          >
            <Shield className="w-10 h-10 text-black" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">
            Restricted Access
          </h1>
          <p className="text-gray-500 font-mono text-xs tracking-[0.2em] uppercase">
            Super Admin Portal
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 space-y-3"
        >
          {/* Email */}
          <div className="relative flex items-center bg-white/5 rounded-2xl px-5 py-4">
            <Mail className="w-5 h-5 text-gray-500 mr-4 shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-transparent text-white font-mono text-sm focus:outline-none placeholder:text-gray-700"
              placeholder="SUPER ADMIN EMAIL"
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center bg-white/5 rounded-2xl px-5 py-4">
            <Lock className="w-5 h-5 text-gray-500 mr-4 shrink-0" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-transparent text-white font-mono text-sm focus:outline-none placeholder:text-gray-700"
              placeholder="PASSWORD"
            />
          </div>

          {/* Master Key */}
          <div className="relative flex items-center bg-white/5 rounded-2xl px-5 py-4">
            <Key className="w-5 h-5 text-gray-500 mr-4 shrink-0" />
            <input
              type="password"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              required
              autoComplete="off"
              className="w-full bg-transparent text-white font-mono text-sm focus:outline-none placeholder:text-gray-700"
              placeholder="MASTER KEY"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password || !masterKey}
            className="w-full mt-2 py-4 bg-white text-black rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Authenticate
              </>
            )}
          </button>

          {/* Attempts indicator */}
          {attempts > 0 && attempts < 5 && (
            <p className="text-center text-yellow-500/70 text-xs font-mono">
              {5 - attempts} attempt{5 - attempts !== 1 ? "s" : ""} remaining before lockout
            </p>
          )}
        </motion.form>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/20">
              <Shield className="w-3 h-3" /> {error}
            </span>
          </motion.div>
        )}

        {/* Security note */}
        <p className="text-center text-gray-700 text-xs mt-6 font-mono">
          All access attempts are logged
        </p>
      </div>
    </div>
  );
}
