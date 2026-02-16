"use client";

import { useState } from "react";

const RATIOS = {
  "Minor Second": 1.067,
  "Major Second": 1.125,
  "Minor Third": 1.2,
  "Major Third": 1.25,
  "Perfect Fourth": 1.333,
  "Augmented Fourth": 1.414,
  "Perfect Fifth": 1.5,
  "Golden Ratio": 1.618,
};

export function TypeScaleCalculator() {
  const [baseSize, setBaseSize] = useState(16);
  const [ratioName, setRatioName] = useState<keyof typeof RATIOS>("Major Third");

  const ratio = RATIOS[ratioName];
  const scale = Array.from({ length: 6 }, (_, i) => Math.round(baseSize * Math.pow(ratio, i)));

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
      <h3 className="text-2xl font-bold mb-6">Type Scale Calculator</h3>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-bold mb-2">Base Size (px)</label>
          <input 
            type="number" 
            value={baseSize}
            onChange={(e) => setBaseSize(Number(e.target.value))}
            className="w-full p-2 border-2 border-gray-200 rounded-lg font-mono focus:border-black focus:outline-none transition-colors"
          />
        </div>
        <div>
            <label className="block text-sm font-bold mb-2">Scale Ratio</label>
            <select 
                value={ratioName}
                onChange={(e) => setRatioName(e.target.value as keyof typeof RATIOS)}
                className="w-full p-2 border-2 border-gray-200 rounded-lg font-bold focus:border-black focus:outline-none transition-colors"
            >
                {Object.keys(RATIOS).map((r) => (
                    <option key={r} value={r}>{r} ({RATIOS[r as keyof typeof RATIOS]})</option>
                ))}
            </select>
        </div>
      </div>

      <div className="space-y-4">
        {scale.reverse().map((size, index) => (
            <div key={size} className="flex items-baseline gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="w-16 text-xs text-gray-400 font-mono pt-1">
                    {size}px
                    <div className="text-[10px] opacity-50">{scale.length - index === 1 ? 'Base' : `h${scale.length - index - 1}`}</div>
                </div>
                <div style={{ fontSize: `${size}px` }} className="font-bold truncate">
                    The quick brown fox jumps over the lazy dog.
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
