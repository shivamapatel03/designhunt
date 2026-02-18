"use client";

import { useState, useEffect } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti"; // Re-use confetti for delight!
import { playClickSound } from "@/lib/audio";

export function AssetGenerator() {
  const [gradient, setGradient] = useState("");
  const [copied, setCopied] = useState(false);
  const [direction, setDirection] = useState("to right");
  
  
  /* Sound via utility */

  const generateGradient = () => {
    const hex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const color1 = hex();
    const color2 = hex();
    const newGradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
    setGradient(newGradient);
    setCopied(false);
  };

  useEffect(() => {
    generateGradient();
  }, []);

  const handleCopy = () => {
    playClickSound();
    navigator.clipboard.writeText(`background: ${gradient};`);
    setCopied(true);
    
    // Mini confetti
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#818cf8', '#c084fc'], // Blue/Purple theme
      shapes: ['circle']
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-purple-500 to-accent-pink rounded-[2rem] blur opacity-75 animate-pulse"></div>
        <div className="relative bg-white rounded-[1.75rem] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-lg uppercase tracking-tight">Instant Gradient</h3>
                <div className="flex gap-1">
                    <button 
                        onClick={generateGradient}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors border-2 border-transparent hover:border-black"
                        title="Generate New"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Gradient Preview */}
            <motion.div 
                key={gradient}
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-48 w-full rounded-2xl border-2 border-black mb-4 shadow-inner relative group cursor-pointer"
                style={{ background: gradient }}
                onClick={handleCopy}
            >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white font-bold backdrop-blur-sm rounded-[14px]">
                    Click to Copy
                </div>
            </motion.div>

            {/* CSS Code & Copy */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-3 border-2 border-black/10">
                <code className="text-xs font-mono text-gray-600 flex-1 truncate">
                    background: {gradient};
                </code>
                <button 
                    onClick={handleCopy}
                    className={cn(
                        "p-2 rounded-lg font-bold border-2 transition-all flex items-center gap-2",
                        copied 
                            ? "bg-green-400 border-black text-black" 
                            : "bg-black text-white border-black hover:-translate-y-0.5"
                    )}
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-xs uppercase">{copied ? "Copied" : "Copy"}</span>
                </button>
            </div>

        </div>
    </div>
  );
}
