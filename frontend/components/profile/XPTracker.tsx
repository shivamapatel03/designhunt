"use client";

import { motion } from "framer-motion";
import { Zap, Trophy, Star } from "lucide-react";

interface XPTrackerProps {
  xp: number;
  nextLevelXp: number;
  level: number;
}

export function XPTracker({ xp, nextLevelXp, level }: XPTrackerProps) {
  const progress = (xp / nextLevelXp) * 100;

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center text-xl font-black">
            {level}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Level</div>
            <div className="font-bold text-lg leading-none">Mid-Level Creative</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-accent-yellow font-black">
            <Zap className="w-5 h-5 fill-current" />
            <span>{xp} XP</span>
        </div>
      </div>

      <div className="relative h-6 bg-gray-100 rounded-full border-2 border-black overflow-hidden">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="absolute top-0 left-0 h-full bg-accent-blue"
        />
        {/* Striped pattern overlay */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_25%,rgba(255,255,255,0.5)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.5)_75%,rgba(255,255,255,0.5)_100%)] bg-[length:20px_20px]" />
      </div>
      
      <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
        <span>0 XP</span>
        <span>{nextLevelXp} XP to Lvl {level + 1}</span>
      </div>
    </div>
  );
}
