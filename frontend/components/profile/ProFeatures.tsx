
"use client";

import { useState } from "react";
import { Copy, Check, Lock, Zap, FileCode, Layout } from "lucide-react";
import { motion } from "framer-motion";

const PREMIUM_ASSETS = [
  {
    id: "glass-card",
    title: "Glassmorphism Card v2",
    description: "Premium frosted glass effect with noise texture and border gradient.",
    preview: (
      <div className="relative w-full h-32 overflow-hidden rounded-xl bg-black/90 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-pink/20" />
        <div className="relative w-3/4 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl flex items-center justify-center text-white font-bold">
            Glass UI
        </div>
      </div>
    ),
    code: `<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-6 relative overflow-hidden">
  <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
  <h3 className="text-white font-bold">Glass Card</h3>
</div>`
  },
  {
    id: "neon-btn",
    title: "Cyberpunk Neon Button",
    description: "High-performance CSS glow effect with hover state animation.",
    preview: (
      <div className="w-full h-32 bg-black flex items-center justify-center rounded-xl">
        <button className="px-6 py-2 bg-black text-accent-blue border border-accent-blue rounded-md shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] hover:bg-accent-blue/10 transition-all font-mono uppercase text-xs tracking-widest">
            Execute
        </button>
      </div>
    ),
    code: `<button className="px-6 py-2 bg-black text-blue-500 border border-blue-500 rounded-md shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] hover:bg-blue-500/10 transition-all font-mono uppercase tracking-widest">
  Execute
</button>`
  },
  {
    id: "grid-bg",
    title: "Retro Grid Background",
    description: "SVG-based infinite grid pattern used in the Hero section.",
    preview: (
        <div className="w-full h-32 bg-white flex items-center justify-center rounded-xl overflow-hidden relative border border-gray-200">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             <span className="relative z-10 font-bold text-gray-400">Grid Pattern</span>
        </div>
    ),
    code: `<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>`
  }
];

export function ProFeatures() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-8">
            <h3 className="text-3xl font-black mb-2 flex items-center gap-3">
                <FileCode className="w-8 h-8 text-black" /> The Hunter's Stash
            </h3>
            <p className="text-gray-500 font-medium text-lg">
                Exclusive, production-ready components stolen from top-tier designs. <span className="text-black font-bold">Copy, paste, ship.</span>
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREMIUM_ASSETS.map((asset) => (
                <div key={asset.id} className="group border-2 border-gray-200 rounded-2xl p-4 hover:border-black transition-all bg-gray-50/50 hover:shadow-md">
                    <div className="mb-4">
                        {asset.preview}
                    </div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                            <h4 className="font-black text-lg">{asset.title}</h4>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">{asset.description}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleCopy(asset.code, asset.id)}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-white border-2 border-black rounded-xl font-bold text-sm hover:bg-black hover:text-white transition-all active:scale-95"
                    >
                        {copiedId === asset.id ? (
                            <><Check className="w-4 h-4" /> Copied!</>
                        ) : (
                            <><Copy className="w-4 h-4" /> Steal Code</>
                        )}
                    </button>
                </div>
            ))}
            
            {/* Locked Teaser */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-gray-400 gap-3 min-h-[300px]">
                <Lock className="w-8 h-8 mb-2" />
                <h4 className="font-black text-lg text-gray-500">More Coming Soon</h4>
                <p className="text-sm">New assets dropped weekly.</p>
            </div>
        </div>
    </div>
  );
}
