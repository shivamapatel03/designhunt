"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function ColorWheel() {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [harmony, setHarmony] = useState<"complementary" | "analogous" | "triadic">("complementary");

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const getHarmonies = () => {
    switch (harmony) {
      case "complementary":
        return [hue, (hue + 180) % 360];
      case "analogous":
        return [hue, (hue + 30) % 360, (hue - 30 + 360) % 360];
      case "triadic":
        return [hue, (hue + 120) % 360, (hue + 240) % 360];
      default:
        return [hue];
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Controls */}
        <div className="flex-1 w-full space-y-6">
            <h3 className="text-2xl font-bold">Interactive Color Wheel</h3>
            
            <div>
                <label className="block text-sm font-bold mb-2">Hue ({hue}°)</label>
                <input 
                    type="range" min="0" max="360" 
                    value={hue} onChange={(e) => setHue(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer h-3 rounded-lg appearance-none bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-2">Harmony Rule</label>
                <div className="flex gap-2">
                    {["complementary", "analogous", "triadic"].map(h => (
                        <button
                            key={h}
                            onClick={() => setHarmony(h as any)}
                            className={`px-3 py-1 text-sm font-bold rounded border-2 capitalize transition-all ${harmony === h ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-black'}`}
                        >
                            {h}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Visualizer */}
        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {getHarmonies().map((h, i) => {
                const hex = hslToHex(h, saturation, lightness);
                return (
                    <div key={i} className="flex flex-col items-center group">
                        <div 
                            className="w-full h-24 rounded-xl border-2 border-gray-200 shadow-sm transition-transform group-hover:-translate-y-1 mb-2 relative overflow-hidden"
                            style={{ backgroundColor: `hsl(${h}, ${saturation}%, ${lightness}%)` }}
                        >
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity">
                                <span className="text-white font-bold drop-shadow-md">
                                    {i === 0 ? "Primary" : "Harmony"}
                                </span>
                             </div>
                        </div>
                        <div className="font-mono text-sm font-bold uppercase">{hex}</div>
                        <div className="text-xs text-gray-500">HSL({h}, {saturation}%, {lightness}%)</div>
                    </div>
                )
            })}
        </div>

      </div>
    </div>
  );
}
