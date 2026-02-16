"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function GridGenerator() {
  const [columns, setColumns] = useState(12);
  const [rows, setRows] = useState(4);
  const [gap, setGap] = useState(16);
  const [copied, setCopied] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const presets = [
    { name: "Standard 12-Col", cols: 12, rows: 4, gap: 16 },
    { name: "Card Grid", cols: 3, rows: 3, gap: 24 },
    { name: "Sidebar Layout", cols: 4, rows: 1, gap: 0 },
    { name: "Bento Grid", cols: 4, rows: 4, gap: 12 },
  ];

  const cssCode = `.container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${gap}px;
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-2 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#000]">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
               <h3 className="text-3xl font-black">Interactive Grid Engine</h3>
               <p className="text-gray-500 font-medium">Visualize structure before you code.</p>
           </div>
           
           <div className="flex flex-wrap gap-2">
               {presets.map(p => (
                   <button
                        key={p.name}
                        onClick={() => { setColumns(p.cols); setRows(p.rows); setGap(p.gap); }}
                        className="px-3 py-1.5 text-xs font-bold border-2 border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all"
                   >
                       {p.name}
                   </button>
               ))}
           </div>
       </div>

       <div className="grid lg:grid-cols-[300px_1fr] gap-8 mb-8">
          {/* Controls */}
          <div className="space-y-6 bg-gray-50 p-6 rounded-xl border-2 border-gray-100">
              <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold">Columns</label>
                    <span className="text-sm font-mono bg-black text-white px-2 rounded">{columns}</span>
                </div>
                <input 
                    type="range" min="1" max="16" 
                    value={columns} 
                    onChange={(e) => setColumns(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold">Rows</label>
                    <span className="text-sm font-mono bg-black text-white px-2 rounded">{rows}</span>
                </div>
                <input 
                    type="range" min="1" max="12" 
                    value={rows} 
                    onChange={(e) => setRows(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold">Gap (px)</label>
                    <span className="text-sm font-mono bg-black text-white px-2 rounded">{gap}px</span>
                </div>
                 <input 
                    type="range" min="0" max="64" 
                    value={gap} 
                    onChange={(e) => setGap(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showOverlay} 
                        onChange={(e) => setShowOverlay(e.target.checked)}
                        className="w-4 h-4 accent-black rounded"
                      />
                      <span className="text-sm font-bold">Show Column Overlay</span>
                  </label>
              </div>
          </div>

          {/* Visual Preview */}
          <div className="relative bg-white border-2 border-dashed border-gray-300 rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center p-4">
               {/* The actual grid */}
               <div 
                 className="w-full h-full absolute inset-4 transition-all duration-300"
                 style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    gap: `${gap}px`
                 }}
               >
                  {Array.from({ length: columns * rows }).map((_, i) => (
                     <div 
                        key={i} 
                        className={`
                            rounded relative transition-all duration-300
                            ${showOverlay ? 'bg-accent-blue/10 border border-accent-blue/30' : 'bg-gray-100 border border-gray-200'}
                        `}
                     >
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-gray-400 opacity-50">
                            {i + 1}
                        </div>
                     </div>
                  ))}
               </div>
          </div>
       </div>

        {/* Code Output */}
        <div className="flex items-center justify-between bg-[#1e1e1e] text-gray-300 p-1 rounded-xl pl-4">
            <code className="font-mono text-xs md:text-sm truncate">
                {`grid-cols-${columns} gap-[${gap}px]`}
            </code>
            <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-bold text-xs hover:bg-gray-100 transition-colors"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy CSS"}
            </button>
        </div>
    </div>
  );
}
