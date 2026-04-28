"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

const words = ["Foundation", "Typography", "Contrast", "Balance"];

interface HeroProps {
  userStats: {
    count: number;
    recentUsers: { name: string; avatar: string }[];
  };
}

export function Hero({ userStats }: HeroProps) {
  const { user } = useAuth();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000); // changes every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-64px)] md:h-[100vh] flex flex-col items-center justify-center bg-white overflow-hidden pt-2 md:pt-20 pb-12 md:pb-10">
      <div className="max-w-7xl w-full relative z-10 mx-auto px-6 md:px-12 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 items-center justify-center flex-1">
        
        {/* Right Side - Image (Mobile Top) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex md:col-start-2 items-center justify-center relative w-full mb-4 md:mb-0 order-1 md:order-2"
        >
          <img 
            src="/heroimages/sideimg.png" 
            className="w-[90%] max-w-[380px] md:w-full md:max-w-[500px] h-auto object-contain transition-all duration-500" 
            alt="Hero Illustration" 
          />
        </motion.div>

        {/* Left Side - Content (Mobile Bottom) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1 w-full justify-center md:justify-start">
          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-800 md:text-black max-w-2xl leading-[1.25] md:leading-[1.2] mt-4 md:mt-0"
          >
            <span className="font-bungee">Everything Great in Design Starts With</span>{" "}
            <span className="inline-grid overflow-hidden align-top pb-[0.1em] text-center md:text-left w-full md:w-auto">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={words[index]}
                  initial={{ y: "40%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-40%", opacity: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.4, 0, 0.2, 1] 
                  }}
                  className="col-start-1 row-start-1 text-[#4F39F6] font-black-han"
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
            className="mt-3 md:mt-4 text-sm md:text-base text-gray-500 md:text-gray-400 max-w-lg font-medium tracking-tight mx-auto md:mx-0"
          >
            Learn design from scratch — master theory, typography, and real-world principles that make designs actually work.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 md:mt-8 flex flex-col items-center md:items-start w-full gap-3 md:gap-4"
          >
            <Link
              href={user ? "/profile" : "/onboarding"}
              className="w-full sm:w-auto text-center px-10 py-4 md:py-3.5 bg-black text-white text-[14px] md:text-sm font-black rounded-2xl md:rounded-xl uppercase tracking-widest transition-all shadow-[0_4px_0_0_#222] active:shadow-none active:translate-y-[4px] hover:bg-gray-900 mb-1"
            >
              {user ? "Go to learning profile" : "Start learning"}
            </Link>
          </motion.div>

          {/* Trust Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden md:flex mt-10 flex-col items-start gap-4"
          >
            <div className="flex items-center gap-3">
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
      </div>
    </section>
  );
}
