"use client";

import { BookOpen, ArrowRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SkillActivityCardProps {
  title: string;
  percentage: number;
  status: "best" | "pending" | "completed";
  themeColor?: string;
  onDelete?: (title: string) => void;
}

export function SkillActivityCard({ title, percentage, status, themeColor = "#FFF8D6", onDelete }: SkillActivityCardProps) {
  const router = useRouter();
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  return (
    <div 
      onClick={() => router.push(`/theory/learning/${slug}/path`)}
      className="relative p-6 rounded-[32px] border border-black/5 border-b-4 border-black/10 flex flex-col justify-between h-[160px] cursor-pointer transition-all active:border-b-0 active:translate-y-[2px] group"
      style={{ backgroundColor: themeColor }}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-black" />
          <span className="text-xs font-bold text-black tracking-tight">{title}</span>
        </div>
        {onDelete && percentage < 100 && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(title);
            }}
            className="p-2 bg-white/50 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-black/5 border-b-2 border-b-black/10 active:border-b-0 active:translate-y-[1px] opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="space-y-3 w-full">
          <h4 className="text-4xl font-extrabold text-black tracking-tighter">{percentage}%</h4>
          <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Status Badge */}
      <div className="absolute top-4 right-4 flex gap-1 group-hover:hidden transition-opacity">
          {status === "best" && (
              <span className="bg-black text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Best</span>
          )}
          {status === "completed" && (
              <span className="bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Done</span>
          )}
          {status === "pending" && (
              <span className="bg-orange-400 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Pending</span>
          )}
      </div>
    </div>
  );
}
