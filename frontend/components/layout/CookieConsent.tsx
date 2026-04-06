"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay showing the popup for a better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[100]"
        >
          <div className="bg-white border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-6 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCF0D]/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="relative flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFCF0D] rounded-xl flex items-center justify-center shadow-sm">
                    <Cookie className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black font-inter tracking-tight">Cookie Consent</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest font-inter">Privacy Policy</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed font-inter font-medium">
                We use cookies to improve your experience, analyze traffic, and show you personalized content. 
                Manage your preferences or accept all cookies.
              </p>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition-all active:scale-95 shadow-sm font-inter"
                >
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 py-3 border border-black/10 text-black rounded-xl text-sm font-bold hover:bg-black/5 transition-all active:scale-95 font-inter"
                >
                  Decline
                </button>
              </div>

              <div className="flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold font-inter">Your data is secure with us</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
