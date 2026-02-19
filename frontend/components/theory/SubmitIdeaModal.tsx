"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, Lightbulb } from "lucide-react";
import { useState } from "react";

interface SubmitIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitIdeaModal({ isOpen, onClose }: SubmitIdeaModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "", idea: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          onClose();
          setStatus("idle");
          setFormData({ name: "", email: "", idea: "" });
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white rounded-3xl p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black z-50 overflow-hidden"
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-black uppercase">Idea Received!</h3>
                <p className="text-gray-600 font-medium">Thanks for contributing to the lab. We'll check it out.</p>
              </div>
            ) : (
                <>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-accent-yellow fill-black" />
                            Request Experiment
                        </h2>
                        <p className="text-sm font-bold text-gray-500 mt-1">Pitch a new interaction or theory module.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase mb-1 ml-1">Your Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-black rounded-xl font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            placeholder="Design Wizard"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase mb-1 ml-1">Email Address</label>
                        <input 
                            required
                            type="email" 
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-black rounded-xl font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            placeholder="wizard@design.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase mb-1 ml-1">The Idea</label>
                        <textarea 
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-black rounded-xl font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
                            placeholder="Describe the interaction or law you want to see visualized..."
                            value={formData.idea}
                            onChange={e => setFormData({...formData, idea: e.target.value})}
                        />
                    </div>

                    <button 
                        disabled={status === "submitting"}
                        type="submit" 
                        className="w-full py-4 bg-black text-white font-black uppercase tracking-widest rounded-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {status === "submitting" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                        {status === "submitting" ? "Sending..." : "Submit Idea"}
                    </button>
                    {status === "error" && <p className="text-red-500 text-xs font-bold text-center">Something went wrong. Try again.</p>}
                </form>
                </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
