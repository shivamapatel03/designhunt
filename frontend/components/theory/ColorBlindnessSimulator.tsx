"use client";

import { useState } from "react";

export function ColorBlindnessSimulator() {
  const [activeFilter, setActiveFilter] = useState("normal");

  const filters = [
    { id: "normal", name: "Normal Vision", desc: "Standard perception of color." },
    { id: "protanopia", name: "Protanopia", desc: "Red-blind. Red appears dark or greenish." },
    { id: "deuteranopia", name: "Deuteranopia", desc: "Green-blind. Red and green are hard to distinguish." },
    { id: "tritanopia", name: "Tritanopia", desc: "Blue-blind. Blue/Green and Yellow/Red confusion." },
    { id: "achromatopsia", name: "Achromatopsia", desc: "Total color blindness. Seeing in grayscale." },
  ];

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
      <h3 className="text-2xl font-bold mb-6">Color Blindness Simulator</h3>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(filter => (
            <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                    activeFilter === filter.id 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-black border-gray-200 hover:border-black"
                }`}
            >
                {filter.name}
            </button>
        ))}
      </div>

      <div className="mb-4 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
        <strong>Effect:</strong> {filters.find(f => f.id === activeFilter)?.desc}
      </div>

      {/* Simulation Area */}
      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 h-80">
        
        {/* SVG Filters */}
        <svg className="absolute w-0 h-0">
            <defs>
                <filter id="protanopia">
                    <feColorMatrix in="SourceGraphic" type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0"/>
                </filter>
                <filter id="deuteranopia">
                     <feColorMatrix in="SourceGraphic" type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0"/>
                </filter>
                <filter id="tritanopia">
                     <feColorMatrix in="SourceGraphic" type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0"/>
                </filter>
                <filter id="achromatopsia">
                     <feColorMatrix in="SourceGraphic" type="matrix" values="0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0"/>
                </filter>
            </defs>
        </svg>

        {/* Content to Simulate */}
        <div 
            className="w-full h-full bg-white p-8 flex flex-col items-center justify-center gap-6"
            style={{ filter: activeFilter !== 'normal' ? `url(#${activeFilter})` : 'none' }}
        >
            <div className="flex flex-wrap justify-center gap-4">
                <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">Error</div>
                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">Success</div>
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">Info</div>
            </div>

            <div className="w-full max-w-md space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold">Primary Action</button>
            </div>
            
             <p className="text-center text-sm text-gray-500 mt-4">
                Ideally, you should distinguish elements not just by color, but by icon and label too.
            </p>
        </div>
      </div>
    </div>
  );
}
