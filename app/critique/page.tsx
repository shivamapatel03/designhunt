"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Zap, 
  Sparkles,
  RefreshCcw,
  X,
  Type,
  Palette,
  Layout,
  MousePointer2,
  AlertCircle
} from "lucide-react";
import { WireframeGenerator } from "@/components/critique/WireframeGenerator";

interface FeedbackData {
  score: number;
  summary: string;
  criteria: {
    name: string;
    status: string;
    score: number;
    comment: string;
  }[];
}

export default function CritiquePage() {
  const [mode, setMode] = useState<'critique' | 'wireframe'>('critique');
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeAnalysisText, setActiveAnalysisText] = useState("");

  const analysisPhases = [
    "Analyzing Visual Hierarchy...",
    "Measuring Contrast Ratios...",
    "Calculating Grid Alignment...",
    "Detecting Typographic Scale...",
    "Evaluating Visual Balance..."
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => setImage(f.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setFeedback(null);

    // Simulated scanning sequence
    const duration = 4000;
    const interval = 50;
    const steps = duration / interval;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(r => setTimeout(r, interval));
      const progress = (i / steps) * 100;
      setScanProgress(progress);
      
      const textIndex = Math.min(
        Math.floor((progress / 100) * analysisPhases.length),
        analysisPhases.length - 1
      );
      setActiveAnalysisText(analysisPhases[textIndex]);
    }

    try {
      const res = await fetch("/api/challenges/feedback", { method: "POST" });
      const data = await res.json();
      setFeedback(data);
    } catch (error) {
      console.error("Critique failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-32 md:pt-40 pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-black uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3 h-3" /> Powered by AI Design Agent
          </motion.div>
          <h1 className="text-6xl font-black uppercase tracking-tighter italic mb-4">Critique Lab</h1>
          
           {/* Mode Toggle */}
           <div className="flex justify-center mb-8">
              <div className="p-1 bg-gray-100 rounded-full inline-flex border border-gray-200">
                  <button 
                    onClick={() => setMode('critique')}
                    className={`px-6 py-2 rounded-full text-sm font-black uppercase tracking-wider transition-all ${mode === 'critique' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
                  >
                      Critique
                  </button>
                  <button 
                    onClick={() => setMode('wireframe')}
                    className={`px-6 py-2 rounded-full text-sm font-black uppercase tracking-wider transition-all ${mode === 'wireframe' ? 'bg-accent-yellow text-black shadow-lg' : 'text-gray-400 hover:text-black'}`}
                  >
                      Wireframe Spark
                  </button>
              </div>
          </div>

          <p className="text-xl text-gray-400 font-bold uppercase tracking-tight">
            {mode === 'critique' ? "Upload your work for an instant professional teardown." : "Generate high-fidelity layouts from text prompts."}
          </p>
        </div>

        {mode === 'wireframe' ? (
             <WireframeGenerator />
        ) : (
             <>
                {!feedback && !isScanning ? (
                /* Upload State */
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-accent-yellow to-accent-pink rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white border-2 border-black rounded-[40px] p-12 md:p-20 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        {image ? (
                        <div className="space-y-8">
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-black">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => setImage(null)}
                                    className="absolute top-4 right-4 p-2 bg-black text-white rounded-full hover:scale-110 transition-transform"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <button 
                                onClick={startAnalysis}
                                className="w-full py-6 bg-black text-white font-black text-xl rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
                            >
                                START AI SCAN <Zap className="w-6 h-6 fill-accent-yellow text-accent-yellow" />
                            </button>
                        </div>
                        ) : (
                        <label className="cursor-pointer block">
                            <Upload className="w-20 h-20 mx-auto mb-6 text-gray-200 group-hover:text-accent-blue transition-colors" />
                            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Drag your design here</h3>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-8">PNG, JPG or WebP (Max 10MB)</p>
                            <div className="inline-block py-4 px-8 border-2 border-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all rounded-xl">
                                SELECT FILE
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                        </label>
                        )}
                    </div>
                    </div>
                </motion.div>
                ) : isScanning ? (
                /* Scanning State */
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative w-full aspect-video rounded-[32px] overflow-hidden border-4 border-black mb-12 bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {image && <img src={image} alt="Wait" className="w-full h-full object-cover opacity-30 grayscale" />}
                        
                        {/* Scanner Laser */}
                        <motion.div 
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-accent-blue shadow-[0_0_20px_2px_#007bff] z-10"
                        />
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-4xl font-black italic mb-2">{Math.round(scanProgress)}%</div>
                            <div className="text-sm font-black uppercase tracking-widest text-accent-blue flex items-center gap-2">
                                <RefreshCcw className="w-4 h-4 animate-spin" /> {activeAnalysisText}
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                /* Results State */
                <AnimatePresence>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid lg:grid-cols-3 gap-8"
                    >
                        {/* Score Card */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="p-12 bg-black text-white rounded-[40px] text-center shadow-[12px_12px_0px_0px_rgba(255,215,0,0.5)]">
                                <div className="text-xs font-black uppercase tracking-widest text-accent-yellow mb-2">Overall Design Score</div>
                                <div className="text-8xl font-black italic tracking-tighter mb-4">{feedback?.score}</div>
                                <p className="text-sm font-bold text-gray-400 uppercase leading-relaxed">{feedback?.summary}</p>
                            </div>
                            
                            <button 
                                onClick={() => { setFeedback(null); setImage(null); }}
                                className="w-full py-5 border-2 border-black font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                NEW SCAN <RefreshCcw className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Metrics Grid */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                {feedback?.criteria.map((item, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-6 bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-50 rounded-lg border border-black flex items-center justify-center">
                                                    {getCriteriaIcon(item.name)}
                                                </div>
                                                <h4 className="font-black uppercase text-sm">{item.name}</h4>
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${item.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {item.status}
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.score}%` }}
                                                className={`h-full ${item.score > 80 ? 'bg-black' : 'bg-accent-blue'}`}
                                            />
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 leading-relaxed italic">"{item.comment}"</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                </AnimatePresence>
                )}
             </>
        )}
      </div>
    </div>
  );
}

function getCriteriaIcon(name: string) {
    switch (name) {
        case "Typography": return <Type className="w-5 h-5" />;
        case "Contrast Ratio": return <Palette className="w-5 h-5" />;
        case "Spacing & Layout": return <Layout className="w-5 h-5" />;
        case "Visual Hierarchy": return <MousePointer2 className="w-5 h-5" />;
        case "Accessibility": return <AlertCircle className="w-5 h-5" />;
        default: return <Zap className="w-5 h-5" />;
    }
}
