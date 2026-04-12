"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
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
    <section className="relative h-[100vh] min-h-[600px] flex flex-col items-center justify-center bg-white overflow-hidden pt-20 pb-10">
      <div className="max-w-[1920px] w-full relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-10 grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Content */}
        <div className="flex flex-col items-start text-left">
          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black-han tracking-tight text-black max-w-xl leading-[1.15] md:leading-[1.2]"
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
                  className="col-start-1 row-start-1 text-left text-blue-600 font-black-han"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-sm md:text-base text-gray-400 max-w-lg font-medium tracking-tight"
          >
            Learn design from scratch — master theory, typography, and real-world principles that make designs actually work.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 md:mt-8 flex flex-col items-start w-full"
          >
            <Link
              href="/library"
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-gray-900 transition-all active:scale-[0.98]"
            >
              Start learning
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Trust Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 md:mt-10 flex flex-col items-start gap-3 md:gap-4"
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

        {/* Right Side - Image */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:flex items-center justify-center relative"
        >
          <img 
            src="/heroimages/sideimg.jpg" 
            className="w-full max-w-[420px] h-auto object-contain transition-all duration-500" 
            alt="Hero Illustration" 
          />
        </motion.div>

      </div>
    </section>
  );
}
