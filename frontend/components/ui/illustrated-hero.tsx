"use client";

import { motion, useSpring } from "framer-motion";
import { Layers, Palette, Code2, Globe, MousePointer2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export function IllustratedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const springX = useSpring(mousePos.x * 40, { stiffness: 100, damping: 30 });
  const springY = useSpring(mousePos.y * 40, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative w-full h-[500px] flex items-center justify-center perspective-[1000px]">
      <motion.div 
        style={{ x: springX, y: springY }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        {/* Central Design Core */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-[40px] bg-white border-2 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden z-20"
        >
          <div className="absolute inset-0 bg-gray-50 opacity-50" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-50%] border-[1px] border-dashed border-black/5 rounded-full"
          />
          <div className="relative z-10 flex flex-col items-center gap-3">
             <div className="p-4 rounded-[24px] bg-black text-white shadow-lg">
                 <Globe className="w-10 h-10" />
             </div>
             <span className="font-black text-lg tracking-tighter uppercase italic">Creative OS</span>
          </div>
        </motion.div>

        {/* Floating Typography Card */}
        <FloatingElement 
          delay={0}
          x="-90%"
          y="-30%"
          rotation={-12}
        >
            <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_#000]">
                <div className="w-12 h-12 bg-accent-yellow rounded-full mb-3 flex items-center justify-center border-2 border-black font-black text-xl">Aa</div>
                <div className="w-24 h-2 bg-gray-100 rounded-full mb-2" />
                <div className="w-16 h-2 bg-gray-100 rounded-full" />
            </div>
        </FloatingElement>

        {/* Floating Code Card */}
        <FloatingElement 
          delay={0.5}
          x="90%"
          y="40%"
          rotation={-6}
        >
            <div className="bg-black text-white p-5 rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-2 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div className="space-y-1.5 font-mono text-[10px] opacity-80">
                    <p>&lt;Design /&gt;</p>
                    <p className="pl-3">&lt;Build /&gt;</p>
                </div>
            </div>
        </FloatingElement>

        {/* Floating Color Palette */}
        <FloatingElement 
          delay={1}
          x="-60%"
          y="60%"
          rotation={8}
        >
             <div className="bg-white p-4 rounded-full border-2 border-black shadow-[6px_6px_0px_0px_#000] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-blue border-2 border-black" />
                <div className="w-8 h-8 rounded-full bg-accent-pink border-2 border-black" />
                <div className="w-8 h-8 rounded-full bg-accent-yellow border-2 border-black" />
             </div>
        </FloatingElement>

        {/* Floating Cursor/Tool */}
        <FloatingElement 
          delay={1.5}
          x="80%"
          y="-50%"
          rotation={12}
        >
            <div className="bg-accent-blue text-white p-3 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_#000] flex items-center gap-2">
                <MousePointer2 className="w-5 h-5" />
                <span className="font-bold text-sm">Select</span>
            </div>
        </FloatingElement>
      </motion.div>
    </div>
  );
}

function FloatingElement({ children, x, y, delay, rotation }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                x: x,
                y: y,
                rotate: rotation
            }}
            transition={{ duration: 1, delay: delay, type: "spring", stiffness: 100 }}
            className="absolute z-30"
        >
            <motion.div
                animate={{ y: [0, -15, 0], rotate: [rotation, rotation - 5, rotation] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay }}
                className="hover:scale-110 transition-transform duration-300"
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
