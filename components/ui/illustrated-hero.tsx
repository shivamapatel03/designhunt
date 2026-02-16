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
    <div ref={containerRef} className="relative w-full h-[400px] flex items-center justify-center perspective-[1000px]">
      <motion.div 
        style={{ x: springX, y: springY }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        {/* Central Design Core */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-[40px] bg-white border-2 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden"
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

        {/* Orbiting Modules */}
        <FloatingCard 
          delay={0}
          x="-90%"
          y="-25%"
          icon={<Layers className="w-5 h-5" />}
          label="Layers"
          color="bg-accent-blue"
          rotation={-12}
        />

        <FloatingCard 
          delay={0.5}
          x="80%"
          y="-50%"
          icon={<Palette className="w-5 h-5" />}
          label="Harmony"
          color="bg-accent-yellow"
          rotation={12}
        />

        <FloatingCard 
          delay={1}
          x="90%"
          y="35%"
          icon={<Code2 className="w-5 h-5" />}
          label="Build"
          color="bg-accent-pink"
          rotation={-8}
        />

        <FloatingCard 
          delay={1.5}
          x="-80%"
          y="60%"
          icon={<MousePointer2 className="w-5 h-5" />}
          label="Interaction"
          color="bg-black text-white"
          rotation={8}
        />
      </motion.div>
    </div>
  );
}

function FloatingCard({ icon, label, color, x, y, delay, rotation }: any) {
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
            className="absolute z-20"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay }}
                className="group p-3 bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border-2 border-black ${color}`}>
                        {icon}
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-wider">{label}</span>
                </div>
            </motion.div>
        </motion.div>
    );
}
