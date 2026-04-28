"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Award, 
  ArrowLeft, 
  Download,
  Target,
  Zap,
  Clock
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ReportData {
    topic_title: string;
    accuracy: number;
    total_xp: number;
    time_spent_mins: number;
    levels: {
        level_number: number;
        difficulty: string;
        status: 'COMPLETED' | 'IN_PROGRESS';
    }[];
}

export default function MasteryReportPage() {
  const { topic } = useParams();
  const router = useRouter();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [topic]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/learning/topic/${topic}/report`, { credentials: 'include' });
      if (!res.ok) throw new Error("Failed to fetch report");
      const report = await res.json();
      setData(report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full"/>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-20 font-[family-name:var(--font-plus-jakarta)]">
      <div className="max-w-2xl mx-auto px-6 space-y-8">
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to profile
        </button>

        {/* Header Card */}
        <div className="bg-white p-8 rounded-[32px] border border-black/5 text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-indigo-100 shadow-sm">
             <Target className="w-10 h-10 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-black">{data.topic_title} Completed</h1>
            <p className="text-sm font-medium text-gray-500 mt-2">You've successfully completed all levels in this path.</p>
          </div>
          <div className="pt-2">
             <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">The Architect</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
           <div className="bg-white p-6 rounded-[24px] border border-black/5 flex flex-col items-center gap-2">
              <div className="p-2 bg-green-50 rounded-xl">
                 <Target className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-2xl font-black text-black">{data.accuracy}%</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Accuracy</p>
           </div>
           
           <div className="bg-white p-6 rounded-[24px] border border-black/5 flex flex-col items-center gap-2">
              <div className="p-2 bg-amber-50 rounded-xl">
                 <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-black">{data.total_xp}</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">XP Earned</p>
           </div>

           <div className="bg-white p-6 rounded-[24px] border border-black/5 flex flex-col items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-xl">
                 <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-black text-black">{data.time_spent_mins}m</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Time Spent</p>
           </div>
        </div>

        {/* Level Breakdown Card */}
        <div className="bg-white p-8 rounded-[32px] border border-black/5 space-y-6">
           <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <h3 className="text-sm font-bold text-black tracking-tight uppercase tracking-widest">Level Performance</h3>
              <span className="text-[10px] font-bold text-gray-400">25 of 25 complete</span>
           </div>
           
           <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
              {data.levels.map((lvl) => (
                <div key={lvl.level_number} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-gray-100/50 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                        {lvl.level_number}
                      </div>
                      <span className="text-xs font-bold text-black">Level {lvl.level_number}</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{lvl.difficulty}</span>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4">
           <Link href="/profile" className="w-full bg-black text-white h-14 rounded-2xl font-bold text-sm flex items-center justify-center transition-all hover:bg-gray-800 active:scale-[0.98] shadow-lg shadow-black/10">
              Back to Dashboard
           </Link>
        </div>

      </div>
    </div>
  );
}
