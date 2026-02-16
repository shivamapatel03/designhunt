"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Beaker, RotateCcw, Info, Type, Star } from "lucide-react";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";

export default function InteractionLabPage() {
  const [gestaltMode, setGestaltMode] = useState<"proximity" | "similarity" | "closure" | "fate">("proximity");

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      <div className="container mx-auto max-w-7xl px-6 pt-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-xs font-black uppercase tracking-widest">
                <Beaker className="w-3 h-3" />
                Experimental Beta
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">The Interaction Lab</h1>
            <p className="text-xl text-gray-600 max-w-2xl font-medium">
              A sandbox for designer's hands. Play with fundamental laws and see how they break.
            </p>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-black font-bold hover:bg-black hover:text-white transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Lab
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gestalt Principles Visualizer */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border-2 border-black rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black">Gestalt Principles</h3>
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                        {(["proximity", "similarity", "closure", "fate"] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setGestaltMode(mode)}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                                    gestaltMode === mode ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative h-[400px] border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center bg-gray-50/50">
                    <div className="grid grid-cols-4 gap-6 p-8">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <motion.div
                                key={i}
                                layout
                                initial={false}
                                animate={{
                                    x: gestaltMode === "proximity" ? (i % 2 === 0 ? -12 : 12) : 0,
                                    scale: gestaltMode === "similarity" ? (i % 2 === 0 ? 1.2 : 0.8) : 1,
                                    borderRadius: gestaltMode === "similarity" ? (i % 2 === 0 ? "10px" : "100%") : (gestaltMode === "closure" ? (i < 4 || i > 11 || i % 4 === 0 || i % 4 === 3 ? "4px" : "100%") : "100%"),
                                    opacity: gestaltMode === "closure" ? (i === 5 || i === 6 || i === 9 || i === 10 ? 0 : 1) : 1,
                                    backgroundColor: gestaltMode === "similarity" ? (i % 2 === 0 ? "#007bff" : "#ff69b4") : "#1a1a1a",
                                    y: gestaltMode === "fate" ? (i % 2 === 0 ? [0, -30, 0] : 0) : 0
                                }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 30,
                                    y: gestaltMode === "fate" ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }
                                }}
                                className="w-12 h-12 bg-black shadow-lg"
                            />
                        ))}
                    </div>
                    
                    {gestaltMode === "closure" && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute pointer-events-none border-4 border-dashed border-accent-blue/30 w-48 h-48 rounded-2xl"
                        />
                    )}
                </div>

                <div className="mt-8 flex items-start gap-4 p-4 bg-accent-blue/5 rounded-2xl border border-accent-blue/10">
                    <Info className="w-5 h-5 text-accent-blue mt-1 shrink-0" />
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                        {gestaltMode === "proximity" && "Proximity: Elements that are close together are perceived as group."}
                        {gestaltMode === "similarity" && "Similarity: Elements with similar visual traits are perceived as related."}
                        {gestaltMode === "closure" && "Closure: The mind completes missing parts of a shape to perceive a whole."}
                        {gestaltMode === "fate" && "Common Fate: Elements moving in the same direction at the same speed are perceived as a group."}
                    </p>
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <KerningGame />
                </div>
                <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black mb-4">Coming Soon: Ames Room</h3>
                    <p className="text-gray-500 text-sm font-medium mb-6 italic">A perspective-bending CSS illusion that breaks depth perception.</p>
                    <div className="h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-300">Module Under Construction</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Sidebar / Tools */}
          <aside className="space-y-8">
             <div className="bg-black text-white rounded-3xl p-8 shadow-xl">
                 <h3 className="text-xl font-black mb-4">Lab Notes</h3>
                 <ul className="space-y-4 text-sm font-medium text-gray-400">
                     <li className="flex gap-3">
                         <span className="text-accent-pink">01</span>
                         Theory isn't just for reading; it's for feeling. Use these modules to develop your 'gut' for design.
                     </li>
                     <li className="flex gap-3">
                         <span className="text-accent-blue">02</span>
                         Framer Motion powers the springs here. Consistent timing is key to smooth perception.
                     </li>
                 </ul>
             </div>
             
             <div className="bg-accent-yellow rounded-3xl p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                 <h4 className="text-lg font-black mb-2">Request an Experiment</h4>
                 <p className="text-sm font-bold text-black/60 mb-6">Want to see a specific UX law in the lab? Let us know.</p>
                 <button className="w-full py-3 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 transition-colors">Submit Idea</button>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const TARGET_OFFSETS = [0, 48, 102, 164, 230]; // Mock "perfect" kerning
const KERNING_LETTERS = ["A", "V", "A", "N", "T"];

function KerningGame() {
  const [offsets, setOffsets] = useState([0, 0, 0, 0, 0]);
  const [score, setScore] = useState<number | null>(null);

  const checkKerning = () => {
    let totalError = 0;
    offsets.forEach((offset, i) => {
        const error = Math.abs(offset - (TARGET_OFFSETS[i] - TARGET_OFFSETS[0]));
        totalError += error;
    });
    const finalScore = Math.max(0, 100 - Math.round(totalError / 2));
    setScore(finalScore);
  };

  const reset = useCallback(() => {
    setOffsets([0, 15, 45, 80, 120]); // Messy start
    setScore(null);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                <Type className="w-5 h-5" /> The Kerning Game
            </h3>
            <div className="flex gap-2">
                <button onClick={reset} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>
        </div>
        
        <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">
            Fix the spacing. Drag the letters until the visual rhythm feels perfect.
        </p>

        <div className="h-48 bg-gray-50 rounded-2xl border-2 border-black flex items-center justify-center overflow-hidden relative">
            <div className="flex relative h-20 items-center">
                {KERNING_LETTERS.map((letter, i) => (
                    <motion.div
                        key={i}
                        drag="x"
                        dragConstraints={{ left: -200, right: 400 }}
                        dragElastic={0}
                        dragMomentum={false}
                        onDrag={(_, info) => {
                            setOffsets(prev => {
                                const next = [...prev];
                                next[i] += info.delta.x;
                                return next;
                            });
                        }}
                        style={{ x: offsets[i] }}
                        className="absolute cursor-grab active:cursor-grabbing select-none"
                    >
                        <span className="text-7xl font-black tracking-normal leading-none font-serif">{letter}</span>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button 
                onClick={checkKerning}
                className="flex-1 py-4 bg-black text-white font-black uppercase tracking-widest text-xs rounded-xl hover:opacity-90 transition-opacity"
            >
                CHECK KERNING
            </button>
            {score !== null && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-6 py-4 bg-accent-yellow border-2 border-black rounded-xl flex items-center gap-2"
                >
                    <Star className="w-4 h-4 fill-black" />
                    <span className="font-black italic text-xl">{score}%</span>
                </motion.div>
            )}
        </div>
        
        {score !== null && score > 90 && (
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[10px] font-black text-green-600 uppercase tracking-widest"
            >
                Typographic Masterpiece!
            </motion.p>
        )}
    </div>
  );
}
