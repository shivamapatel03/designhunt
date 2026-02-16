"use client";

import { useState } from "react";
import { User, Target, Frown } from "lucide-react";

export function PersonaGenerator() {
  const [data, setData] = useState({
    name: "Alex Johnson",
    role: "Junior Designer",
    goal: "Learn UI quickly to get a job.",
    frustration: "Overwhelmed by too many tools and complex theories."
  });

  const handleChange = (key: string, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000]">
      <h3 className="text-2xl font-bold mb-6">Persona Generator</h3>
      
      <div className="grid md:grid-cols-2 gap-8">
         {/* Form */}
         <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Name</label>
                <input 
                    type="text" 
                    value={data.name} 
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Role / Job</label>
                <input 
                    type="text" 
                    value={data.role} 
                    onChange={e => handleChange('role', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Primary Goal</label>
                <textarea 
                    value={data.goal} 
                    onChange={e => handleChange('goal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none h-20 resize-none"
                />
             </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Key Frustration</label>
                <textarea 
                    value={data.frustration} 
                    onChange={e => handleChange('frustration', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none h-20 resize-none"
                />
             </div>
         </div>

         {/* Preview Card */}
         <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="relative z-10 w-full">
                <div className="w-24 h-24 bg-accent-blue rounded-full mx-auto mb-4 border-4 border-white shadow-md flex items-center justify-center text-white text-3xl font-bold">
                    {data.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold">{data.name}</h2>
                <p className="text-gray-500 font-medium mb-8">{data.role}</p>
                
                <div className="text-left space-y-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex gap-3">
                        <Target className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div>
                            <span className="font-bold block text-xs uppercase text-gray-400">Goal</span>
                            <span className="text-sm">{data.goal}</span>
                        </div>
                    </div>
                     <div className="flex gap-3">
                        <Frown className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div>
                            <span className="font-bold block text-xs uppercase text-gray-400">Frustration</span>
                            <span className="text-sm">{data.frustration}</span>
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Decor */}
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-100 to-transparent"></div>
         </div>
      </div>
    </div>
  );
}
