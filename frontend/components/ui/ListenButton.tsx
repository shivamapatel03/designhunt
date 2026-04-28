"use client";

import { Volume2, VolumeX, ChevronDown } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ListenButtonProps {
  text: string;
  className?: string;
  variant?: "minimal" | "full";
}

export const ListenButton = ({ text, className, variant = "minimal" }: ListenButtonProps) => {
  const { isSpeaking, toggle, rate, setRate } = useSpeech();
  const [showRates, setShowRates] = useState(false);

  const rates = [0.75, 1, 1.25, 1.5, 2];

  if (variant === "full") {
    return (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => toggle(text)}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border-2 border-black border-b-4",
            isSpeaking 
              ? "bg-black text-white active:border-b-2 active:translate-y-[2px]" 
              : "bg-white text-black hover:bg-gray-50 active:border-b-2 active:translate-y-[2px]",
            className
          )}
        >
          {isSpeaking ? (
            <>Stop <VolumeX className="w-4 h-4" /></>
          ) : (
            <>Listen <Volume2 className="w-4 h-4" /></>
          )}
        </button>

        {/* Rate Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowRates(!showRates)}
            className="px-3 py-3 rounded-2xl border-2 border-black border-b-4 bg-white text-[10px] font-black hover:bg-gray-50 transition-all active:border-b-2 active:translate-y-[2px] flex items-center gap-1"
          >
            {rate}x <ChevronDown className={cn("w-3 h-3 transition-transform", showRates && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showRates && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full mt-2 right-0 bg-white border-2 border-black rounded-xl p-1 z-50 min-w-[60px] shadow-lg"
              >
                {rates.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setRate(r);
                      setShowRates(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-gray-100 transition-colors",
                      rate === r ? "bg-black text-white" : "text-black"
                    )}
                  >
                    {r}x
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => toggle(text)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black border-b-4 bg-white font-black text-[10px] transition-all active:border-b-2 active:translate-y-[1px] active:scale-95",
          isSpeaking ? "text-indigo-600" : "text-black hover:text-indigo-600",
          className
        )}
      >
        <span className="hidden sm:inline">{isSpeaking ? "Stop" : "Listen"}</span> 
        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* Mini Rate Toggle */}
      <button 
        onClick={() => {
          const nextIdx = (rates.indexOf(rate) + 1) % rates.length;
          setRate(rates[nextIdx]);
        }}
        className="text-[9px] font-black text-gray-400 hover:text-black transition-colors w-6"
      >
        {rate}x
      </button>
    </div>
  );
};
