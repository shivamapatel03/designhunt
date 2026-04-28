"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SystemBanner() {
  const [banner, setBanner] = useState({ show: false, message: "" });
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setBanner({
            show: data.SHOW_BANNER === true,
            message: data.BANNER_MESSAGE || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings");
      }
    };

    fetchSettings();
  }, [pathname]);

  if (!banner.show || !banner.message || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative z-[100] w-full overflow-hidden"
      >
        <div className="bg-black text-white py-2.5 px-4 relative overflow-hidden">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#000,#222,#000)] bg-[length:300%_300%] animate-gradient opacity-60" />
          
          <div className="container mx-auto relative z-10 flex items-center justify-center gap-3">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-center">
              {banner.message}
            </p>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-white/40 hover:text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
