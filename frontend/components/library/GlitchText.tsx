
"use client";

import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className }: GlitchTextProps) {
  return (
    <div className={cn("relative inline-block font-black uppercase tracking-widest group", className)}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-accent-blue opacity-0 group-hover:opacity-70 group-hover:animate-glitch-1">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-accent-pink opacity-0 group-hover:opacity-70 group-hover:animate-glitch-2">
        {text}
      </span>
    </div>
  );
}
