
"use client";

import { useState } from "react";
import { CheckCircle2, Zap, Loader2, Star } from "lucide-react";

interface ProUpgradeCardProps {
  isPro: boolean;
  onUpgrade: () => void;
}

export function ProUpgradeCard({ isPro, onUpgrade }: ProUpgradeCardProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upgrade-pro", { method: "POST" });
      if (res.ok) {
        onUpgrade();
        alert("Welcome to Pro! You now have access to premium features.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  if (isPro) {
    return (
      <div className="bg-black text-white p-8 rounded-[32px] border-4 border-black relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Star className="w-32 h-32 text-yellow-500 fill-yellow-500" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-black uppercase tracking-widest mb-4">
            <Star className="w-3 h-3 fill-black" /> Pro Member
          </div>
          <h3 className="text-3xl font-black mb-2">You are a Pro!</h3>
          <p className="text-gray-400 font-medium max-w-sm">
            Thank you for supporting Design Hunt. You have fully unlocked access to all premium tools and content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-[32px] border-4 border-black relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
       {/* Decorative Elements */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-pink/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
        <div className="space-y-6 max-w-lg">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-yellow text-black text-xs font-black uppercase tracking-widest mb-4 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
               <Zap className="w-3 h-3 fill-black" /> Upgrade to Pro
            </div>
            <h3 className="text-4xl font-black mb-4 leading-tight">
              Unlock the Full <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-purple-400 to-accent-pink">Design Hunt</span> Experience.
            </h3>
            <p className="text-gray-400 font-medium text-lg">
              Get exclusive access to premium resources for just <span className="text-white font-black">$1/month</span>.
            </p>
          </div>

          <ul className="space-y-3">
            {[
              "Downloadable UI Kits & Source Files",
              "Advanced Theory Modules",
              "Pro Badge on Profile",
              "Priority Support"
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 font-bold text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-auto flex flex-col items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="text-center">
                <span className="text-3xl font-black">$1</span>
                <span className="text-gray-400 font-bold">/month</span>
            </div>
            <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full md:w-64 py-4 bg-white text-black font-black rounded-xl hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Go Pro Now"}
            </button>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Cancel Anytime</p>
        </div>
      </div>
    </div>
  );
}
