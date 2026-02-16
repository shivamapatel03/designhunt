"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { IllustratedHero } from "@/components/ui/illustrated-hero";
import { SocialProof } from "@/components/layout/SocialProof";

interface HeroProps {
  userStats: {
    count: number;
    recentUsers: { name: string; avatar: string }[];
  };
}

export function Hero({ userStats }: HeroProps) {
  return (
      <section className="relative bg-white pt-32 md:pt-48 pb-12 md:pb-20 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>

        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-20 grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
               <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="block"
                >
                  Launch Your
                </motion.span>
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="block"
                >
                  Design Career
                </motion.span>
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative inline-block mt-2"
                >
                    <span className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-purple-500 to-accent-pink blur-2xl opacity-30 animate-pulse"></span>
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-purple-500 to-accent-pink animate-gradient-x">
                        from Scratch
                    </span>
                </motion.span>
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/library"
                className="group relative inline-flex h-14 items-center justify-center rounded-xl bg-black px-10 text-lg font-bold text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all overflow-hidden"
              >
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                 <span className="relative flex items-center gap-2">
                    Explore Library
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                 </span>
              </Link>
            </motion.div>

            <SocialProof count={userStats.count} recentUsers={userStats.recentUsers} />
          </div>
          
          <div className="relative flex justify-center md:block">
             <IllustratedHero />
          </div>
        </div>
      </section>
  )
}
