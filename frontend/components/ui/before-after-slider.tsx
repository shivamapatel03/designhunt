"use client";

import { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({ before, after, beforeLabel = "Before", afterLabel = "After" }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    // If not actively dragging via mouse state, don't update
    // But for touch, we might want to just track touchmove if we started on the handle/container?
    // Let's stick to explicit drag state.
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    
    // Calculate percentage
    const position = ((clientX - containerRect.left) / containerRect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  // Global event listeners for dragging outside container
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleMouseUp);
    }
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] overflow-hidden select-none border-2 border-black rounded-xl bg-gray-100"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Layer (Background) */}
      <div className="absolute inset-0 w-full h-full">
        {after}
         <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 text-xs font-bold rounded-full pointer-events-none z-10">
          {afterLabel}
        </div>
      </div>

      {/* Before Layer (Foreground - Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full bg-white will-change-[clip-path]"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {before}
         <div className="absolute top-4 left-4 bg-accent-pink text-white border border-black px-3 py-1 text-xs font-bold rounded-full pointer-events-none z-10">
            {beforeLabel}
         </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-black cursor-ew-resize z-20 flex items-center justify-center p-0"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-10 h-10 rounded-full bg-accent-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] flex items-center justify-center -ml-[calc(1.25rem-2px)] hover:scale-110 transition-transform">
          <MoveHorizontal className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
