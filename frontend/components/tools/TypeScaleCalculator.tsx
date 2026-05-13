"use client";

import { useState } from "react";
import { Copy, Check, Type, RefreshCcw } from "lucide-react";

const RATIOS = [
  { name: "Minor Second", value: 1.067 },
  { name: "Major Second", value: 1.125 },
  { name: "Minor Third", value: 1.200 },
  { name: "Major Third", value: 1.250 },
  { name: "Perfect Fourth", value: 1.333 },
  { name: "Augmented Fourth", value: 1.414 },
  { name: "Perfect Fifth", value: 1.500 },
  { name: "Golden Ratio", value: 1.618 },
];

const FONTS = [
  { name: "Inter (Sans)", value: "font-sans" },
  { name: "Merriweather (Serif)", value: "font-serif" },
  { name: "JetBrains Mono (Mono)", value: "font-mono" },
];

export function TypeScaleCalculator() {
  const [baseSize, setBaseSize] = useState(16);
  const [ratio, setRatio] = useState(1.250);
  const [font, setFont] = useState("font-sans");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"visual" | "list">("visual");

  const generateSteps = () => {
    const steps = [];
    for (let i = 5; i >= -2; i--) { // h1 to caption
      steps.push({
        label: i >= 1 ? `h${i}` : i === 0 ? 'body' : i === -1 ? 'small' : 'caption',
        size: Math.round(baseSize * Math.pow(ratio, i)),
        rem: (baseSize * Math.pow(ratio, i) / 16).toFixed(3)
      });
    }
    return steps;
  };

  const steps = generateSteps();

  const cssOutput = `:root {
  --font-base: ${baseSize}px;
  --type-scale: ${ratio};
  
${steps.map(s => `  --text-${s.label}: ${s.rem}rem; /* ${s.size}px */`).join('\n')}
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white border-2 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] ${font}`}>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
           <div>
               <h3 className="text-2xl md:text-3xl font-black flex items-center gap-3">
                 <Type className="w-6 h-6 md:w-8 md:h-8" /> Type Scale Engine
               </h3>
               <p className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Generate harmonious typography systems.</p>
           </div>
           
           <div className="flex gap-2">
               <button 
                  onClick={() => setMode("visual")}
                  className={`px-4 py-2 font-bold  border-2 transition-all ${mode === 'visual' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
               >
                 Visual
               </button>
               <button 
                  onClick={() => setMode("list")}
                  className={`px-4 py-2 font-bold  border-2 transition-all ${mode === 'list' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
               >
                 Measurements
               </button>
           </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 border-2 border-gray-100">
        <div>
           <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Base Size</label>
           <div className="flex items-center gap-4">
              <input 
                type="range" min="12" max="24" 
                value={baseSize} onChange={(e) => setBaseSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200  appearance-none cursor-pointer accent-black"
              />
              <span className="font-mono font-bold w-12 text-right">{baseSize}px</span>
           </div>
        </div>

        <div>
           <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Scale Ratio</label>
           <select 
             value={ratio} onChange={(e) => setRatio(Number(e.target.value))}
             className="w-full p-2 bg-white border-2 border-gray-200  font-bold focus:border-black outline-none"
           >
             {RATIOS.map(r => (
               <option key={r.name} value={r.value}>{r.name} ({r.value})</option>
             ))}
           </select>
        </div>

        <div>
           <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Font Family</label>
           <select 
             value={font} onChange={(e) => setFont(e.target.value)}
             className="w-full p-2 bg-white border-2 border-gray-200  font-bold focus:border-black outline-none"
           >
             {FONTS.map(f => (
               <option key={f.name} value={f.value}>{f.name}</option>
             ))}
           </select>
        </div>
      </div>

      {/* Preview Area */}
      <div className="border-2 border-black overflow-hidden mb-8">
        <div className="bg-white p-5 md:p-12 min-h-[300px] md:min-h-[400px]">
          {mode === 'visual' ? (
             <article className="max-w-2xl mx-auto space-y-6 break-words">
                <h1 style={{ fontSize: `${Math.min(steps.find(s => s.label === 'h1')?.size || 48, 64)}px`, lineHeight: 1.1 }} className="font-black break-words leading-tight">
                   The Visual Hierarchy of Design
                </h1>
                <p style={{ fontSize: `${steps.find(s => s.label === 'h4')?.size}px`, color: '#666' }} className="font-medium">
                   Understanding scale is the first step to mastering typography.
                </p>
                
                <hr className="border-gray-100 my-8" />
                
                <h2 style={{ fontSize: `${steps.find(s => s.label === 'h2')?.size}px`, lineHeight: 1.2 }} className="font-bold">
                   Why Scale Matters?
                </h2>
                <p style={{ fontSize: `${steps.find(s => s.label === 'body')?.size}px`, lineHeight: 1.6 }} className="text-gray-700">
                   Typography is not just about choosing a font; it's about establishing a relationship between elements. A modular scale ensures that all your font sizes relate to each other in a mathematical and harmonious way.
                </p>

                <h3 style={{ fontSize: `${steps.find(s => s.label === 'h3')?.size}px`, lineHeight: 1.3 }} className="font-bold mt-8">
                   Mathematical Harmony
                </h3>
                <p style={{ fontSize: `${steps.find(s => s.label === 'body')?.size}px`, lineHeight: 1.6 }} className="text-gray-700">
                   Just as music is built on intervals, typography is built on ratios. 
                </p>
                <p style={{ fontSize: `${steps.find(s => s.label === 'small')?.size}px` }} className="text-gray-500 mt-4 italic">
                   Fig. 1: An example of {RATIOS.find(r => r.value === ratio)?.name} scale.
                </p>
             </article>
          ) : (
            <div className="space-y-4">
               {steps.map((step) => (
                  <div key={step.label} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 border-b border-gray-100 pb-4">
                     <div className="w-full sm:w-24 shrink-0">
                        <div className="font-black uppercase text-gray-400 text-[9px] tracking-widest mb-0.5">{step.label}</div>
                        <div className="font-mono text-[10px] text-accent-blue font-bold">{step.size}px / {step.rem}rem</div>
                     </div>
                     <div style={{ fontSize: `${step.size}px` }} className="font-bold truncate leading-tight">
                        The quick brown fox
                     </div>
                  </div>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* Code Export */}
      <div className="bg-[#1e1e1e] text-gray-300 p-4 font-mono text-sm relative group">
            <button 
                 onClick={copyToClipboard}
                 className="absolute top-4 right-4 flex items-center gap-2 bg-white text-black px-4 py-2 font-bold text-xs hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
             >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy CSS"}
          </button>
          <pre className="overflow-x-auto max-h-40">{cssOutput}</pre>
      </div>

    </div>
  );
}
