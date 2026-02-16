"use client";

import { useState } from "react";
import { Copy, RefreshCw, Play } from "lucide-react";
import { motion } from "framer-motion";

export function BezierPlayground() {
  const [p1, setP1] = useState(0.4); // x1
  const [p2, setP2] = useState(0.0); // y1
  const [p3, setP3] = useState(0.2); // x2
  const [p4, setP4] = useState(1.0); // y2
  const [key, setKey] = useState(0);

  const bezierString = `cubic-bezier(${p1}, ${p2}, ${p3}, ${p4})`;

  const presets = [
    { name: "Ease", vals: [0.25, 0.1, 0.25, 1] },
    { name: "Ease In", vals: [0.42, 0, 1, 1] },
    { name: "Ease Out", vals: [0, 0, 0.58, 1] },
    { name: "Bounce", vals: [0.68, -0.6, 0.32, 1.6] },
  ];

  const applyPreset = (vals: number[]) => {
    setP1(vals[0]); setP2(vals[1]); setP3(vals[2]); setP4(vals[3]);
    setKey(k => k + 1); // Re-trigger animation
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
      <h3 className="text-2xl font-bold mb-6">Bezier Playground</h3>
      
      <div className="grid md:grid-cols-2 gap-8">
         {/* Controls */}
         <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
                {presets.map(p => (
                    <button 
                        key={p.name}
                        onClick={() => applyPreset(p.vals)}
                        className="px-3 py-1 bg-gray-100 hover:bg-black hover:text-white rounded text-sm font-bold transition-colors"
                    >
                        {p.name}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-sm font-bold">X1: {p1}</label>
                    <input type="range" min="0" max="1" step="0.01" value={p1} onChange={e => setP1(Number(e.target.value))} className="w-40 accent-black" />
                 </div>
                 <div className="flex items-center justify-between">
                    <label className="text-sm font-bold">Y1: {p2}</label>
                    <input type="range" min="-1" max="2" step="0.1" value={p2} onChange={e => setP2(Number(e.target.value))} className="w-40 accent-black" />
                 </div>
                 <div className="flex items-center justify-between">
                    <label className="text-sm font-bold">X2: {p3}</label>
                    <input type="range" min="0" max="1" step="0.01" value={p3} onChange={e => setP3(Number(e.target.value))} className="w-40 accent-black" />
                 </div>
                 <div className="flex items-center justify-between">
                    <label className="text-sm font-bold">Y2: {p4}</label>
                    <input type="range" min="-1" max="2" step="0.1" value={p4} onChange={e => setP4(Number(e.target.value))} className="w-40 accent-black" />
                 </div>
            </div>

            <div className="p-3 bg-black text-white font-mono text-xs rounded flex justify-between items-center">
                <code>{bezierString}</code>
                <Copy className="w-4 h-4 cursor-pointer hover:text-gray-400" onClick={() => navigator.clipboard.writeText(bezierString)} />
            </div>
         </div>

         {/* Preview */}
         <div className="bg-gray-50 border border-gray-200 rounded-xl relative overflow-hidden flex flex-col justify-center px-4">
             <div className="w-full h-1 bg-gray-300 rounded mb-4 relative">
                 <motion.div 
                    key={key}
                    className="w-8 h-8 bg-accent-pink border-2 border-black rounded-full absolute -top-3.5"
                    initial={{ left: "0%" }}
                    animate={{ left: "95%" }}
                    transition={{ 
                        duration: 1.5, 
                        ease: [p1, p2, p3, p4],
                        repeat: Infinity,
                        repeatDelay: 1
                    }}
                 >
                 </motion.div>
             </div>
             <p className="text-center text-xs text-gray-500 mt-8">The ball moves according to your ease curve.</p>
             <button onClick={() => setKey(k => k + 1)} className="absolute bottom-4 right-4 p-2 bg-white border border-black rounded hover:bg-gray-100">
                <RefreshCw className="w-4 h-4" />
             </button>
         </div>
      </div>
    </div>
  );
}
