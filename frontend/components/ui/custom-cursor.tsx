"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth arrow physics
  // Smooth arrow physics - tighter validation
  const cursorX = useSpring(mouseX, { damping: 30, stiffness: 700, mass: 0.5 });
  const cursorY = useSpring(mouseY, { damping: 30, stiffness: 700, mass: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);

    const target = e.target as HTMLElement;
    const isClickable = 
      target.closest('a') || 
      target.closest('button') || 
      window.getComputedStyle(target).cursor === 'pointer';
    
    setIsHovering(!!isClickable);
  }, [mouseX, mouseY]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsClicking(true);
    // Add a "magic" click point
    setClicks(prev => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }]);
    // Clean up old clicks
    setTimeout(() => {
        setClicks(prev => prev.slice(1));
    }, 800);
  }, []);

  const handleMouseUp = useCallback(() => setIsClicking(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    // Hide default cursor globally
    document.body.style.cursor = 'none';
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        (el as HTMLElement).style.cursor = 'none';
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  return (
    <>
      {/* Magic Click Particles */}
      <AnimatePresence>
        {clicks.map(click => (
          <MagicBurst key={click.id} x={click.x} y={click.y} />
        ))}
      </AnimatePresence>

      {/* Main Custom Arrow Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{ 
          x: cursorX, 
          y: cursorY, 
          translateX: '-5.5px', // Exact offset for arrow tip (5.5px in viewBox)
          translateY: '-2px'    // Exact offset for arrow tip (2px in viewBox)
        }}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.2 : 1, // Reduced hover scale slightly
            rotate: isHovering ? 0 : 0, // Removed rotation for cleaner feel
          }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }} // Snappier spring
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[1px_2px_4px_rgba(0,0,0,0.15)]" // Reduced shadow
          >
            {/* Outer Glow / Stroke for visibility */}
            <path 
              d="M5.5 2L18.5 14L11.5 15L15.5 21.5L12.5 23.5L8.5 16.5L3.5 21L5.5 2Z" 
              fill="white"
              stroke="black"
              strokeWidth="1.2" // Thinner stroke
              strokeLinejoin="round"
            />
            {/* Core Fill Layer */}
            <path 
              d="M5.5 2L18.5 14L11.5 15L15.5 21.5L12.5 23.5L8.5 16.5L3.5 21L5.5 2Z" 
              fill={isHovering ? '#FFD700' : 'black'}
              className="transition-colors duration-200"
            />
          </svg>
        </motion.div>
      </motion.div>
    </>
  );
}

function MagicBurst({ x, y }: { x: number; y: number }) {
    const particles = Array.from({ length: 8 });
    
    return (
        <div className="fixed top-0 left-0 pointer-events-none z-[9998]" style={{ left: x, top: y }}>
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                    animate={{ 
                        scale: [0, 1.5, 0],
                        opacity: 0,
                        x: Math.cos(i * 45 * (Math.PI / 180)) * 40,
                        y: Math.sin(i * 45 * (Math.PI / 180)) * 40,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ 
                        backgroundColor: i % 2 === 0 ? '#007BFF' : '#FFD700',
                        boxShadow: `0 0 10px ${i % 2 === 0 ? '#007BFF' : '#FFD700'}`
                    }}
                />
            ))}
            {/* Core Ripple */}
            <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border border-accent-blue"
            />
        </div>
    );
}
