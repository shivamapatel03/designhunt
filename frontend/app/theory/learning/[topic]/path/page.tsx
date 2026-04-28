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
import { useAuth } from "@/components/providers/auth-provider";

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
  const { user: authUser, loading: authLoading } = useAuth();
  
  const [userStats, setUserStats] = useState({ xp: 0, streak: 0, rank: "Top 12%" });
  const [winWidth, setWinWidth] = useState(0);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const isMobile = winWidth > 0 && winWidth < 768;

  // Sync userStats with authUser
  useEffect(() => {
    if (authUser) {
      setUserStats({
        xp: authUser.total_xp || 0,
        streak: authUser.current_streak || 0,
        rank: authUser.xp_percentile || "Top 12%"
      });
    }
  }, [authUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWinWidth(window.innerWidth);
      const handleResize = () => setWinWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Motion value for horizontal drag
  const x = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 200 });
  const containerRef = useRef<HTMLDivElement>(null);

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

      // Fetch user stats manually for real-time accuracy
      const meRes = await fetch(`/api/auth/me?t=${Date.now()}`, { credentials: 'include' });
      const meData = await meRes.json();
      if (meData.user) {
        setUserStats({ 
          xp: meData.user.total_xp || meData.user.xp || 0, 
          streak: meData.user.current_streak || meData.user.streak || 0,
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
    const xSpacing = isMobile ? 0 : 280;
    const ySpacing = isMobile ? 120 : 0;
    const targetX = isMobile ? 0 : -index * xSpacing + (winWidth / 3);
    const targetY = isMobile ? -index * ySpacing + (window.innerHeight / 3) : 0;
    
    if (!isMobile) {
      animate(x, targetX, {
        type: "spring",
        damping: 25,
        stiffness: 120
      });
    }
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

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white select-none overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Bottom Centered Stats - Flat Design */}
      <div className="fixed bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 md:gap-4 w-full max-w-[95%] md:max-w-none justify-center px-4">
          <div className="flex items-center gap-2 md:gap-4 border-2 border-indigo-500/10 bg-white/90 backdrop-blur-md px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg transition-transform active:scale-95">
              <Image src="/dashboardicons/streaks.png" width={isMobile ? 18 : 24} height={isMobile ? 18 : 24} alt="streaks" className="object-contain" />
              <div className="flex flex-col">
                <span className="hidden md:block text-[10px] font-bold text-indigo-500/40 uppercase tracking-widest leading-none mb-1">Day</span>
                <span className="text-xs md:text-sm font-semibold text-gray-900">{userStats.streak}<span className="md:ml-1">{isMobile ? "D" : "Days"}</span></span>
              </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 border-2 border-indigo-500/10 bg-white/90 backdrop-blur-md px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg transition-transform active:scale-95">
              <Image src="/dashboardicons/xp.png" width={isMobile ? 18 : 24} height={isMobile ? 18 : 24} alt="xp" className="object-contain" />
              <div className="flex flex-col">
                <span className="hidden md:block text-[10px] font-bold text-indigo-500/40 uppercase tracking-widest leading-none mb-1">XP</span>
                <span className="text-xs md:text-sm font-semibold text-gray-900">{userStats.xp >= 1000 ? (userStats.xp / 1000).toFixed(1) + 'k' : userStats.xp} <span className="md:inline hidden">XP</span></span>
              </div>
          </div>


      </div>

      {isMobile ? (
        /* DUOLINGO MOBILE VIEW */
        <main className="min-h-screen flex flex-col bg-white pt-28 pb-48 overflow-y-auto overflow-x-hidden relative scroll-smooth">
          {/* Header */}
          <div className="flex flex-col items-center mb-12 px-6 text-center shrink-0">
            <h2 className="text-3xl font-semibold tracking-tight text-black font-figtree">{topic?.title || "Typography"}</h2>
            <div className="mt-3 flex flex-col items-center gap-2">
                <div className="w-48 h-2.5 bg-gray-100 rounded-full overflow-hidden border border-black/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedLevels/totalLevels)*100}%` }}
                        className="h-full bg-indigo-600 rounded-full"
                    />
                </div>
                <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">{completedLevels}/{totalLevels} Levels completed</span>
            </div>
          </div>

          {/* Vertical Path */}
          <div className="flex flex-col items-center gap-12 relative px-4">
             {levels.map((level, i) => {
               const isCompleted = level.sections.every(s => s.progress_status?.toLowerCase() === 'completed');
               const isNext = i === activeLevelIdx;
               const isLocked = activeLevelIdx !== -1 && i > activeLevelIdx;
               
               // Duolingo offset logic: Left, Center, Right, Center, Repeat
               const pattern = [0, 45, 0, -45];
               const xOffset = pattern[i % 4];

               return (
                 <motion.div
                   key={level.id}
                   initial={{ opacity: 0, scale: 0.8, y: 20 }}
                   whileInView={{ opacity: 1, scale: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.05 }}
                   style={{ 
                     x: xOffset,
                   }}
                   className="relative flex flex-col items-center"
                 >
                   <button
                     onClick={() => !isLocked && !isCompleted && router.push(`/theory/learning/${topicSlug}?level=${level.level_number}`)}
                     className={cn(
                       "relative group outline-none transition-transform active:scale-95",
                       (isLocked || isCompleted) ? "cursor-not-allowed" : "cursor-pointer"
                     )}
                   >
                     {/* 3D Square Button Style */}
                     <div className={cn(
                       "relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-150",
                       isLocked 
                        ? "bg-gray-200 border-b-[6px] border-gray-300 translate-y-[-6px]"
                        : isNext 
                          ? "bg-indigo-500 border-b-[6px] border-indigo-700 translate-y-[-6px] active:translate-y-[-2px] active:border-b-[2px]"
                          : "bg-indigo-600 border-b-[6px] border-indigo-800 translate-y-[-6px] active:translate-y-[-2px] active:border-b-[2px]"
                     )}>
                        {isLocked ? (
                          <Lock className="w-8 h-8 text-gray-400" />
                        ) : isCompleted ? (
                          <div className="relative">
                            <CheckCircle className="w-10 h-10 text-white" />
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-indigo-600"
                            />
                          </div>
                        ) : (
                          <span className="text-2xl font-black text-white italic">{level.level_number}</span>
                        )}
                     </div>
                   </button>

                   <span className={cn(
                     "mt-4 text-[10px] font-black uppercase tracking-widest",
                     isLocked ? "text-gray-300" : "text-black"
                   )}>
                     Level {level.level_number}
                   </span>
                 </motion.div>
               );
             })}

             {/* End indicator */}
             <div className="flex flex-col items-center mt-8 translate-y-[-20px]">
                <div className="w-1.5 h-20 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-full" />
                <div className="mt-4 p-8 bg-indigo-50/50 backdrop-blur-sm rounded-[40px] border-2 border-indigo-100 flex flex-col items-center text-center max-w-[260px] shadow-sm">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6">
                      <Trophy className="w-8 h-8 text-indigo-500 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-black text-indigo-900 tracking-tight uppercase leading-none">End of Path</h3>
                    <p className="text-[10px] font-bold text-indigo-400 mt-3 uppercase tracking-widest leading-relaxed">
                      You've unlocked the full potential of Typography. New levels are currently in design.
                    </p>
                </div>
             </div>
          </div>
        </main>
      ) : (
        /* DESKTOP PAGINATED VIEW */
        <main className="h-screen flex flex-col items-center relative overflow-hidden bg-white pt-24 md:pt-20">
          <div className="flex flex-col items-center mb-6 md:mb-3 px-6 text-center">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-black">{topic?.title || "Typography"}</h2>
            <span className="text-[10px] font-bold text-gray-300 mt-1.5 tracking-[0.2em] uppercase">{completedLevels}/{totalLevels} Levels completed</span>
          </div>

          <div className="flex flex-col items-center gap-4 md:gap-8 w-full px-4">
            <div className="flex items-center justify-between md:justify-center gap-4 md:gap-20 w-full max-w-[800px]">
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
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 stroke-[1.5]" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-center justify-center w-full md:w-[600px] h-[350px] md:h-[280px]"
                >
                  <RoadmapStrip 
                    levels={levels.slice(currentPage * 10, (currentPage + 1) * 10)} 
                    topicSlug={topicSlug} 
                    activeIdx={activeLevelIdx}
                    focusedIdx={focusedIdx}
                    topicTitle={topic?.title || "Typography"}
                    pageOffset={currentPage * 10}
                    isMobile={false}
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
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

function RoadmapStrip({ levels, topicSlug, activeIdx, focusedIdx, topicTitle, pageOffset, isMobile }: { 
  levels: Level[], 
  topicSlug: string, 
  activeIdx: number, 
  focusedIdx: number, 
  topicTitle: string,
  pageOffset: number,
  isMobile: boolean
}) {
  const router = useRouter();
  const xSpacing = 130;
  const ySpacing = 110;

  const points = levels.map((_, i) => {
    const column = Math.floor(i / 2);
    const row = i % 2; 
    return {
      x: column * xSpacing + 40, 
      y: (row === 0 ? -ySpacing : ySpacing) / 2
    };
  });

  return (
    <div className="relative w-[600px]">
      {levels.map((level, i) => {
        const globalIdx = pageOffset + i;
        const isCompleted = level.sections.every(s => s.progress_status?.toLowerCase() === 'completed');
        const isNext = globalIdx === activeIdx;
        const isLocked = activeIdx !== -1 && globalIdx > activeIdx;
        const p = points[i];
        
        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{ 
              position: 'absolute',
              top: `${p.y}px`,
              left: `${p.x}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            <div className="flex flex-col items-center">
              <button
                onClick={() => !isLocked && !isCompleted && router.push(`/theory/learning/${topicSlug}?level=${level.level_number}`)}
                className={cn(
                  "relative group outline-none",
                  (isLocked || isCompleted) ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {/* Desktop Style Button */}
                <div className={cn(
                  "relative w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 -translate-y-1 group-hover:-translate-y-1.5 group-active:translate-y-0 shadow-lg",
                  isCompleted || isNext
                    ? "bg-indigo-600 text-white shadow-[0_6px_0_0_rgb(67,56,202)]" 
                    : "bg-white border-2 border-gray-100 text-gray-300 shadow-[0_6px_0_0_rgb(229,231,235)]"
                )}>
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : level.level_number}
                </div>
              </button>
              
              <span className={cn(
                "mt-3 text-[9px] font-semibold",
                isCompleted || isNext ? "text-black" : "text-black/30"
              )}>
                Lvl {level.level_number.toString().padStart(2, '0')}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
