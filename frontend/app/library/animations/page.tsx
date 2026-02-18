
"use client";

import { useState } from "react";
import { AnimatedBorder } from "@/components/library/AnimatedBorder";
import { GlitchText } from "@/components/library/GlitchText";
import { Copy, Check, ArrowLeft, Zap, Sparkles, Move, Loader, MousePointer } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ANIMATIONS = [
  // --- EXISTING ---
  {
    id: "animated-border",
    category: "Border",
    title: "Gradient Border",
    description: "Rotating conic gradient.",
    component: (
      <AnimatedBorder className="w-full h-32 flex items-center justify-center bg-zinc-900">
        <div className="text-white font-bold text-sm">Hover Me</div>
      </AnimatedBorder>
    ),
    code: `<AnimatedBorder>Content</AnimatedBorder>` // Simplified for preview
  },
  {
    id: "glitch-text",
    category: "Text",
    title: "Glitch Text",
    description: "Cyberpunk distortion.",
    component: (
      <div className="w-full h-32 bg-black rounded-xl flex items-center justify-center">
        <GlitchText text="GLITCH" className="text-2xl text-white" />
      </div>
    ),
    code: `<GlitchText text="GLITCH" />`
  },

  // --- MEGA PACK NEW ---
  {
    id: "float",
    category: "Motion",
    title: "Levitate",
    description: "Gentle floating motion.",
    component: (
      <div className="w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center">
        <div className="w-16 h-16 bg-accent-blue rounded-xl shadow-xl animate-float flex items-center justify-center text-white">
            <Move className="w-6 h-6" />
        </div>
      </div>
    ),
    code: `<div className="animate-float">...</div>`
  },
  {
    id: "shake",
    category: "Interaction",
    title: "Error Shake",
    description: "Vibrates on interaction.",
    component: (
      <div className="w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center">
        <button className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold hover:animate-shake">
            Reject
        </button>
      </div>
    ),
    code: `<button className="hover:animate-shake">...</button>`
  },
  {
    id: "blur-in",
    category: "Entry",
    title: "Blur Reveal",
    description: "Smooth blur-to-focus entry.",
    component: (
      <div className="w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
        <div key={Math.random()} className="text-2xl font-black animate-blur-in">
            FOCUS
        </div>
      </div>
    ),
    code: `<div className="animate-blur-in">FOCUS</div>`
  },
  {
    id: "scale-up",
    category: "Entry",
    title: "Pop In",
    description: "Springy scale up animation.",
    component: (
      <div className="w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center">
        <div className="w-12 h-12 bg-accent-purple rounded-full animate-scale-up" />
      </div>
    ),
    code: `<div className="animate-scale-up" />`
  },
  {
    id: "spin-slow",
    category: "Loader",
    title: "Zen Spin",
    description: "Infinite slow rotation.",
    component: (
      <div className="w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center">
         <Loader className="w-8 h-8 text-black animate-spin-slow" />
      </div>
    ),
    code: `<Loader className="animate-spin-slow" />`
  },
  {
    id: "pulse-fast",
    category: "Loader",
    title: "Hyper Pulse",
    description: "Rapid attention grabber.",
    component: (
      <div className="w-full h-32 bg-zinc-900 rounded-xl flex items-center justify-center">
         <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse-fast shadow-[0_0_10px_#22c55e]" />
      </div>
    ),
    code: `<div className="animate-pulse-fast" />`
  },
  {
    id: "bounce-small",
    category: "Motion",
    title: "Micro Bounce",
    description: "Subtle jumping attention cue.",
    component: (
      <div className="w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center">
         <ArrowLeft className="w-6 h-6 -rotate-90 animate-bounce-small" />
      </div>
    ),
    code: `<div className="animate-bounce-small" />`
  },
  {
    id: "neon-glow",
    category: "Effect",
    title: "Neon Pulse",
    description: "Glowing pulsating shadow.",
    component: (
      <div className="w-full h-32 bg-black rounded-xl flex items-center justify-center">
         <button className="px-4 py-2 text-cyan-400 border border-cyan-400 rounded shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse">
            CYBER
         </button>
      </div>
    ),
    code: `<div className="shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse" />`
  },
   {
    id: "gradient-text",
    category: "Text",
    title: "Flowing Text",
    description: "Animated background clip.",
    component: (
      <div className="w-full h-32 bg-white rounded-xl flex items-center justify-center">
         <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient bg-300%">
            FLOW
         </h3>
      </div>
    ),
    code: `<h3 className="animate-gradient bg-300% bg-clip-text text-transparent ...">FLOW</h3>`
  },
  {
    id: "skew-hover",
    category: "Hover",
    title: "Skew Active",
    description: "Dynamic skew on click/active.",
    component: (
      <div className="w-full h-32 bg-gray-50 rounded-xl flex items-center justify-center">
         <button className="px-6 py-3 bg-black text-white font-bold rounded hover:-skew-x-12 transition-transform active:scale-95">
            SKEW
         </button>
      </div>
    ),
    code: `<button className="hover:-skew-x-12 transition-transform">SKEW</button>`
  }
];

export default function AnimationsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto mb-16 text-center">
            <Link href="/library" className="inline-flex items-center gap-2 text-gray-400 hover:text-black font-bold mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Library
            </Link>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                Animation <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-pink">Mega Pack</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A growing collection of <span className="font-bold text-black">{ANIMATIONS.length}+</span> drop-in effects. 
                Click to copy, paste to ship.
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {ANIMATIONS.map((item) => (
                <div key={item.id} className="group bg-white rounded-2xl border border-gray-200 hover:border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 min-h-[140px] flex items-center justify-center relative">
                        {item.component}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded border border-gray-200">
                                {item.category}
                             </span>
                        </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-lg leading-tight mb-1">{item.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                        </div>
                        
                        <button 
                            onClick={() => handleCopy(item.code, item.id)}
                            className={cn(
                                "mt-4 w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all",
                                copiedId === item.id 
                                    ? "bg-green-500 text-white" 
                                    : "bg-black text-white hover:bg-gray-800"
                            )}
                        >
                            {copiedId === item.id ? (
                                <><Check className="w-3 h-3" /> Copied</>
                            ) : (
                                <><Copy className="w-3 h-3" /> Copy Class</>
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
