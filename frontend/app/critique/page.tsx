"use client";

import { useState, useEffect } from "react";
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
  AlertCircle,
  Lock
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { loadRazorpayScript } from "@/lib/razorpay";

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

export default function CritiquePage() {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeAnalysisText, setActiveAnalysisText] = useState("");
  const [liveScore, setLiveScore] = useState(0);

  // Freemium Logic
  const [scansUsedToday, setScansUsedToday] = useState(0);
  const isProOrAdmin = user?.is_pro || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const scanBalance = (user as any)?.scan_balance || 0;
  const MAX_FREE_SCANS = 5;
  const isLocked = !isProOrAdmin && scansUsedToday >= MAX_FREE_SCANS && scanBalance <= 0;

  const handlePayment = async (amount: number) => {
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // Create Order on Backend
      const orderResponse = await fetch(`/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderResponse.json();

      if (!orderResponse.ok) throw new Error(orderData.error);

      // Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DesignHunt",
        description: "Unlock Pro Features",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify Payment
          const verifyResponse = await fetch(`/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount
            }),
          });
          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok) {
            alert("Payment successful! You are now a PRO member.");
            window.location.reload(); 
          } else {
            alert("Payment verification failed: " + verifyData.error);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error: any) {
      console.error(error);
      alert("Payment failed: " + error.message);
    }
  };

  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const usageData = JSON.parse(localStorage.getItem(`critique_usage_${user.id}`) || '{"date": "", "count": 0}');
      if (usageData.date === today) {
        setScansUsedToday(usageData.count);
      } else {
        setScansUsedToday(0);
        localStorage.setItem(`critique_usage_${user.id}`, JSON.stringify({ date: today, count: 0 }));
      }
    }
  }, [user]);

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
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Max 10MB allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (f) => setImage(f.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    if (isLocked) {
      alert("You've reached your daily limit for Free AI Critiques. Upgrade to Pro for unlimited access!");
      return;
    }
    
    // Increment Scan / Decrement Balance
    if (!isProOrAdmin && user) {
      if (scanBalance > 0) {
        // Use paid scan
        try {
          await fetch("/api/profile/decrement-scans", { method: "POST" });
        } catch (e) {
          console.error("Failed to decrement scans", e);
        }
      } else {
        // Use free daily scan
        const today = new Date().toISOString().split('T')[0];
        const newCount = scansUsedToday + 1;
        setScansUsedToday(newCount);
        localStorage.setItem(`critique_usage_${user.id}`, JSON.stringify({ date: today, count: newCount }));
      }
    }

    setIsScanning(true);
    setScanProgress(0);
    setFeedback(null);
    setLiveScore(50); 

    const duration = 4000;
    const interval = 50;
    const steps = duration / interval;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(r => setTimeout(r, interval));
      const progress = (i / steps) * 100;
      setScanProgress(progress);
      
      setLiveScore(prev => {
        const move = Math.random() * 10 - 5;
        return Math.max(10, Math.min(99, Math.round(prev + move)));
      });

      const textIndex = Math.min(
        Math.floor((progress / 100) * analysisPhases.length),
        analysisPhases.length - 1
      );
      setActiveAnalysisText(analysisPhases[textIndex]);
    }

    try {
      const res = await fetch("/api/challenges/feedback", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image })
      });
      const data = await res.json();
      setFeedback(data);
    } catch (error) {
      console.error("Critique failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-14 md:pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-black uppercase tracking-widest mb-4"
          >
            <img src="/logo/critique.png" alt="Critique Logo" className="w-3 h-3 mr-1" /> Powered by AI Design Agent
          </motion.div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-1">Critique Lab</h1>
          

          <p className="text-sm text-gray-400 font-bold uppercase tracking-tight">
            Upload your work for an instant professional teardown.
          </p>

          {user && (
             <div className="mt-6 flex justify-center">
               <div className={`px-4 py-2 border-2 rounded-xl text-sm font-black uppercase tracking-wide flex items-center gap-2 ${isProOrAdmin ? 'bg-black text-accent-yellow border-accent-yellow shadow-[4px_4px_0px_0px_rgba(255,215,0,0.2)]' : 'bg-gray-100 border-black/10 text-gray-600'}`}>
                 {isProOrAdmin && <Zap className="w-4 h-4 fill-accent-yellow animate-pulse" />}
                 {isProOrAdmin ? `Pro Active: Unlimited Access` : scanBalance > 0 ? `Credits: ${scanBalance} Scans Left` : `Free: ${MAX_FREE_SCANS - scansUsedToday} more images today`}
               </div>
             </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          {!user ? (
              /* Not Logged In State */
              <div className="max-w-3xl mx-auto text-center p-12 md:p-16 bg-white border-2 border-dashed border-gray-300 rounded-[40px]">
                <Lock className="w-16 h-16 mx-auto mb-6 text-gray-300" />
                <h2 className="text-3xl font-black uppercase mb-4">Login Required</h2>
                <p className="text-gray-500 font-bold mb-8">You need an account to use the AI Critique Lab.</p>
                <Link href="/login" className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity">
                    LOG IN NOW
                </Link>
              </div>
          ) : isLocked ? (
              /* Locked Daily Limit State with Pricing Tiers */
              <div className="max-w-2xl mx-auto text-center p-12 md:p-16 bg-white border-2 border-dashed border-gray-300 rounded-[32px]">
                <Lock className="w-12 h-12 mx-auto mb-6 text-gray-400" />
                <h2 className="text-3xl font-black uppercase mb-4 tracking-tight">Daily Limit Reached</h2>
                <p className="text-gray-500 font-bold mb-8 max-w-lg mx-auto leading-relaxed text-sm">
                  You've used up your **{MAX_FREE_SCANS} free daily critiques**. 
                  <br />
                  Please come back tomorrow or upgrade to Pro for unlimited access.
                </p>
                <Link href="/theory" className="inline-block px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                    Keep Learning Theory
                </Link>
              </div>
          ) : !feedback && !isScanning ? (
          /* Upload State */
          <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
          >
              <div className="relative bg-white border-2 border-dashed border-gray-300 rounded-[32px] p-8 md:p-16 text-center overflow-hidden">
                  {image ? (
                  <div className="space-y-8">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200">
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
                          className="w-full py-5 bg-black text-white font-black text-lg rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
                      >
                          START AI SCAN <Zap className="w-5 h-5 fill-accent-yellow text-accent-yellow" />
                      </button>
                  </div>
                  ) : (
                  <label className="cursor-pointer block">
                      <Upload className="w-16 h-16 mx-auto mb-6 text-gray-200 transition-colors" />
                      <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter">Drag your design here</h3>
                      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-10">PNG, JPG or WebP (Max 10MB)</p>
                      <div className="inline-block py-3 px-10 border border-gray-300 text-gray-400 font-black uppercase text-xs tracking-widest hover:border-black hover:text-black transition-all rounded-xl">
                          SELECT FILE
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                  </label>
                  )}
              </div>
          </motion.div>
          ) : isScanning ? (
          /* Scanning State */
          <div className="max-w-2xl mx-auto text-center">
              <div className="relative w-full aspect-video rounded-[32px] overflow-hidden border-2 border-dashed border-gray-300 mb-12 bg-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {image && <img src={image} alt="Wait" className="w-full h-full object-cover opacity-30 grayscale" />}
                  
                  {/* Scanner Laser */}
                  <motion.div 
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-accent-blue/50 z-10"
                  />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {/* Live Score Counter */}
                      <motion.div 
                          initial={{ scale: 0.9 }}
                          animate={{ scale: [0.9, 1, 0.9] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="mb-8"
                      >
                          <div className="text-7xl font-black italic tracking-tighter text-black">{liveScore}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center mt-1">AI SCORING...</div>
                      </motion.div>

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
                  className="max-w-6xl mx-auto"
              >
                  {(feedback as any)?.error ? (
                      <div className="text-center p-20 bg-white border-4 border-black rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                          <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
                          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Analysis Failed</h2>
                          <p className="text-gray-500 font-bold mb-8 max-w-md mx-auto">
                              {(feedback as any).error}. Ensure your API key has "Generative Language API" permissions enabled.
                          </p>
                          <button 
                              onClick={() => { setFeedback(null); setImage(null); }}
                              className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity"
                          >
                              TRY AGAIN
                          </button>
                      </div>
                  ) : !feedback?.score ? (
                      <div className="text-center p-20 bg-white border-4 border-black rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                          <RefreshCcw className="w-16 h-16 mx-auto mb-6 text-accent-blue animate-spin" />
                          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Processing...</h2>
                          <p className="text-gray-500 font-bold mb-8">Something went wrong with the data. Please re-upload.</p>
                          <button 
                              onClick={() => { setFeedback(null); setImage(null); }}
                              className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-opacity"
                          >
                              RE-UPLOAD DESIGN
                          </button>
                      </div>
                  ) : (
                      <div className="grid lg:grid-cols-3 gap-8">
                          {/* Score Card */}
                          <div className="lg:col-span-1 space-y-8">
                              <div className="p-12 bg-black text-white rounded-[40px] text-center shadow-[12px_12px_0px_0px_rgba(255,103,137,0.5)] border-4 border-black">
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
                                  {feedback?.criteria?.map((item, i) => (
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
                                              <div className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${item?.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                  {item?.status}
                                              </div>
                                          </div>
                                          <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                                              <motion.div 
                                                  initial={{ width: 0 }}
                                                  animate={{ width: `${item?.score || 0}%` }}
                                                  className={`h-full ${(item?.score || 0) > 80 ? 'bg-black' : 'bg-accent-blue'}`}
                                              />
                                          </div>
                                          <p className="text-xs font-bold text-gray-500 leading-relaxed italic">"{item?.comment}"</p>
                                      </motion.div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  )}
              </motion.div>
          </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
