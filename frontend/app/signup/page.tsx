"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, UserPlus, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        router.push(data.redirect || "/");
      } else {
        const data = await res.json();
        setError(data.error || "Signup failed");
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
        <Link href="/" className="inline-flex items-center text-xs font-black uppercase tracking-widest hover:translate-x-[-2px] transition-transform">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-[3px] border-black rounded-[32px] shadow-[8px_8px_0px_0px_#000] p-6 md:p-10 relative overflow-hidden"
          >
            {/* Header Sticker */}
            <div className="absolute top-4 right-4 bg-accent-pink border-2 border-black px-3 py-1 rounded-full text-white font-black text-[10px] uppercase italic rotate-12 shadow-[3px_3px_0px_0px_#000]">
              Join
            </div>

            <div className="mb-6 text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-yellow border-2 border-black rounded-xl mb-4 shadow-[4px_4px_0px_0px_#000]">
                <UserPlus className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-1">New Recruit</h1>
              <p className="text-sm font-bold text-gray-400">Join the community of creators.</p>
            </div>

            {/* Google Signup Button */}
            <button 
              onClick={() => window.location.href = '/api/auth/google'}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-[3px] border-black rounded-2xl font-black text-base shadow-[4px_4px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group mb-6">
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Join with Google
            </button>

            <div className="relative py-2 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-[3px] border-black"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest italic">
                <span className="px-3 bg-white border-2 border-black rounded-full">Or Register</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="p-3 bg-red-50 border-2 border-black rounded-xl font-black text-xs text-center italic">{error}</p>}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm" htmlFor="name">Identification</label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-2xl font-black text-base outline-none focus:bg-accent-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-1 focus:translate-y-1 transition-all"
                    placeholder="YOUR FULL NAME"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm" htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-2xl font-black text-base outline-none focus:bg-accent-blue focus:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-1 focus:translate-y-1 transition-all"
                    placeholder="EMAIL@DOMAIN.COM"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm" htmlFor="password">Passkey</label>
                  <input 
                    type="password" 
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-[3px] border-black rounded-2xl font-black text-base outline-none focus:bg-accent-pink focus:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] focus:shadow-[2px_2px_0px_0px_#000] focus:translate-x-1 focus:translate-y-1 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 border-2 border-black rounded-xl text-[10px] font-bold leading-tight flex gap-2">
                 <input type="checkbox" className="mt-0.5 w-3 h-3 rounded border-black text-black focus:ring-0" required />
                 <span className="text-gray-500 uppercase italic">
                    I agree to the <a href="#" className="text-black underline underline-offset-2">Rules of Conduct</a> and <a href="#" className="text-black underline underline-offset-2">Privacy Encryption</a> Policies.
                 </span>
              </div>

              <button disabled={loading} className="w-full py-4 bg-black text-white font-black text-xl rounded-[24px] shadow-[6px_6px_0px_0px_#ff69b4] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 italic uppercase">
                {loading ? 'ENROLLING...' : 'Join Hub'} <ArrowRight className="w-6 h-6" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-base font-black text-gray-300">
                Already Joined?{' '}
                <Link href="/login" className="text-black hover:underline underline-offset-4 decoration-accent-yellow decoration-2">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
