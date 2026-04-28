"use client";

import { useState } from "react";
import { Eye, Layout } from "lucide-react";

export function HeatmapSimulator() {
  const [activePattern, setActivePattern] = useState<'F' | 'Z' | 'Single'>('F');

  const patterns = {
    F: {
      name: "F-Pattern",
      desc: "Users scan the top line, then a second horizontal line, then the left vertical side. Common for text-heavy content.",
      heatmap: "bg-gradient-to-b from-red-500/50 via-green-400/30 to-transparent",
      overlay: (
         <>
            <div className="absolute top-4 left-4 right-4 h-8 bg-red-600/60 blur-xl"></div>
            <div className="absolute top-24 left-4 right-32 h-6 bg-orange-500/50 blur-xl"></div>
            <div className="absolute top-4 bottom-4 left-4 w-12 bg-yellow-500/40 blur-xl"></div>
         </>
      )
    },
    Z: {
      name: "Z-Pattern",
      desc: "Users scan from top-left to top-right, then diagonal to bottom-left, then across to bottom-right. Common for landing pages.",
      heatmap: "",
      overlay: (
         <>
            <div className="absolute top-8 left-8 right-8 h-4 bg-red-600/50 blur-lg"></div>
            <div className="absolute top-8 right-8 bottom-8 left-8 w-4 bg-orange-500/40 blur-lg rotate-[30deg] origin-top-right transform translate-x-[-50%]"></div> {/* Approximate */}
             <div className="absolute top-0 right-0 w-full h-full"> 
                {/* SVG for cleaner Z diagonal */}
                <svg className="w-full h-full">
                    <path d="M 50 50 L 500 50 L 50 350 L 500 350" fill="none" stroke="rgba(255,0,0,0.3)" strokeWidth="40" strokeLinecap="round" className="blur-xl" />
                </svg>
             </div>
         </>
      )
    },
    Single: {
      name: "Single Focal Point",
      desc: "A strong central element (like a hero image or headline) draws all attention immediately.",
      heatmap: "",
      overlay: (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/60 blur-[60px] rounded-full"></div>
      )
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
      <h3 className="text-2xl font-bold mb-6">Heatmap Simulator</h3>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-8">
        {(['F', 'Z', 'Single'] as const).map(p => (
            <button
                key={p}
                onClick={() => setActivePattern(p)}
                className={`flex-1 min-w-[100px] py-3 px-4 rounded-lg border-2 font-bold transition-all text-sm ${
                    activePattern === p 
                    ? "bg-black text-white border-black" 
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-black"
                }`}
            >
                {patterns[p].name}
            </button>
        ))}
      </div>

       <div className="mb-4 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex items-start gap-3">
        <Eye className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>{patterns[activePattern].desc}</p>
      </div>

      {/* Simulation */}
      <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden h-96 bg-white">
         
         {/* Mock Content Layouts */}
         {activePattern === 'F' && (
             <div className="p-8 space-y-6 opacity-40">
                <div className="h-8 bg-gray-800 w-full mb-8"></div> {/* Nav */}
                <div className="h-6 bg-gray-400 w-3/4"></div> {/* Headline */}
                <div className="space-y-3">
                    <div className="h-3 bg-gray-300 w-full"></div>
                    <div className="h-3 bg-gray-300 w-full"></div>
                    <div className="h-3 bg-gray-300 w-2/3"></div>
                </div>
                 <div className="h-6 bg-gray-400 w-1/2 mt-8"></div> {/* Subhead */}
                 <div className="space-y-3">
                    <div className="h-3 bg-gray-300 w-full"></div>
                    <div className="h-3 bg-gray-300 w-full"></div>
                </div>
             </div>
         )}

        {activePattern === 'Z' && (
             <div className="p-8 flex flex-col justify-between h-full opacity-40">
                <div className="flex justify-between items-center">
                    <div className="w-12 h-12 bg-black rounded-full"></div>
                    <div className="w-32 h-10 bg-gray-400 rounded"></div>
                </div>
                <div className="self-center text-center w-full px-4">
                    <div className="h-10 bg-gray-800 w-full max-w-[384px] mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-300 w-48 mx-auto"></div>
                </div>
                 <div className="flex justify-between items-center">
                    <div className="w-full h-12 bg-gray-200 rounded"></div>
                    <div className="w-32 h-12 bg-blue-600 rounded ml-4"></div>
                </div>
             </div>
         )}

         {activePattern === 'Single' && (
             <div className="p-8 h-full flex items-center justify-center opacity-40">
                <div className="text-center">
                    <div className="w-48 h-48 bg-black rounded-full mx-auto mb-6"></div>
                    <div className="h-8 bg-gray-800 w-64 mx-auto"></div>
                </div>
             </div>
         )}
         
         {/* The Heatmap Overlay */}
         <div className="absolute inset-0 pointer-events-none mix-blend-multiply">
            {patterns[activePattern].overlay}
         </div>

      </div>
       <p className="text-center text-xs text-gray-400 mt-4">Simulated eye-tracking data based on layout structure.</p>
    </div>
  );
}
