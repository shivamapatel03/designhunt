"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from "framer-motion";
import { 
  ChevronLeft, 
  ArrowLeft,
  CheckCircle, 
  Lock, 
  Flame, 
  Trophy,
  ArrowRight,
  Sparkles,
  Loader2,
  ChevronRight,
  MousePointer2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

interface Section {
  id: string;
  progress_status: string | null;
  title: string;
}

interface Level {
  id: string;
  level_number: number;
  difficulty: "NORMAL" | "MEDIUM" | "HARD";
  sections: Section[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
}

export default function PathPage() {
  const params = useParams();
  const router = useRouter();
  const topicSlug = params.topic as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ xp: 0, streak: 0, rank: "Top 12%" });
  const [winWidth, setWinWidth] = useState(0);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Motion value for horizontal drag
  const x = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 200 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWinWidth(window.innerWidth);
      const handleResize = () => setWinWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [topicSlug]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/learning/topic/${topicSlug}`, {
        cache: 'no-store',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.topic) setTopic(data.topic);
      if (data.levels) setLevels(data.levels);

      const meRes = await fetch(`/api/auth/me`, { credentials: 'include' });
      const meData = await meRes.json();
      if (meData.user) {
        setUserStats({ 
          xp: meData.user.total_xp || 0, 
          streak: meData.user.current_streak || 0,
          rank: meData.user.xp_percentile || "Top 12%"
        });
      }

      // Initial scroll to active level
      if (data.levels) {
        const activeIdx = data.levels.findIndex((l: Level) => 
          !l.sections.every(s => s.progress_status?.toLowerCase() === 'completed')
        );
        if (activeIdx > 0) {
            setTimeout(() => jumpToLevel(activeIdx), 600);
        }
      }
    } catch (err) {
      console.error("Error fetching path data:", err);
    } finally {
      setLoading(false);
    }
  };

  const jumpToLevel = (index: number) => {
    const xSpacing = 280;
    const targetX = -index * xSpacing + (winWidth / 3);
    // Animate the motion value directly
    animate(x, targetX, {
      type: "spring",
      damping: 25,
      stiffness: 120
    });
  };

  useEffect(() => {
    if (!loading && levels.length > 0) {
      const activeIdx = levels.findIndex(l => !l.sections.every(s => s.progress_status?.toLowerCase() === 'completed'));
      setFocusedIdx(activeIdx >= 0 ? activeIdx : 0);
    }
  }, [loading, levels]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-black opacity-10" />
      </div>
    );
  }

  const activeLevelIdx = levels.findIndex(l => !l.sections.every(s => s.progress_status?.toLowerCase() === 'completed'));
  const currentActiveLevel = levels[activeLevelIdx] || levels[0];
  const totalLevels = levels.length;
  const completedLevels = levels.filter(l => l.sections.every(s => s.progress_status?.toLowerCase() === 'completed')).length;
  const totalStripWidth = levels.length * 180; 

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-hidden select-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Bottom Centered Stats - Flat Design */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
          {/* Day Streak */}
          <div className="flex items-center gap-4 border-2 border-indigo-500/10 bg-white px-6 py-3 rounded-2xl">
              <Image src="/dashboardicons/streaks.png" width={24} height={24} alt="streaks" className="object-contain" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-indigo-500/40 uppercase tracking-widest leading-none mb-1">Day</span>
                <span className="text-sm font-semibold text-gray-900">{userStats.streak} Days</span>
              </div>
          </div>

          {/* XP Stats */}
          <div className="flex items-center gap-4 border-2 border-indigo-500/10 bg-white px-6 py-3 rounded-2xl">
              <Image src="/dashboardicons/xp.png" width={24} height={24} alt="xp" className="object-contain" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-indigo-500/40 uppercase tracking-widest leading-none mb-1">XP</span>
                <span className="text-sm font-semibold text-gray-900">{userStats.xp} XP</span>
              </div>
          </div>

          {/* World Ranking */}
          <div className="flex items-center gap-4 border-2 border-indigo-500/10 bg-white px-6 py-3 rounded-2xl">
              <Image src="/dashboardicons/rank.png" width={24} height={24} alt="rank" className="object-contain" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-indigo-500/40 uppercase tracking-widest leading-none mb-1">Rank</span>
                <span className="text-sm font-semibold text-gray-900">{userStats.rank}</span>
              </div>
          </div>

          {/* Mastery Badge */}
          <div className="flex items-center gap-4 border-2 border-indigo-500/10 bg-white px-8 py-3 rounded-2xl min-w-[140px]">
              <Image 
                src={
                  completedLevels > 18 ? "/badges/typography/hard level/hard.png" :
                  completedLevels > 8 ? "/badges/typography/medium level/medium.png" :
                  "/badges/typography/normal level/normal.png"
                } 
                width={32} 
                height={32} 
                alt="badge" 
                className="object-contain" 
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-indigo-500/40 uppercase tracking-widest leading-none mb-1">Badge</span>
                <span className="text-sm font-semibold text-gray-900">
                  {completedLevels > 18 ? "Hard" : completedLevels > 8 ? "Medium" : "Normal"}
                </span>
              </div>
          </div>
      </div>



      {/* Main Grid View - Paginated */}
      <main className="h-screen flex flex-col items-center relative overflow-hidden bg-white pt-20">
        {/* Topic Title & Progress */}
        <div className="flex flex-col items-center mb-3">
          <h2 className="text-2xl font-black tracking-tight text-black">{topic?.title || "Typography"}</h2>
          <span className="text-[10px] font-bold text-gray-300 mt-1.5 tracking-[0.2em] uppercase">{completedLevels}/{totalLevels} Levels completed</span>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-20">
            {/* Minimalist Navigation Arrows - Page Flipping */}
            <button 
              onClick={() => {
                if (currentPage > 0) {
                  const prevPage = currentPage - 1;
                  setCurrentPage(prevPage);
                  setFocusedIdx(prevPage * 10);
                }
              }}
              disabled={currentPage === 0}
              className="text-gray-300 hover:text-black transition-colors disabled:opacity-0 disabled:pointer-events-none p-2 active:scale-90"
            >
              <ChevronLeft className="w-10 h-10 stroke-[1.5]" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center justify-center w-[600px] h-[280px]"
              >
                <RoadmapStrip 
                  levels={levels.slice(currentPage * 10, (currentPage + 1) * 10)} 
                  topicSlug={topicSlug} 
                  activeIdx={activeLevelIdx}
                  focusedIdx={focusedIdx}
                  topicTitle={topic?.title || "Typography"}
                  pageOffset={currentPage * 10}
                />
              </motion.div>
            </AnimatePresence>

            <button 
              onClick={() => {
                if ((currentPage + 1) * 10 < levels.length) {
                  const nextPage = currentPage + 1;
                  setCurrentPage(nextPage);
                  setFocusedIdx(nextPage * 10);
                }
              }}
              disabled={(currentPage + 1) * 10 >= levels.length}
              className="text-gray-300 hover:text-black transition-colors disabled:opacity-0 disabled:pointer-events-none p-2 active:scale-90"
            >
              <ChevronRight className="w-10 h-10 stroke-[1.5]" />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

function RoadmapStrip({ levels, topicSlug, activeIdx, focusedIdx, topicTitle, pageOffset }: { 
  levels: Level[], 
  topicSlug: string, 
  activeIdx: number, 
  focusedIdx: number, 
  topicTitle: string,
  pageOffset: number
}) {
  const router = useRouter();
  const xSpacing = 130;
  const ySpacing = 110;

  // 2-Row Grid Logic per Page
  const points = levels.map((_, i) => {
    const column = Math.floor(i / 2);
    const row = i % 2; 
    return {
      x: column * xSpacing + 40, 
      y: (row === 0 ? -ySpacing : ySpacing) / 2
    };
  });

  const svgPath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `C ${points[i-1].x + xSpacing/2} ${points[i-1].y}, ${p.x - xSpacing/2} ${p.y}, ${p.x} ${p.y}`)).join(' ');

  return (
    <div className="relative w-[600px]">
      {/* Progress Track removed for ultra-minimalist look */}
      <svg className="absolute top-0 left-0 w-full h-[400px] -translate-y-1/2 pointer-events-none overflow-visible">
        {/* Path removed for ultra-minimalist look */}
      </svg>

      {levels.map((level, i) => {
        const globalIdx = pageOffset + i;
        const isCompleted = level.sections.every(s => s.progress_status?.toLowerCase() === 'completed');
        const isNext = globalIdx === activeIdx;
        const p = points[i];
        
        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                delay: i * 0.05,
                type: "spring",
                damping: 15,
                stiffness: 150
              }
            }}
            style={{ 
              position: 'absolute',
              top: `${p.y}px`,
              left: `${p.x}px`,
              transform: 'translate(-50%, -50%)'
            }}
            className="z-10"
          >
            <div className="flex flex-col items-center">

              <button
                onClick={() => router.push(`/theory/learning/${topicSlug}?level=${level.level_number}`)}
                className="relative group outline-none"
              >
                {/* 3D Base */}
                <div className={cn(
                  "absolute inset-0 translate-y-1.5 rounded-3xl transition-all duration-300",
                  isCompleted || isNext ? "bg-indigo-900/40" : "bg-gray-200"
                )} />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-black/[0.02] rounded-full blur-xl pointer-events-none" />

                <div className={cn(
                  "relative w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 -translate-y-1 group-hover:-translate-y-1.5 group-active:translate-y-0 shadow-lg",
                  isCompleted || isNext
                    ? "bg-indigo-600 text-white shadow-[0_6px_0_0_rgb(67,56,202)] ring-4 ring-indigo-500/10" 
                    : "bg-white border-2 border-gray-100 text-gray-300 shadow-[0_6px_0_0_rgb(229,231,235)]"
                )}>
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : level.level_number}
                </div>
              </button>
              
              <span className={cn(
                "mt-3 text-[9px] font-semibold transition-colors duration-300",
                isCompleted || isNext ? "text-black" : "text-black/30"
              )}>
                Level {level.level_number.toString().padStart(2, '0')}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Completion Trophy */}
      <div 
        style={{ 
            position: 'absolute',
            top: '0px',
            left: `${levels.length * xSpacing}px`,
            transform: 'translate(-50%, -50%)' 
        }}
        className="flex flex-col items-center"
      >
          <div className="w-24 h-24 rounded-full bg-yellow-400 border-4 border-white shadow-2xl flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
          </div>
          <div className="mt-4 text-center">
              <h3 className="text-[12px] font-semibold tracking-tight">Grand final</h3>
              <p className="text-[9px] font-semibold text-gray-400">Mastery achieved</p>
          </div>
      </div>
    </div>
  );
}
