"use client";

import { useState } from "react";
import { MousePointer, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InteractionLab() {
  const [config, setConfig] = useState({
    hoverScale: true,
    activePress: true,
    successState: false,
    particles: false
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = () => {
    if (status !== 'idle') return;
    
    setStatus('loading');
    setTimeout(() => {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
    }, 1000);
  };

  const toggle = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000]">
      <h3 className="text-2xl font-bold mb-6">Interaction Lab</h3>
      
      <div className="grid md:grid-cols-2 gap-8">
         {/* Controls */}
         <div className="space-y-4">
            <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-2">Configure Feedback</h4>
            
            <Toggle label="Hover Scale" checked={config.hoverScale} onChange={() => toggle('hoverScale')} />
            <Toggle label="Active Press (Squish)" checked={config.activePress} onChange={() => toggle('activePress')} />
            <Toggle label="Success Transformation" checked={config.successState} onChange={() => toggle('successState')} />
         </div>

         {/* Playground */}
         <div className="bg-gray-50 flex items-center justify-center p-8 border border-gray-200 min-h-[300px]">
             <motion.button
                onClick={handleClick}
                whileHover={config.hoverScale ? { scale: 1.05 } : {}}
                whileTap={config.activePress ? { scale: 0.95 } : {}}
                className={`
                    relative overflow-hidden px-8 py-4 font-bold text-lg shadow-lg flex items-center justify-center gap-2 min-w-[200px]
                    ${status === 'success' && config.successState ? 'bg-green-500 text-white' : 'bg-black text-white'}
                `}
             >
                 <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.span 
                            key="idle"
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                        >
                            <MousePointer className="w-5 h-5" /> Click Me
                        </motion.span>
                    )}
                    
                    {status === 'loading' && (
                         <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                         />
                    )}

                    {status === 'success' && (
                        <motion.span 
                            key="success"
                            initial={{ opacity: 0, scale: 0.5 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                             {config.successState ? <Check className="w-5 h-5" /> : "Done!"}
                             {config.successState ? "Success!" : "Done!"}
                        </motion.span>
                    )}
                 </AnimatePresence>
             </motion.button>
         </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) {
    return (
        <label className="flex items-center justify-between p-3 border border-gray-200 cursor-pointer bg-white hover:border-black transition-colors">
            <span className="font-bold text-sm">{label}</span>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-green-500' : 'bg-gray-300'}`} onClick={(e) => { e.preventDefault(); onChange(); }}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
        </label>
    )
}
