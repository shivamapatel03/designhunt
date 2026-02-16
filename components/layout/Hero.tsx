"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { IllustratedHero } from "@/components/ui/illustrated-hero";

export function Hero() {
  return (
      <section className="relative bg-white pt-32 md:pt-48 pb-12 md:pb-20 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>

        <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-20 grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-8"
            >
              Launch Your <br />
              Design Career <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-purple-500 to-accent-pink animate-gradient-x">
                from Scratch
              </span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/learning-paths"
                className="group relative inline-flex h-12 md:h-14 items-center justify-center rounded-xl bg-black px-6 md:px-8 text-base md:text-lg font-bold text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)]"
              >
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/challenges"
                className="inline-flex h-12 md:h-14 items-center justify-center rounded-xl border-2 border-black bg-white px-6 md:px-8 text-base md:text-lg font-bold text-black transition-all hover:bg-gray-50"
              >
                View Challenges
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4 text-sm font-semibold text-gray-500 pt-6 border-t border-gray-100"
            >
              <div className="flex -space-x-3">
                 {[1,2,3,4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                        i === 1 ? 'bg-accent-blue' : i === 2 ? 'bg-accent-pink' : i === 3 ? 'bg-accent-yellow text-black' : 'bg-black'
                    }`}>
                        {i === 4 ? '10k+' : ''}
                    </div>
                 ))}
              </div>
              <div className="flex flex-col">
                 <span className="text-black font-black uppercase tracking-tighter italic">Joined by 10,000+ Students</span>
                 <span className="text-xs font-bold text-gray-400">Rated 4.9/5 by beginners</span>
              </div>
            </motion.div>
          </div>
          
          <div className="relative flex justify-center md:justify-start">
             <IllustratedHero />
          </div>
        </div>
      </section>
  )
}
