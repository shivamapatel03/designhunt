"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

export function ContrastChecker() {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [ratio, setRatio] = useState(21);
  const [level, setLevel] = useState({ aa: true, aaa: true });

  // Simplified relative luminance calculation for demo purposes
  // In a real app, use a robust library like 'tinycolor2' or 'colord'
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    
    // Formula: 0.2126 * R + 0.7152 * G + 0.0722 * B (linearized)
    // Simplified for this prototype
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  };

  useEffect(() => {
    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const currentRatio = (lighter + 0.05) / (darker + 0.05);
    
    setRatio(parseFloat(currentRatio.toFixed(2)));
    setLevel({
        aa: currentRatio >= 4.5,
        aaa: currentRatio >= 7.0
    });
  }, [fg, bg]);

  return (
    <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000]">
      <h3 className="text-2xl font-bold mb-6">Interactive Contrast Checker</h3>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
         <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold mb-2">Foreground Color</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={fg} 
                        onChange={(e) => setFg(e.target.value)}
                        className="w-12 h-12 rounded cursor-pointer border-2 border-gray-200"
                    />
                    <input 
                        type="text" 
                        value={fg} 
                        onChange={(e) => setFg(e.target.value)}
                        className="border-2 border-gray-200 p-2 font-mono uppercase w-32 focus:border-black outline-none"
                    />
                </div>
            </div>
             <div>
                <label className="block text-sm font-bold mb-2">Background Color</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={bg} 
                        onChange={(e) => setBg(e.target.value)}
                        className="w-12 h-12 rounded cursor-pointer border-2 border-gray-200"
                    />
                    <input 
                        type="text" 
                        value={bg} 
                        onChange={(e) => setBg(e.target.value)}
                        className="border-2 border-gray-200 p-2 font-mono uppercase w-32 focus:border-black outline-none"
                    />
                </div>
            </div>
         </div>

         {/* Preview */}
         <div 
            className="rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center p-8 text-center transition-colors"
            style={{ backgroundColor: bg, color: fg }}
         >
            <h4 className="text-3xl font-extrabold mb-2">Large Text</h4>
            <p className="font-medium">Normal text sample for reading.</p>
         </div>
      </div>

      {/* Results */}
      <div className="bg-gray-100 p-4 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
         <div className="text-center lg:text-left shrink-0">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contrast Ratio</span>
            <div className="text-4xl sm:text-5xl font-black leading-none mt-1">{ratio}:1</div>
         </div>

         <div className="flex flex-col w-full lg:w-auto gap-3">
             <div className={`p-4 rounded-xl flex items-center justify-center sm:justify-start gap-3 border-2 flex-1 ${level.aa ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'}`}>
                {level.aa ? <Check className="w-5 h-5 shrink-0" /> : <X className="w-5 h-5 shrink-0" />}
                <div>
                    <div className="font-bold text-sm">WCAG AA</div>
                    <div className="text-[10px] uppercase font-bold opacity-70">Pass</div>
                </div>
             </div>
              <div className={`p-4 rounded-xl flex items-center justify-center sm:justify-start gap-3 border-2 flex-1 ${level.aaa ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'}`}>
                {level.aaa ? <Check className="w-5 h-5 shrink-0" /> : <X className="w-5 h-5 shrink-0" />}
                 <div>
                    <div className="font-bold text-sm">WCAG AAA</div>
                    <div className="text-[10px] uppercase font-bold opacity-70">Pass</div>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
}
