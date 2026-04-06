"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Type, Sliders, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const GOOGLE_FONTS = [
  { name: "Inter", category: "Sans Serif", weights: "100-900" },
  { name: "Roboto", category: "Sans Serif", weights: "100, 300, 400, 500, 700, 900" },
  { name: "Playfair Display", category: "Serif", weights: "400-900" },
  { name: "Montserrat", category: "Sans Serif", weights: "100-900" },
  { name: "Lato", category: "Sans Serif", weights: "100, 300, 400, 700, 900" },
  { name: "Oswald", category: "Sans Serif", weights: "200-700" },
  { name: "Raleway", category: "Sans Serif", weights: "100-900" },
];

const SCALES = [
    { name: "Minor Second", ratio: 1.067 },
    { name: "Major Second", ratio: 1.125 },
    { name: "Minor Third", ratio: 1.200 },
    { name: "Major Third", ratio: 1.250 },
    { name: "Perfect Fourth", ratio: 1.333 },
    { name: "Augmented Fourth", ratio: 1.414 },
    { name: "Perfect Fifth", ratio: 1.500 },
    { name: "Golden Ratio", ratio: 1.618 },
];

export default function TypographyPage() {
  const [baseSize, setBaseSize] = useState(16);
  const [scaleRatio, setScaleRatio] = useState(1.250); // Major Third
  const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog.");
  const [selectedFont, setSelectedFont] = useState("Inter");

  // Calculate type scale
  const steps = [-2, -1, 0, 1, 2, 3, 4, 5];
  const scaleValues = steps.map(step => ({
      step,
      size: (baseSize * Math.pow(scaleRatio, step)).toFixed(1),
      rem: (baseSize * Math.pow(scaleRatio, step) / 16).toFixed(3)
  })).reverse();

  return (
    <div className="min-h-screen bg-white pt-14 md:pt-16 pb-12">
      <div className="container mx-auto px-4 md:px-4 max-w-6xl">
        
        {/* Header */}
         <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
            <Link href="/library" className="hover:text-black">Library</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">Typography</span>
        </div>

        <h1 className="text-5xl font-clash font-black mb-6">Typography System</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Interactive type scale calculator and font previewer. Experiment with different ratios to find your perfect rhythm.
        </p>

        <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Controls */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-gray-50 border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000]">
                    <div className="flex items-center gap-2 mb-6 text-lg font-black uppercase">
                        <Sliders className="w-5 h-5" /> Settings
                    </div>

                    {/* Font Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">Google Font</label>
                        <select 
                            value={selectedFont}
                            onChange={(e) => setSelectedFont(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:border-black focus:ring-0 font-medium"
                        >
                            {GOOGLE_FONTS.map(f => (
                                <option key={f.name} value={f.name}>{f.name} ({f.category})</option>
                            ))}
                        </select>
                    </div>

                    {/* Base Size */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">Base Size (px)</label>
                        <input 
                            type="number" 
                            value={baseSize}
                            onChange={(e) => setBaseSize(Number(e.target.value))}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:border-black focus:ring-0 font-medium"
                        />
                    </div>

                    {/* Scale Ratio */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">Scale Ratio</label>
                        <select 
                            value={scaleRatio}
                            onChange={(e) => setScaleRatio(Number(e.target.value))}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:border-black focus:ring-0 font-medium"
                        >
                            {SCALES.map(s => (
                                <option key={s.name} value={s.ratio}>{s.name} ({s.ratio})</option>
                            ))}
                        </select>
                    </div>

                     {/* Preview Text */}
                     <div>
                        <label className="block text-sm font-bold mb-2">Preview Text</label>
                        <textarea 
                            value={previewText}
                            onChange={(e) => setPreviewText(e.target.value)}
                            rows={3}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:border-black focus:ring-0 font-medium text-sm"
                        />
                    </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-sm text-blue-900">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> Import in Next.js
                    </h4>
                    <p className="mb-3">To use <strong>{selectedFont}</strong> in your project:</p>
                    <div className="bg-white p-3 rounded border border-blue-100 font-mono text-xs overflow-x-auto">
                        import {"{"} {selectedFont.replace(" ", "")} {"}"} from 'next/font/google';
                    </div>
                </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-2">
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=${selectedFont.replace(" ", "+")}:wght@400;700;900&display=swap');
                `}</style>

                <div className="space-y-8" style={{ fontFamily: `"${selectedFont}", sans-serif` }}>
                    {scaleValues.map((scale, i) => (
                        <div key={scale.step} className="flex items-baseline gap-4 group">
                             {/* Metadata */}
                             <div className="w-32 flex-shrink-0 text-right opacity-30 group-hover:opacity-100 transition-opacity">
                                <div className="text-xs font-mono font-bold">{scale.size}px</div>
                                <div className="text-[10px] text-gray-500">{scale.rem}rem</div>
                            </div>
                            
                            {/* Text */}
                            <div 
                                className="flex-1 leading-tight"
                                style={{ 
                                    fontSize: `${scale.size}px`,
                                    fontWeight: scale.step > 2 ? 900 : scale.step > 0 ? 700 : 400
                                }}
                            >
                                {previewText}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
