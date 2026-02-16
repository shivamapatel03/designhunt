"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function GridGenerator() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(20);
  const [copied, setCopied] = useState(false);

  const cssCode = `display: grid;
grid-template-columns: repeat(${columns}, 1fr);
grid-template-rows: repeat(${rows}, 1fr);
gap: ${gap}px;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
       <h3 className="text-2xl font-bold mb-6">CSS Grid Generator</h3>

       <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold mb-2">Columns: {columns}</label>
            <input 
                type="range" min="1" max="12" 
                value={columns} 
                onChange={(e) => setColumns(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Rows: {rows}</label>
            <input 
                type="range" min="1" max="12" 
                value={rows} 
                onChange={(e) => setRows(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Gap: {gap}px</label>
             <input 
                type="range" min="0" max="50" 
                value={gap} 
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
            />
          </div>
       </div>

       {/* Visual Preview */}
       <div 
         className="w-full h-64 bg-gray-100 border border-gray-200 rounded-lg mb-8 p-4 overflow-hidden"
         style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: `${gap}px`
         }}
       >
          {Array.from({ length: columns * rows }).map((_, i) => (
             <div key={i} className="bg-accent-blue/20 border border-accent-blue/50 rounded flex items-center justify-center text-xs font-mono text-accent-blue font-bold">
                {i + 1}
             </div>
          ))}
       </div>

        {/* Code Output */}
        <div className="bg-black text-gray-300 p-4 rounded-lg font-mono text-sm relative">
            <button 
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition-colors text-white"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre>{cssCode}</pre>
        </div>
    </div>
  );
}
