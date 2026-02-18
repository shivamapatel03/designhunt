
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  duration?: number;
  borderWidth?: number;
}

export function AnimatedBorder({
  children,
  className,
  duration = 3,
  borderWidth = 2,
  ...props
}: AnimatedBorderProps) {
  return (
    <div
      className={cn("relative p-[1px] overflow-hidden rounded-xl group", className)}
      {...props}
    >
      <div
        className="absolute inset-0 h-full w-full animate-rotate-border bg-[conic-gradient(transparent_20deg,#000_120deg)]"
        style={{
          animationDuration: `${duration}s`,
          padding: borderWidth,
        }}
      />
      <div className="relative bg-white rounded-xl h-full w-full">
        {children}
      </div>
    </div>
  );
}
