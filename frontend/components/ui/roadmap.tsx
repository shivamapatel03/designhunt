"use client";

import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  duration?: string;
}

interface RoadmapProps {
  steps: RoadmapStep[];
}

export function Roadmap({ steps }: RoadmapProps) {
  return (
    <div className="relative py-8">
      {/* Vertical Line */}
      <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gray-200" />

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex gap-8 items-start group">
            {/* Icon/Indicator */}
            <div className={cn(
              "z-10 w-14 h-14 rounded-full border-4 flex items-center justify-center shrink-0 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]",
              step.status === 'completed' 
                ? "bg-accent-green-500 border-black bg-[#22c55e]" 
                : step.status === 'current' 
                  ? "bg-accent-blue border-black animate-pulse" 
                  : "bg-gray-100 border-gray-300"
            )}>
              {step.status === 'completed' && <Check className="w-6 h-6 text-white text-black" />}
              {step.status === 'current' && <Play className="w-6 h-6 text-white fill-current" />}
              {step.status === 'locked' && <Lock className="w-6 h-6 text-gray-400" />}
            </div>

            {/* Content Card */}
            <div className={cn(
              "flex-1 p-6 rounded-xl border-2 transition-all",
              step.status === 'current' ? "border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-200 bg-gray-50",
              step.status === 'completed' ? "border-black bg-[#f0fdf4]" : ""
            )}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={cn("text-xl font-bold", step.status === 'locked' ? "text-gray-500" : "text-black")}>
                  {step.title}
                </h3>
                {step.duration && (
                  <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">
                    {step.duration}
                  </span>
                )}
              </div>
              <p className={cn("text-sm", step.status === 'locked' ? "text-gray-400" : "text-gray-600")}>
                {step.description}
              </p>
              
              {step.status === 'current' && (
                <button className="mt-4 px-6 py-2 bg-accent-blue text-white font-bold rounded-lg border-2 border-black hover:bg-blue-600 transition-colors">
                  Continue Learning
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
