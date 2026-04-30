"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Share2, Sparkles, Home, Star } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/components/providers/auth-provider";

export default function CompletionPage() {
  const params = useParams();
  const router = useRouter();
  const topicSlug = params.topic as string;
  const { user } = useAuth();
  
  const [topicTitle, setTopicTitle] = useState("");

  useEffect(() => {
    fetch(`/api/learning/topic/${topicSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.topic) setTopicTitle(data.topic.title);
      });
  }, [topicSlug]);

  return (
    <div className="h-screen bg-white text-black font-sans overflow-hidden selection:bg-black selection:text-white flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-6 lg:px-10 pt-16 pb-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 lg:gap-12 items-center relative overflow-visible"
        >
          {/* Left Side: Winner Character */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 lg:mb-8">
              <div className="relative z-10">
                <img 
                  src="/characters/winner.png" 
                  className="w-32 h-32 lg:w-48 lg:h-48 object-contain" 
                  alt="Winner" 
                />
              </div>
            </div>
            
            <span className="text-[10px] lg:text-[12px] font-black text-[#2B7FFF] uppercase tracking-[0.3em] mb-2 lg:mb-3 block leading-none">Topic Mastered</span>
            <h2 className="text-2xl lg:text-4xl font-black text-black tracking-tighter leading-none mb-3 lg:mb-4 uppercase italic">
              Level Max
            </h2>
            <div className="w-24 lg:w-32 h-1 bg-gradient-to-r from-transparent via-[#2B7FFF]/20 to-transparent rounded-full" />
          </div>

          {/* Right Side: Achievement Details */}
          <div className="flex flex-col text-center lg:text-left">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-black tracking-tighter leading-tight lg:leading-none mb-3 lg:mb-4">
              Epic Work,<br className="hidden lg:block" />{user?.username || 'Designer'}!
            </h1>
            <p className="text-sm lg:text-base font-semibold text-gray-400 max-w-sm mx-auto lg:mx-0 leading-relaxed mb-6 lg:mb-8">
              You've officially mastered <span className="text-black font-black">{topicTitle || topicSlug}</span>. Every level is unlocked and your skills have peaked.
            </p>

            <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-8 lg:mb-10">
              <div className="bg-white p-4 lg:p-5 rounded-[24px] lg:rounded-[28px] border border-black/5 flex flex-col items-center lg:items-start">
                <span className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 lg:mb-3">Total XP</span>
                <div className="flex items-center gap-2">
                  <img src="/daily/XP.png" className="w-5 h-5 lg:w-6 lg:h-6 object-contain" alt="XP" />
                  <h4 className="text-lg lg:text-2xl font-black text-black">1,250</h4>
                </div>
              </div>
              <div className="bg-white p-4 lg:p-5 rounded-[24px] lg:rounded-[28px] border border-black/5 flex flex-col items-center lg:items-start">
                <span className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 lg:mb-3">Topic Rank</span>
                <div className="flex items-center gap-2">
                  <img src="/daily/level.png" className="w-5 h-5 lg:w-6 lg:h-6 object-contain" alt="Rank" />
                  <h4 className="text-lg lg:text-2xl font-black text-black">Top 5%</h4>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
              <Link 
                href="/theory"
                className="w-full lg:w-auto px-10 py-3.5 lg:py-4 bg-[#2B7FFF] text-white rounded-2xl font-black text-[12px] lg:text-[13px] uppercase tracking-widest shadow-[0_6px_0_0_#1556B8] hover:translate-y-[-2px] hover:shadow-[0_8px_0_0_#1556B8] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Library
              </Link>
              <Link 
                href={`/theory/learning/${topicSlug}/path`}
                className="text-[11px] lg:text-[12px] font-black text-gray-300 uppercase tracking-[0.2em] hover:text-black transition-colors"
              >
                Review Path
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
