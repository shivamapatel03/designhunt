"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ConceptWidget({ type, data }: { type: string, data?: any }) {
  switch (type) {
    case 'kerning-slider':
      return <KerningSlider />;
    case 'color-mixer':
      return <ColorMixer />;
    default:
      return null;
  }
}

function KerningSlider() {
  const [spacing, setSpacing] = useState(0);

  return (
    <div className="bg-white p-8 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="font-bold text-lg mb-4">Interactive Kerning</h3>
      
      <div className="mb-8 flex justify-center">
        <div className="text-6xl font-black bg-gray-100 p-4 rounded-xl overflow-hidden whitespace-nowrap">
          <span style={{ marginRight: `${spacing}px` }}>A</span>
          <span>V</span>
          <span style={{ marginLeft: `${spacing}px` }}>A</span>
        </div>
      </div>

      <label className="block text-sm font-bold mb-2">Adjust Spacing (px)</label>
      <input 
        type="range" 
        min="-20" 
        max="20" 
        value={spacing} 
        onChange={(e) => setSpacing(Number(e.target.value))}
        className="w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="mt-2 text-center font-mono text-sm">{spacing}px</div>
    </div>
  );
}

function ColorMixer() {
  const [color1, setColor1] = useState("#FF0000");
  const [color2, setColor2] = useState("#0000FF");

  return (
    <div className="bg-white p-8 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="font-bold text-lg mb-4">Color Mixing Theory</h3>
      
      <div className="flex justify-center items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-black" style={{ backgroundColor: color1 }}></div>
        <div className="text-2xl font-bold">+</div>
        <div className="w-16 h-16 rounded-full border-2 border-black" style={{ backgroundColor: color2 }}></div>
        <div className="text-2xl font-bold">=</div>
        {/* Simple additive mix simulation via gradient for visual effect */}
        <div 
          className="w-16 h-16 rounded-full border-2 border-black relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)` }} 
        >
             <div className="absolute inset-0 opacity-50 mix-blend-multiply bg-white"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-xs font-bold mb-1">Color 1</label>
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-10 border-2 border-black rounded cursor-pointer" />
        </div>
        <div>
            <label className="block text-xs font-bold mb-1">Color 2</label>
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-10 border-2 border-black rounded cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
