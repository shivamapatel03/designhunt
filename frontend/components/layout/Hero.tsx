"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { FloatingShapesBackground } from "@/components/ui/floating-shapes";
import { SocialProof } from "@/components/layout/SocialProof";

const words = ["Foundation", "Typography", "Contrast", "Balance"];

interface HeroProps {
  userStats: {
    count: number;
    recentUsers: { name: string; avatar: string }[];
  };
}

export function Hero({ userStats }: HeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000); // changes every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-[85vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50/50 overflow-hidden pt-28 md:pt-32 pb-12 md:pb-16">
      
      {/* Radial Glow Background */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Dynamic playfulness on the sides */}
      <FloatingShapesBackground />

      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        {/* Optimized Critique AI Badge */}
        <Link href="/critique" className="z-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="group mb-12 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-xl border border-gray-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:bg-white hover:border-gray-300 transition-all cursor-pointer"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/10 group-hover:bg-blue-500 transition-colors">
              <img src="/logo/critique.png" alt="Critique AI" className="w-3 h-3" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-black transition-colors">
              Explore Critique AI 
            </span>
            <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
          </motion.div>
        </Link>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-black-han tracking-tight text-black max-w-4xl leading-[1.15] md:leading-[1.2]"
        >
          Everything Great in Design Starts With{" "}
          <span className="inline-grid overflow-hidden align-top pb-[0.1em]">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={words[index]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="col-start-1 row-start-1 text-left text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 font-black-han"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Subheadline - Made 'dull' as requested to make headline pop */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-sm md:text-base text-gray-400 max-w-xl font-medium tracking-tight"
        >
          Learn design from scratch — master theory, typography, and real-world principles that make designs actually work.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 md:mt-10 flex flex-col items-center w-full"
        >
          {/* Orange 3D Button Wrapper */}
          <div className="relative inline-block z-10 mt-1 mb-2">
            {/* The outer brown background */}
            <div className="absolute top-[-3px] bottom-[-9px] left-[-3px] right-[-3px] bg-[#2B1800] rounded-[7px] -z-10" />
            
            <Link
              href="/library"
              className="relative block px-8 py-3 bg-[#FFA12B] text-white text-xs sm:text-sm font-bold rounded-[5px] text-center shadow-[inset_0_1px_0_#FFE5C4,0_6px_0_#915100] active:top-[6px] active:-mb-[6px] active:shadow-[inset_0_1px_0_#FFE5C4,inset_0_-2px_0_#915100] transition-none hover:-translate-y-0"
              style={{ textShadow: "0px 1px 0px #000", fontFamily: "Helvetica, sans-serif" }}
            >
              Start Learning Free
            </Link>
          </div>
        </motion.div>

        {/* Trust Elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 md:mt-12 flex flex-col items-center gap-3 md:gap-4"
        >
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            {userStats?.recentUsers && userStats.recentUsers.length > 0 && (
              <div className="flex -space-x-2">
                {userStats.recentUsers.map((user, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm" title={user.name}>
                    <img src={user.avatar || `https://i.pravatar.cc/100?img=${i + 12}`} alt={user.name || "Student Avatar"} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm font-medium text-gray-600">
              <span className="font-bold text-gray-900">{userStats?.count ? `${userStats.count}+` : "25+"}</span> students joined this week
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
