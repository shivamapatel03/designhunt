"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function RotatingEntranceImage({ 
  src, 
  alt, 
  className, 
  delay = 0,
  initialRotate = -180,
  finalRotate = 0
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  delay?: number;
  initialRotate?: number;
  finalRotate?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: initialRotate }}
      animate={{ opacity: 1, scale: 1, rotate: finalRotate }}
      transition={{
        duration: 1.2,
        ease: "easeOut",
        delay,
      }}
      className={cn("absolute", className)}
    >
      <Image 
         src={src} 
         alt={alt} 
         width={384} 
         height={384} 
         className="w-full h-auto object-contain transition-transform" 
      />
    </motion.div>
  );
}

export function FloatingShapesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Left Shape - Asterisk */}
        <RotatingEntranceImage 
           src="/bg/asterisk.png" 
           alt="Asterisk Shape"
           className="top-[5%] md:top-[10%] left-2 md:left-6 lg:left-12 w-16 md:w-20 lg:w-28 opacity-90" 
           delay={0}
           initialRotate={-180}
           finalRotate={-12}
        />

        {/* Bottom Left Shape - Flower */}
        <RotatingEntranceImage 
           src="/bg/flower.png" 
           alt="Flower Shape"
           className="bottom-[5%] md:bottom-[10%] left-2 md:left-6 lg:left-12 w-12 md:w-16 lg:w-24 opacity-90" 
           delay={0.15}
           initialRotate={90}
           finalRotate={6}
        />

        {/* Top Right Shape - Polygon */}
        <RotatingEntranceImage 
           src="/bg/polygon.png" 
           alt="Polygon Shape"
           className="top-[5%] md:top-[10%] right-2 md:right-6 lg:right-12 w-16 md:w-20 lg:w-28 opacity-90" 
           delay={0.1}
           initialRotate={180}
           finalRotate={12}
        />

        {/* Bottom Right Shape - Soft Star */}
        <RotatingEntranceImage 
           src="/bg/soft-star.png" 
           alt="Soft Star Shape"
           className="bottom-[5%] md:bottom-[10%] right-2 md:right-6 lg:right-12 w-12 md:w-16 lg:w-24 opacity-90" 
           delay={0.25}
           initialRotate={-90}
           finalRotate={-6}
        />
    </div>
  );
}
