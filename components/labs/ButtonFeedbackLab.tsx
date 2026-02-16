"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sliders, MousePointer2 } from "lucide-react";

export function ButtonFeedbackLab() {
    const [hoverScale, setHoverScale] = useState(true);
    const [clickShrink, setClickShrink] = useState(true);
    const [stiffness, setStiffness] = useState(400); // Spring stiffness
    const [damping, setDamping] = useState(17); // Spring damping

    return (
        <div className="bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden my-12">
            {/* Lab Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="bg-accent-pink text-black text-xs font-bold px-2 py-0.5 rounded uppercase">Experimental Sandbox</span>
                    <h3 className="font-bold">Interaction Lab</h3>
                </div>
                <MousePointer2 className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex flex-col md:flex-row h-[400px]">
                {/* Configuration Panel (Left) */}
                <div className="w-full md:w-1/3 bg-gray-50 border-r-2 border-black p-6 flex flex-col gap-6">
                    <div>
                        <h4 className="font-bold text-sm uppercase text-gray-500 mb-4 flex items-center gap-2">
                            <Sliders className="w-4 h-4" /> Variables
                        </h4>
                        
                        {/* Toggles */}
                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium">Hover Scale</span>
                                <input 
                                    type="checkbox" 
                                    checked={hoverScale} 
                                    onChange={(e) => setHoverScale(e.target.checked)}
                                    className="accent-black w-5 h-5"
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium">Click Shrink</span>
                                <input 
                                    type="checkbox" 
                                    checked={clickShrink} 
                                    onChange={(e) => setClickShrink(e.target.checked)}
                                    className="accent-black w-5 h-5"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold uppercase text-gray-500">Stiffness (Spring)</span>
                                <span className="text-xs font-mono">{stiffness}</span>
                            </div>
                            <input 
                                type="range" 
                                min="100" 
                                max="1000" 
                                step="50"
                                value={stiffness} 
                                onChange={(e) => setStiffness(Number(e.target.value))}
                                className="w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold uppercase text-gray-500">Damping (Bounce)</span>
                                <span className="text-xs font-mono">{damping}</span>
                            </div>
                            <input 
                                type="range" 
                                min="5" 
                                max="50" 
                                step="1"
                                value={damping} 
                                onChange={(e) => setDamping(Number(e.target.value))}
                                className="w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Playground Area (Right) */}
                <div className="flex-1 bg-[url('/grid-pattern.svg')] bg-gray-100 flex items-center justify-center relative p-8">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    <motion.button
                        whileHover={hoverScale ? { scale: 1.1 } : {}}
                        whileTap={clickShrink ? { scale: 0.95 } : {}}
                        transition={{
                            type: "spring",
                            stiffness: stiffness,
                            damping: damping
                        }}
                        className="bg-black text-white px-8 py-4 rounded-xl font-bold text-xl shadow-xl flex items-center gap-3 relative z-10"
                    >
                        Interact with Me
                        <MousePointer2 className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
