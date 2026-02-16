"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LAWS = [
  {
    title: "Fitts's Law",
    description: "The time to acquire a target is a function of the distance to and size of the target.",
    href: "/theory/ux-laws",
    interactiveLabel: "Try to click the target below!",
    color: "bg-accent-blue"
  }
];

interface DailyLawCardProps {
    className?: string;
}

export function DailyLawCard({ className }: DailyLawCardProps) {
  const [success, setSuccess] = useState(false);
  const law = LAWS[0]; // For now, just one. We could randomize daily.

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border-2 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <Sparkles className="w-24 h-24" />
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-yellow border border-black text-xs font-black uppercase tracking-wider">
            Today's Design Principle
          </div>
          
          <h2 className="text-4xl font-black tracking-tight">{law.title}</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-md">
            {law.description}
          </p>

          <Link 
            href={law.href}
            className="group inline-flex items-center gap-2 text-sm font-black hover:underline underline-offset-4"
          >
            Learn more about UX Laws
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-6 overflow-hidden">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{law.interactiveLabel}</span>
             
             <div className="relative w-full flex justify-center">
                <motion.button
                  onClick={() => setSuccess(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative z-10 w-16 h-16 rounded-full ${success ? 'bg-green-500' : 'bg-red-500'} border-4 border-black flex items-center justify-center transition-colors shadow-lg`}
                >
                  <Target className={`w-8 h-8 ${success ? 'text-white' : 'text-white/80'}`} />
                  {success && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        className="absolute inset-0 bg-green-500 rounded-full"
                    />
                  )}
                </motion.button>
              </div>

              {success && (
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-black text-green-600"
                >
                    Success! Target Acquired.
                </motion.p>
              )}

              <div className="absolute top-4 left-4 text-[10px] font-mono text-gray-300">Target Size: 64px | Distance: Responsive</div>
        </div>
      </div>
    </motion.div>
  );
}
