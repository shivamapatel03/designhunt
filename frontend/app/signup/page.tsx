"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Globe, ChevronDown, Eye, EyeOff, Loader2 } from "lucide-react";

function SignupForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        router.push(redirectPath || data.redirect || "/");
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
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black selection:text-white overflow-hidden pt-20">

      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-[340px] mx-auto w-full relative z-10">
        {/* Main Logo Branding */}
        <motion.div 
            initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center mb-6"
        >
             <Link href="/" className="mb-4">
               <div className="text-2xl font-bold tracking-tighter text-black font-plus-jakarta">
                  Designhunt<span className="text-blue-500">.</span>
               </div>
             </Link>
             <h1 className="text-xl font-bold tracking-tight text-black">Create Account</h1>
        </motion.div>

        {/* Form Section */}
        <motion.form 
            initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            onSubmit={handleSubmit} 
            className="w-full space-y-2.5"
        >
          {error && (
            <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold text-center border border-red-100">
               {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-700" htmlFor="name">Enter Username</label>
              <input 
                type="text" 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-black placeholder:text-gray-400"
                placeholder="Username"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-700" htmlFor="email">Your email</label>
              <input 
                type="email" 
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-black placeholder:text-gray-400"
                placeholder="name@email.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-700" htmlFor="password">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-black placeholder:text-gray-400 pr-10"
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
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
             <input 
                type="checkbox" 
                id="rules" 
                className="mt-0.5 w-3.5 h-3.5 rounded border-gray-200 text-black focus:ring-0 cursor-pointer" 
                required 
             />
             <label htmlFor="rules" className="text-[10px] font-bold text-gray-500 leading-tight cursor-pointer select-none">
                I agree to the <a href="#" className="text-black underline underline-offset-4 decoration-1">Rules of Conduct</a> and <a href="#" className="text-black underline underline-offset-4 decoration-1">Privacy Encryption</a> Policies.
             </label>
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading} 
            className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Sign up'}
          </button>
        </motion.form>

        {/* Login Link */}
        <div className="mt-2 text-center">
            <p className="text-[10px] font-bold text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-black hover:underline underline-offset-4 transition-all">
                   Sign In
                </Link>
            </p>
        </div>

        {/* Separator */}
        <div className="w-full flex items-center gap-2 my-2">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-[9px] font-black text-gray-300">Or</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
        </div>

        {/* Google Signup */}
        <button 
          onClick={() => window.location.href = '/api/auth/google'}
          className="w-full flex items-center justify-center py-2 bg-white border border-gray-200 border-b-2 border-b-gray-300 rounded-xl font-bold text-sm hover:bg-gray-50 active:border-b-0 active:translate-y-[2px] transition-all group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafafa]"><Loader2 className="w-6 h-6 animate-spin text-black" /></div>}>
      <SignupForm />
    </Suspense>
  );
}
