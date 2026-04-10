"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  Volume2, 
  Trophy, 
  Flame, 
  Zap,
  CheckCircle,
  Play,
  Bookmark,
  ChevronDown,
  Circle,
  LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface Section {
  id: string;
  level_id: string;
  title: string;
  content_json: any;
  duration_mins: number;
  type: "READ" | "TEST";
  order: number;
  progress_status: string | null;
}

interface Level {
  id: string;
  level_number: number;
  difficulty: "NORMAL" | "MEDIUM" | "HARD";
  order: number;
  sections: Section[];
}

interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
}

export default function LearningPage() {
  const params = useParams();
  const router = useRouter();
  const topicSlug = params.topic as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [userStats, setUserStats] = useState({ xp: 0, streak: 0 });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [allBookmarks, setAllBookmarks] = useState<string[]>([]);
  const [bookmarkFeedback, setBookmarkFeedback] = useState<string | null>(null);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<any>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizData, setQuizData] = useState<any[] | null>(null);
  useEffect(() => {
    fetchTopicData();
    fetchTopicData();
    
    // Safety net for closing tab
    const handleBeforeUnload = () => {
      if (currentSectionRef.current) {
        // You could trigger a 'last viewed' sync here if needed
        console.log("Saving last viewed section before exit:", currentSectionRef.current.id);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [topicSlug]);

  const fetchTopicData = async () => {
    try {
      const res = await fetch(`/api/learning/topic/${topicSlug}`, {
        cache: 'no-store',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }
      setTopic(data.topic);
      setLevels(data.levels);
      setAllBookmarks(data.userBookmarks || []);

      // Fetch user stats
      const meRes = await fetch(`/api/auth/me`, { credentials: 'include' });
      const meData = await meRes.json();
      if (meData.user) {
        setUserStats({
          xp: meData.user.total_xp || 0,
          streak: meData.user.current_streak || 0
        });
      }
      
      // Find where to start: first incomplete section
      let found = false;
      for (let l = 0; l < data.levels.length; l++) {
        for (let s = 0; s < data.levels[l].sections.length; s++) {
          if (!data.levels[l].sections[s].progress_status) {
            setCurrentLevelIdx(l);
            setCurrentSectionIdx(s);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    } catch (err) {
      toast.error("Failed to load learning data");
    } finally {
      setLoading(false);
    }
  };

  const currentLevel = levels[currentLevelIdx];
  const currentSection = currentLevel?.sections[currentSectionIdx];

  const currentSectionRef = useRef<any>(null);

  useEffect(() => {
    if (currentSection) {
      setIsBookmarked(allBookmarks.includes(currentSection.id));
    }
  }, [currentSection, allBookmarks]);

  const handleToggleBookmark = async () => {
    if (!currentSection) return;
    const originalState = isBookmarked;
    setIsBookmarked(!originalState);
    
    try {
      const res = await fetch('/api/learning/toggle-bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_id: currentSection.id }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.status === 'BOOKMARKED') {
        setAllBookmarks(prev => [...prev, currentSection.id]);
        setBookmarkFeedback("Section bookmarked");
        setTimeout(() => setBookmarkFeedback(null), 2000);
      } else {
        setAllBookmarks(prev => prev.filter(id => id !== currentSection.id));
        setBookmarkFeedback("Bookmark removed");
        setTimeout(() => setBookmarkFeedback(null), 2000);
      }
    } catch (err) {
      setIsBookmarked(originalState);
      toast.error("Failed to update bookmark");
    }
  };

  // Fetch quiz if current section is TEST
  useEffect(() => {
    if (currentSection?.type === "TEST") {
      fetch(`/api/learning/section/${currentSection.id}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setQuizData(data.quiz);
          setQuizQuestionIdx(0);
          setQuizScore(0);
          setShowQuizResult(false);
          setSelectedQuizOption(null);
        });
    }
  }, [currentSection]);

  const handleMarkAsDone = async () => {
    if (!currentSection) return;

    try {
      const res = await fetch(`/api/learning/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ section_id: currentSection.id }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`+${data.xp_earned} XP earned!`);
        
        if (data.badge_earned) {
          setEarnedBadge(data.badge_earned);
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#6366f1', '#a5b4fc', '#ffffff'] });
        } else {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
          handleNext();
        }
        
        // Refresh data to show marks in sidebar
        fetchTopicData();
      }
    } catch (err) {
      toast.error("Failed to save progress");
    }
  };

  const handleNext = () => {
    if (currentSectionIdx < currentLevel.sections.length - 1) {
      setCurrentSectionIdx(prev => prev + 1);
    } else if (currentLevelIdx < levels.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setCurrentSectionIdx(0);
    } else {
      toast.success("Topic Mastered!");
      router.push("/theory/typography");
    }
  };

  const handlePrev = () => {
    if (currentSectionIdx > 0) {
      setCurrentSectionIdx(prev => prev - 1);
    } else if (currentLevelIdx > 0) {
      const prevLevel = levels[currentLevelIdx - 1];
      setCurrentLevelIdx(prev => prev - 1);
      setCurrentSectionIdx(prevLevel.sections.length - 1);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null || !quizData) return;

    const isCorrect = selectedQuizOption === quizData[quizQuestionIdx].correct_answer;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      toast.success("Correct!");
      
      // Short delay for "Success" state
      setTimeout(() => {
        if (quizQuestionIdx < quizData.length - 1) {
          setQuizQuestionIdx(prev => prev + 1);
          setSelectedQuizOption(null);
        } else {
          setShowQuizResult(true);
        }
      }, 500);
    } else {
      toast.error("Take a moment to see the correct answer...");
      
      // DELIBERATE PAUSE for learning (1.5s)
      setTimeout(() => {
        if (quizQuestionIdx < quizData.length - 1) {
          setQuizQuestionIdx(prev => prev + 1);
          setSelectedQuizOption(null);
        } else {
          setShowQuizResult(true);
        }
      }, 2000);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Mastery...</div>;

  const normalLevels = levels.filter(l => l.difficulty === "NORMAL");
  const mediumLevels = levels.filter(l => l.difficulty === "MEDIUM");
  const hardLevels = levels.filter(l => l.difficulty === "HARD");

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <header className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href={`/theory/learning/${topicSlug}/path`} className="p-1 hover:bg-gray-100 rounded-lg transition-all border border-transparent hover:border-black/5">
                <ChevronLeft className="w-4 h-4" />
             </Link>
             <Link 
               href={`/theory/learning/${topicSlug}/path`}
               className="flex flex-col text-left group"
             >
               <div className="flex items-center gap-1.5">
                 <h1 className="text-base font-bold font-clash tracking-tight leading-none group-hover:text-black/70 transition-colors">
                    {topic?.title} : Level {currentLevel?.level_number}
                 </h1>
               </div>
               <div className="flex items-center gap-2 mt-1.5">
                  <span className={cn(
                    "text-[8px] font-black px-1.5 py-0.5 rounded",
                    currentLevel?.difficulty === 'NORMAL' && "bg-gray-100 text-gray-500",
                    currentLevel?.difficulty === 'MEDIUM' && "bg-indigo-50 text-indigo-500",
                    currentLevel?.difficulty === 'HARD' && "bg-pink-50 text-pink-500"
                  )}>
                    {currentLevel?.difficulty.charAt(0) + currentLevel?.difficulty.slice(1).toLowerCase()} theory
                  </span>
                  <span className="text-[10px] font-bold text-gray-300">/</span>
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-black transition-colors">{currentSection?.title}</span>
               </div>
             </Link>
          </div>
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 mr-4 relative">
                <div className="relative flex items-center">
                  <AnimatePresence>
                    {bookmarkFeedback && (
                      <motion.span
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: [0, 1, 0.4, 1], x: -10 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="absolute right-full whitespace-nowrap text-[10px] font-bold text-[#FF69B4] mr-2 pointer-events-none"
                      >
                        {bookmarkFeedback}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button 
                    onClick={handleToggleBookmark}
                    className={cn(
                      "p-1.5 hover:bg-gray-50 rounded-lg transition-all border border-transparent hover:border-black/5",
                      isBookmarked ? "text-[#FF69B4]" : "text-gray-300 hover:text-gray-400"
                    )}
                    title="Bookmark section"
                  >
                    <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                  </button>
                </div>
             </div>

             <div className="flex items-center gap-1.5 border border-gray-100 px-2 py-1 rounded font-bold text-[10px] text-gray-500">
                <NextImage src="/dashboardicons/streaks.png" width={14} height={14} alt="streak" className="object-contain" /> {userStats.streak}D Streak
             </div>
             <div className="flex items-center gap-1.5 border border-gray-100 px-2 py-1 rounded font-bold text-[10px] text-gray-500">
                <NextImage src="/dashboardicons/xp.png" width={14} height={14} alt="xp" className="object-contain" /> {userStats.xp.toLocaleString()} XP
             </div>
             <button className="flex items-center gap-1.5 font-bold text-xs hover:underline transition-all">
                Speech <Volume2 className="w-3.5 h-3.5" />
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
             <motion.div 
               key={currentSection?.id}
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -5 }}
               className="max-w-2xl mx-auto"
             >
                {currentSection?.type === "READ" ? (
                  <div className="space-y-10">
                    <section className="max-w-none flex flex-col items-center">
                      {currentSection.content_json?.map((block: any, i: number) => {
                        if (block.type === 'text') return (
                          <p 
                            key={i} 
                            className="text-[15px] font-semibold text-black font-plus-jakarta text-center leading-relaxed mb-8 max-w-xl"
                          >
                            {block.value}
                          </p>
                        );
                        if (block.type === 'image') return (
                          <div key={i} className="w-full flex justify-center mb-10">
                            <img 
                              src={block.value} 
                              alt="" 
                              className={cn(
                                "rounded-xl border border-black/5 object-contain shadow-sm",
                                block.size === 'small' ? "max-w-[320px]" : "w-full"
                              )} 
                            />
                          </div>
                        );
                        if (block.type === 'interactive-lego') return <InteractiveLego key={i} type={block.value} label={block.label} />;
                        return null;
                      })}
                    </section>
                  </div>
                ) : (
                  <QuizView 
                    data={quizData} 
                    selectedOption={selectedQuizOption}
                    onSelect={setSelectedQuizOption}
                    onSubmit={handleQuizSubmit}
                    disabled={false}
                    result={showQuizResult && quizData ? { isCorrect: quizScore === quizData.length, score: Math.round((quizScore / quizData.length) * 100) } : null}
                    onNext={handleMarkAsDone}
                  />
                )}
             </motion.div>
          </AnimatePresence>
        </div>

        {/* Badge Celebration Modal */}
        <AnimatePresence>
          {earnedBadge && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="bg-white rounded-[40px] max-w-sm w-full p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
              >
                {/* Animated Background Rays */}
                <div className="absolute inset-0 bg-indigo-50/50 -z-10 animate-pulse" />
                
                <div className="w-40 h-40 mb-8 relative">
                    <motion.img 
                      initial={{ rotate: -20, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                      src={`/badges/typography/images/${earnedBadge.image}`}
                      alt="Earned Badge"
                      className="w-full h-full object-contain filter drop-shadow-2xl"
                    />
                </div>

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">Tier Unlock</span>
                <h2 className="text-3xl font-black text-black tracking-tight mb-2 leading-none uppercase">
                   {earnedBadge.tier} MASTERED!
                </h2>
                <p className="text-sm font-semibold text-gray-500 mb-8">
                  Congratulations! You've earned the <strong>{earnedBadge.name}</strong> badge for {earnedBadge.topic}.
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => {
                        setEarnedBadge(null);
                        handleNext();
                    }}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
                  >
                    Continue Journey
                  </button>
                  <Link
                    href="/profile?tab=badges"
                    className="w-full py-4 border border-black/10 rounded-2xl font-bold text-xs uppercase tracking-widest text-black/40 hover:text-black transition-all text-center"
                  >
                    View Collection
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <footer className="px-8 py-4 flex items-center justify-between">
           <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 tracking-widest">
              {currentSection?.duration_mins}m Read
           </div>
           
           <div className="flex items-center gap-8">
              <button 
                onClick={handlePrev}
                disabled={currentLevelIdx === 0 && currentSectionIdx === 0}
                className="flex items-center gap-0.5 font-semibold transition-all tracking-widest text-[9px] border-b border-black pb-0.5 disabled:opacity-0 disabled:pointer-events-none transition-opacity"
              >
                <ChevronLeft className="w-3 h-3" /> Previous
              </button>

              <button 
                onClick={handleMarkAsDone}
                disabled={currentSection?.progress_status?.toLowerCase() === 'completed' || currentSection?.type === 'TEST'}
                className={cn(
                  "px-6 py-2 rounded-md font-semibold transition-all flex items-center gap-1.5 text-[11px]",
                  currentSection?.progress_status?.toLowerCase() === 'completed' 
                    ? "bg-black text-white cursor-default"
                    : "bg-white text-black border border-black hover:bg-black hover:text-white"
                )}
              >
                {currentSection?.progress_status?.toLowerCase() === 'completed' ? (
                  <>Done <CheckCircle className="w-3 h-3" /></>
                ) : (
                  <>Mark done</>
                )}
              </button>
              
              <button 
                onClick={handleNext}
                className="flex items-center gap-0.5 font-semibold transition-all tracking-widest text-[9px] border-b border-black pb-0.5"
              >
                Next <ChevronRight className="w-3 h-3" />
              </button>
           </div>
        </footer>
      </main>
    </div>
  );
}




function InteractiveLego({ type, label }: { type: string; label: string }) {
  const [weight, setWeight] = useState(400);
  const [leading, setLeading] = useState(1.5);
  const [tracking, setTracking] = useState(0);
  const [hierarchyMode, setHierarchyMode] = useState('BAD');
  const [contrastColor, setContrastColor] = useState('#6611FF');

  if (type === 'font-weight-slider') {
    return (
      <div className="bg-white border-2 border-black rounded-2xl p-8 my-8 shadow-sm">
        <label className="block text-[10px] font-semibold text-black mb-4 tracking-widest">{label}</label>
        <div className="text-6xl mb-8 text-center font-clash" style={{ fontWeight: weight }}>Aa</div>
        <input type="range" min="100" max="900" step="100" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full cursor-pointer accent-black" />
        <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400"><span>THIN</span><span>BOLD</span></div>
      </div>
    );
  }

  if (type === 'line-height-slider') {
    return (
      <div className="bg-white border-2 border-black rounded-2xl p-6 my-8 shadow-sm">
        <label className="block text-[10px] font-semibold text-black mb-4 tracking-widest">{label}</label>
        <div className="mb-6 p-4 bg-gray-50 rounded-xl overflow-hidden">
            <p className="text-sm leading-relaxed" style={{ lineHeight: leading }}>
                The line height (leading) of this text block changes as you move the slider. Proper leading ensures eye comfort during long reading sessions.
            </p>
        </div>
        <input type="range" min="1" max="2.5" step="0.1" value={leading} onChange={(e) => setLeading(Number(e.target.value))} className="w-full cursor-pointer accent-black" />
        <div className="flex justify-between mt-2 text-[9px] font-bold text-gray-400"><span>TIGHT</span><span>LOOSE ({leading})</span></div>
      </div>
    );
  }

  if (type === 'tracking-visualizer') {
    return (
      <div className="bg-white border-2 border-black rounded-2xl p-6 my-8 shadow-sm">
        <label className="block text-[10px] font-semibold text-black mb-4 tracking-widest">{label}</label>
        <div className="text-4xl py-10 text-center font-clash bg-gray-50 rounded-xl mb-6 flex items-center justify-center italic" style={{ letterSpacing: `${tracking}px` }}>
            SPACE
        </div>
        <input type="range" min="-5" max="20" step="1" value={tracking} onChange={(e) => setTracking(Number(e.target.value))} className="w-full cursor-pointer accent-black" />
        <div className="flex justify-between mt-2 text-[9px] font-bold text-gray-400"><span>COMPRESSED</span><span>WIDE ({tracking}px)</span></div>
      </div>
    );
  }

  if (type === 'hierarchy-toggle') {
    return (
      <div className="bg-white border-2 border-black rounded-2xl p-6 my-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <label className="text-[10px] font-semibold text-black tracking-widest">{label}</label>
            <button 
                onClick={() => setHierarchyMode(prev => prev === 'BAD' ? 'GOOD' : 'BAD')}
                className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded"
            >
                Toggle mode: {hierarchyMode}
            </button>
        </div>
        <div className={cn("p-6 bg-gray-50 rounded-xl", hierarchyMode === 'GOOD' ? "space-y-4" : "space-y-1")}>
            <h4 className={cn("font-semibold", hierarchyMode === 'GOOD' ? "text-2xl" : "text-base")}>Main Heading</h4>
            <h5 className={cn("font-bold text-gray-500", hierarchyMode === 'GOOD' ? "text-sm uppercase tracking-widest" : "text-base")}>Sub-heading text</h5>
            <p className="text-xs text-gray-600">This is some body content. Notice how the spacing and font size hierarchy impacts scannability and clarity.</p>
        </div>
      </div>
    );
  }

  if (type === 'contrast-checker') {
    return (
      <div className="bg-white border-2 border-black rounded-2xl p-6 my-8 shadow-sm text-center">
        <label className="block text-[10px] font-semibold text-black mb-4 uppercase tracking-widest mb-6">{label}</label>
        <div 
            className="w-full h-32 rounded-xl flex items-center justify-center font-bold text-2xl transition-all mb-6"
            style={{ backgroundColor: contrastColor, color: '#FFFFFF' }}
        >
            AA Pass?
        </div>
        <div className="grid grid-cols-4 gap-2">
            {['#6611FF', '#000000', '#FFCC00', '#FF0055'].map(color => (
                <button 
                    key={color}
                    onClick={() => setContrastColor(color)}
                    className="h-8 rounded-md border border-gray-200"
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
      <Play className="w-10 h-10 text-black" />
      <span className="font-semibold text-sm text-black">{label}</span>
    </div>
  );
}

function QuizView({ data, selectedOption, onSelect, onSubmit, disabled, result, onNext }: any) {
  const [timeLeft, setTimeLeft] = useState(20);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    if (!data || data.length === 0 || result || isSubmitted || isTimeout) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [data, result, isSubmitted, isTimeout]);

  // Handle Timeout logic
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted && !result) {
      setIsTimeout(true);
    }
  }, [timeLeft, isSubmitted, result]);

  // Reset local state when question changes
  useEffect(() => {
    setTimeLeft(20);
    setIsSubmitted(false);
    setIsTimeout(false);
  }, [data]);

  const handleRetry = () => {
    setTimeLeft(20);
    setIsTimeout(false);
    setIsSubmitted(false);
  };

  const handleLocalSubmit = () => {
    setIsSubmitted(true);
    onSubmit();
  };

  if (!data || data.length === 0) return <div className="text-xs font-bold text-gray-400 text-center py-20">No quiz data...</div>;
  
  const question = data[0];

  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-10 text-center"
      >
        <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4",
            result.isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        )}>
            {result.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <Play className="w-6 h-6 rotate-90" />}
        </div>
        <h2 className="text-lg font-semibold mb-1">{result.isCorrect ? "Correct!" : "Try Again"}</h2>
        <p className="text-gray-500 text-[10px] font-bold tracking-widest mb-6">Score: {result.score}%</p>
        <button 
          onClick={onNext}
          className="px-6 py-2 bg-black text-white rounded font-semibold text-[10px] hover:bg-gray-800 transition-all"
        >
          {result.isCorrect ? "Next level" : "Review material"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-6 relative">
      <AnimatePresence>
        {isTimeout && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-4 text-center px-6 leading-none">
                ARE YOU <br /> SLEEPING? 😴
            </h2>
            <p className="text-[10px] font-bold text-gray-400 mb-8 text-center">Time's up, focus back up buddy!</p>
            <button
                onClick={handleRetry}
                className="px-8 py-3 bg-black text-white rounded-full font-bold text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
            >
                Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-black text-white text-[8px] font-semibold tracking-widest">
          Question 1 of 1
        </div>
        <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-bold tabular-nums", timeLeft <= 5 ? "text-red-500" : "text-gray-400")}>0:{timeLeft.toString().padStart(2, '0')}</span>
            <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                    className={cn("h-full", timeLeft <= 5 ? "bg-red-500" : "bg-black")}
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / 20) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </div>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold mb-8 tracking-tighter leading-tight">
        {question.question}
      </h2>

      <div className="space-y-2 mb-10">
        {question.options_json.map((option: string, idx: number) => {
          const isSelected = selectedOption === idx;
          const isCorrect = question.correct_answer === idx;
          
          return (
            <button
              key={idx}
              disabled={isSubmitted || isTimeout}
              onClick={() => onSelect(idx)}
              className={cn(
                "w-full text-left p-3 rounded-lg border-2 transition-all flex items-center justify-between group",
                !isSubmitted && isSelected && "border-black bg-black text-white",
                !isSubmitted && !isSelected && "border-gray-100 bg-white hover:border-gray-300 text-gray-600 font-semibold",
                isSubmitted && isCorrect && "border-green-500 bg-green-50 text-green-700",
                isSubmitted && isSelected && !isCorrect && "border-red-500 bg-red-50 text-red-700",
                isSubmitted && !isSelected && !isCorrect && "border-gray-100 bg-white opacity-40"
              )}
            >
              <span className="text-[11px]">{option}</span>
              <div className={cn(
                "w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors",
                isSelected ? "border-white bg-white/20" : "border-gray-200",
                isSubmitted && isCorrect && "border-green-500 bg-green-500",
                isSubmitted && isSelected && !isCorrect && "border-red-500 bg-red-500"
              )}>
                {isSelected && !isSubmitted && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                {isSubmitted && isCorrect && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleLocalSubmit}
        disabled={disabled || selectedOption === null || isSubmitted || isTimeout}
        className="w-full h-10 bg-black text-white rounded font-semibold tracking-widest text-[10px] disabled:bg-gray-100 disabled:text-gray-300 transition-all hover:bg-gray-800 active:scale-[0.98]"
      >
        {isSubmitted ? "Checking..." : "Submit answer"}
      </button>
    </div>
  );
}
