"use client";

import { useState } from "react";
import { Search, Menu, User, Bell } from "lucide-react";

export function AtomicAssembler() {
  // ATOMS STATE
  const [primaryColor, setPrimaryColor] = useState("#000000"); // Black by default
  const [borderRadius, setBorderRadius] = useState("8px");
  const [font, setFont] = useState("sans-serif");

  // Visual Styles based on state
  const buttonStyle = {
    backgroundColor: primaryColor,
    borderRadius: borderRadius,
    fontFamily: font,
    color: "#ffffff"
  };

  const inputStyle = {
    borderRadius: borderRadius,
    fontFamily: font,
    borderColor: "#e5e7eb" // gray-200
  };

  return (
    <div className="space-y-12">
      
      {/* LEVEL 1: ATOMS (The Controls) */}
      <div className="bg-white border-2 border-black rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
        <span className="absolute top-0 right-0 bg-accent-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg">LEVEL 1: ATOMS</span>
        <h3 className="text-2xl font-bold mb-6">Define Your Atoms</h3>
        <p className="mb-6 text-gray-600">Change the core properties. These are your building blocks.</p>

        <div className="grid md:grid-cols-3 gap-8">
            <div>
                <label className="block text-sm font-bold mb-2">Primary Color</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <span className="font-mono text-xs">{primaryColor}</span>
                </div>
            </div>

            <div>
                 <label className="block text-sm font-bold mb-2">Border Radius</label>
                 <select 
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                 >
                    <option value="0px">0px (Sharp)</option>
                    <option value="8px">8px (Rounded)</option>
                    <option value="24px">24px (Pill)</option>
                 </select>
            </div>

             <div>
                 <label className="block text-sm font-bold mb-2">Typography</label>
                 <select 
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                 >
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                 </select>
            </div>
        </div>

        {/* Atom Preview */}
        <div className="mt-8 p-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4 text-center sm:text-left">
            <button style={buttonStyle} className="w-full sm:w-auto px-6 py-2 font-bold transition-all">Button Atom</button>
            <input style={inputStyle} type="text" placeholder="Input Atom" className="w-full sm:w-48 px-4 py-2 border-2 outline-none" />
        </div>
      </div>

      {/* LEVEL 2: MOLECULES (Combinations) */}
      <div className="bg-white border-2 border-black rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
        <span className="absolute top-0 right-0 bg-accent-yellow text-black text-xs font-bold px-3 py-1 rounded-bl-lg">LEVEL 2: MOLECULES</span>
        <h3 className="text-2xl font-bold mb-2">Build Molecules</h3>
        <p className="mb-6 text-gray-600">Atoms combined together. Notice how your Atom changes above affect this Search Bar.</p>

        <div className="p-2 sm:p-8 bg-gray-100 rounded-xl flex justify-center">
            <div className="flex w-full max-w-md">
                 <input 
                    style={inputStyle} 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full flex-1 px-4 py-3 border-2 border-r-0 outline-none min-w-0" 
                 />
                 <button 
                    style={{
                        ...buttonStyle,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                    }} 
                    className="px-6 py-3 font-bold border-2 border-transparent"
                 >
                    <Search className="w-5 h-5" />
                 </button>
            </div>
        </div>
      </div>

      {/* LEVEL 3: ORGANISMS (Complex UI) */}
      <div className="bg-white border-2 border-black rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
        <span className="absolute top-0 right-0 bg-accent-pink text-white text-xs font-bold px-3 py-1 rounded-bl-lg">LEVEL 3: ORGANISMS</span>
        <h3 className="text-2xl font-bold mb-2">Compose Organisms</h3>
        <p className="mb-6 text-gray-600">Molecules combined into a layout. This Header component inherits all your system rules.</p>

        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* The Header Organism */}
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div style={{ backgroundColor: primaryColor }} className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">DS</div>
                    <span style={{ fontFamily: font }} className="font-bold text-lg">System</span>
                </div>

                <div className="hidden md:flex flex-1 max-w-sm mx-8">
                     <div className="flex w-full">
                        <input 
                            style={{ ...inputStyle, fontSize: '14px' }} 
                            type="text" 
                            placeholder="Find anything..." 
                            className="flex-1 px-3 py-2 border border-gray-300 outline-none" 
                        />
                         <button 
                            style={{
                                ...buttonStyle,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                padding: '8px 16px'
                            }} 
                         >
                            <Search className="w-4 h-4" />
                         </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <button style={buttonStyle} className="px-4 py-2 text-sm font-bold shadow-sm">Sign In</button>
                </div>
            </header>

            {/* Mock Hero Content */}
            <div className="bg-gray-50 p-6 md:p-12 text-center">
                <h1 style={{ fontFamily: font, color: primaryColor }} className="text-2xl md:text-4xl font-black mb-4">Welcome to Logic</h1>
                <p className="text-sm text-gray-500 mb-8 max-w-lg mx-auto">This entire page is styled dynamically by the atoms you defined in Level 1. That is the power of a Design System.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <button style={buttonStyle} className="px-8 py-3 font-bold shadow-md">Get Started</button>
                     <button style={{ 
                         ...buttonStyle, 
                         backgroundColor: 'transparent', 
                         color: primaryColor, 
                         border: `2px solid ${primaryColor}` 
                     }} className="px-8 py-3 font-bold">
                        Learn More
                     </button>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}
