"use client";

import { Check, Lock, ChevronRight, Award, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProgressProps {
  currentTopic: string;
  topicSlug: string;
  totalLessons: number;
  completedCount: number;
}

export function LearningProgressTracker({ currentTopic, topicSlug, totalLessons, completedCount }: ProgressProps) {
  const currentLevel = Math.min(completedCount + 1, totalLessons);
  const percentage = Math.round((completedCount / totalLessons) * 100);
  const remaining = totalLessons - completedCount;

  // Generate lesson numbers to show: 1-14 (circles), 15 (current bubble), 16-17 (text), +5 (overflow)
  const visibleLessons = [];
  
  // 1 through completedCount (Completed - Black Circle)
  for (let i = 1; i <= completedCount; i++) {
    visibleLessons.push({ id: i, status: "completed" });
  }
  
  // Current (Indigo Bubble)
  if (currentLevel <= totalLessons) {
    visibleLessons.push({ id: currentLevel, status: "current" });
  }
  
  // Next 2 (Plain Text)
  for (let i = currentLevel + 1; i <= Math.min(currentLevel + 2, totalLessons); i++) {
    visibleLessons.push({ id: i, status: "next" });
  }

  // Overflow (+X)
  const lastVisible = currentLevel + 2;
  if (lastVisible < totalLessons) {
    visibleLessons.push({ id: totalLessons - lastVisible, status: "overflow" });
  }

  return (
    <div className="bg-white p-6 rounded-[24px] border border-black/10">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-black/5">
            <span className="text-xl font-bold text-black font-serif">Aa</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-black leading-none">{currentTopic}</h3>
            <p className="text-xs font-bold text-gray-400 mt-1">{completedCount} of {totalLessons} lessons complete</p>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold",
          percentage === 100 ? "bg-indigo-50 text-indigo-600" : "bg-green-50 text-green-600"
        )}>
          {percentage === 100 ? "Mastered" : "In progress"}
        </div>
      </div>

      {/* Circle Sequence */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
        {visibleLessons.map((lesson, idx) => (
          <div key={idx} className="flex-shrink-0">
            {lesson.status === "completed" && (
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                {lesson.id}
              </div>
            )}
            {lesson.status === "current" && (
              <div className="w-10 h-10 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-xs font-bold">
                {lesson.id}
              </div>
            )}
            {lesson.status === "next" && (
              <div className="w-10 h-10 flex items-center justify-center text-xs font-bold text-black/40">
                {lesson.id}
              </div>
            )}
            {lesson.status === "overflow" && (
              <div className="w-10 h-10 flex items-center justify-center text-xs font-bold text-black/40">
                +{lesson.id}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar Layer */}
      <div className="space-y-3 mb-8">
        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#6366F1] rounded-full transition-all duration-1000" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold text-black">
          <span>{percentage}% complete</span>
          <span className="text-gray-400">{remaining} lessons remaining</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-6">
        <Link 
          href={percentage === 100 ? `/theory/learning/${topicSlug}/report` : `/theory/learning/${topicSlug}/path`} 
          className="bg-[#6366F1] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#5558e2] transition-colors"
        >
          {percentage === 100 ? "Review Journey" : `Start level ${currentLevel}`} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
