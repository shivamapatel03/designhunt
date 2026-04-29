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
  LayoutGrid,
  ArrowRight
} from "lucide-react";
import { ListenButton } from "@/components/ui/ListenButton";
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
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizData, setQuizData] = useState<any[] | null>(null);
  const [isMastered, setIsMastered] = useState(false);

  useEffect(() => {
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
      let allCompleted = true;
      for (let l = 0; l < data.levels.length; l++) {
        for (let s = 0; s < data.levels[l].sections.length; s++) {
          if (!data.levels[l].sections[s].progress_status) {
            setCurrentLevelIdx(l);
            setCurrentSectionIdx(s);
            found = true;
            allCompleted = false;
            break;
          }
        }
        if (found) break;
      }

      if (allCompleted && data.levels.length > 0) {
        // If all are completed, show the last section but maybe they want to see congrats again?
        // For now, just show the last section.
        setCurrentLevelIdx(data.levels.length - 1);
        setCurrentSectionIdx(data.levels[data.levels.length - 1].sections.length - 1);
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
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        handleNext();
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
      setIsMastered(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const getTheoryUrl = (slug: string) => {
    if (slug === 'typography') return '/theory/typography';
    if (slug === 'colour-theory') return '/theory/color';
    if (slug === 'layout-grids') return '/theory/layout';
    if (slug === 'visual-hierarchy') return '/theory/visual-hierarchy';
    return '/theory';
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

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" />
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Mastery...</span>
    </div>
  );

  if (isMastered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_0_0_#ca8a04]">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-2">TOPIC MASTERED!</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">You have completed all levels of {topic?.title}</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <div className="bg-gray-50 p-6 rounded-3xl border border-black/5 mb-4">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <span className="block text-2xl font-black text-black">+{levels.length * 50}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">XP Earned</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <span className="block text-2xl font-black text-black">{levels.length}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Levels Done</span>
              </div>
            </div>
          </div>

          <Link
            href={getTheoryUrl(topicSlug)}
            className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:translate-y-[-2px] active:scale-95 shadow-[0_6px_0_0_#333]"
          >
            Continue Learning
          </Link>
          <Link
            href="/profile"
            className="w-full py-4 bg-white text-black border-2 border-black rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-gray-50 active:scale-95"
          >
            View Profile
          </Link>
        </motion.div>
      </div>
    );
  }

  const normalLevels = levels.filter(l => l.difficulty === "NORMAL");
  const mediumLevels = levels.filter(l => l.difficulty === "MEDIUM");
  const hardLevels = levels.filter(l => l.difficulty === "HARD");

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {/* Header */}
        <header className="px-4 md:px-8 py-3 md:py-4 flex flex-row items-center justify-between gap-3 md:gap-4 border-b border-gray-50">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
             <Link href={`/theory/learning/${topicSlug}/path`} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-all border border-transparent hover:border-black/5 shrink-0">
                <ChevronLeft className="w-4 h-4 md:w-4 md:h-4" />
             </Link>
             <div className="flex flex-col text-left group min-w-0 flex-1">
               <div className="flex items-center gap-1.5 min-w-0">
                 <h1 className="text-xs md:text-base font-bold font-clash tracking-tight leading-none text-black truncate">
                    {topic?.title} <span className="text-gray-300 mx-1 md:mx-2">:</span> Level {currentLevel?.level_number}
                 </h1>
               </div>
               <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-1.5 min-w-0">
                  <span className={cn(
                    "text-[7px] md:text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0",
                    currentLevel?.difficulty === 'NORMAL' && "bg-gray-100 text-gray-500",
                    currentLevel?.difficulty === 'MEDIUM' && "bg-indigo-50 text-indigo-500",
                    currentLevel?.difficulty === 'HARD' && "bg-pink-50 text-pink-500"
                  )}>
                    {currentLevel?.difficulty}
                  </span>
                  <span className="text-[10px] font-bold text-gray-200 shrink-0">|</span>
                  <span className="text-[9px] md:text-[10px] font-bold text-gray-400 group-hover:text-black transition-colors truncate">
                    {currentSection?.title}
                  </span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center justify-end gap-2 shrink-0">
              <ListenButton 
                text={
                  currentSection?.type === 'READ' 
                    ? currentSection.content_json
                        ?.filter((b: any) => b.type === 'text')
                        ?.map((b: any) => b.value)
                        ?.join('. ')
                    : "Quiz time! Please select the correct answer for the following questions."
                } 
              />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 px-4 md:px-8 py-6 md:py-10 overflow-y-auto pb-32">
          <AnimatePresence mode="wait">
             <motion.div 
               key={currentSection?.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="max-w-xl md:max-w-2xl mx-auto"
             >
                {currentSection?.type === "READ" ? (
                  <div className="space-y-8 md:space-y-10">
                    <section className="max-w-none flex flex-col items-center">
                      {currentSection.content_json?.map((block: any, i: number) => {
                        if (block.type === 'text') return (
                          <p 
                            key={i} 
                            className="text-sm md:text-[15px] font-semibold text-gray-800 font-plus-jakarta text-center leading-relaxed mb-6 md:mb-8 w-full"
                          >
                            {block.value.split(/(200ms-500ms)/g).map((part: string, idx: number) => 
                              part === '200ms-500ms' 
                                ? <span key={idx} className="border-b-2 border-dotted border-black/20 pb-0.5 px-0.5">{part}</span>
                                : part
                            )}
                          </p>
                        );
                        if (block.type === 'image') return (
                          <div key={i} className="w-full flex justify-center mb-8 md:mb-10 px-2 md:px-0">
                            <img 
                              src={block.value} 
                              alt="" 
                              className={cn(
                                "rounded-2xl border border-black/5 object-contain shadow-sm w-full h-auto max-h-[400px]",
                                block.size === 'small' ? "max-w-[280px] md:max-w-[320px]" : "max-w-full"
                              )} 
                            />
                          </div>
                        );
                        if (block.type === 'video') return (
                          <div key={i} className="w-full flex justify-center mb-8 md:mb-10 px-2 md:px-0">
                            <video 
                              src={block.value} 
                              autoPlay 
                              loop 
                              muted
                              playsInline
                              className={cn(
                                "rounded-2xl border border-black/5 object-cover shadow-sm w-full h-auto max-h-[300px]",
                                block.size === 'small' ? "max-w-[280px] md:max-w-[320px]" : "max-w-[400px]"
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

        {/* Footer Navigation - Sticky & Hovering */}
        <footer className="absolute bottom-0 left-0 right-0 py-8 md:py-10 flex flex-col items-center justify-center pointer-events-none z-20">
           <div className="flex flex-col items-center pointer-events-auto">
              {(currentSection?.type !== 'TEST' || showQuizResult) && (
                <button 
                  onClick={handleMarkAsDone}
                  disabled={currentSection?.progress_status?.toLowerCase() === 'completed'}
                  className={cn(
                    "px-8 py-3.5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 text-[10px] md:text-xs uppercase tracking-widest group",
                    currentSection?.progress_status?.toLowerCase() === 'completed' 
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : "bg-[#2B7FFF] text-white hover:brightness-110 hover:translate-y-[-2px] active:scale-95 shadow-[0_4px_0_0_#1556B8] hover:shadow-[0_6px_0_0_#1556B8] active:shadow-none active:translate-y-[2px]"
                  )}
                >
                  {currentSection?.progress_status?.toLowerCase() === 'completed' ? (
                    <>Lesson Completed <CheckCircle className="w-5 h-5" /></>
                  ) : (
                    currentLevelIdx === levels.length - 1 && currentSectionIdx === currentLevel.sections.length - 1 ? (
                      <>Finish Module <Trophy className="w-5 h-5 fill-current" /></>
                    ) : (
                      <>Next Lesson <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    )
                  )}
                </button>
              )}
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
  const [showGrid, setShowGrid] = useState(true);
  const [activeOpenType, setActiveOpenType] = useState(false);

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

  if (type === 'fluid-scale-interactive') {
    return (
      <div className="bg-white border-2 border-black rounded-2xl p-6 my-8 shadow-sm">
        <label className="block text-[10px] font-semibold text-black mb-4 uppercase tracking-widest">{label}</label>
        <div className="mb-6 p-6 bg-gray-50 rounded-xl overflow-hidden flex flex-col items-center min-h-[160px] justify-center">
            <div 
                className="font-clash font-bold text-center transition-all duration-300 ease-out break-all"
                style={{ fontSize: `${Math.max(16, Math.min(64, (weight / 900) * 64))}px` }}
            >
                FLUID TYPE
            </div>
            <p className="mt-4 text-[10px] font-bold text-gray-400">Current Size: {Math.round(Math.max(16, Math.min(64, (weight / 900) * 64)))}px</p>
        </div>
        <input 
            type="range" 
            min="100" 
            max="900" 
            step="10" 
            value={weight} 
            onChange={(e) => setWeight(Number(e.target.value))} 
            className="w-full cursor-pointer accent-black" 
        />
        <div className="flex justify-between mt-2 text-[9px] font-bold text-gray-400"><span>MOBILE (320px)</span><span>DESKTOP (1440px)</span></div>
        <p className="mt-4 text-[10px] text-gray-500 italic leading-tight">Simulating viewport resize. In CSS: <code>clamp(1rem, 5vw, 4rem)</code></p>
      </div>
    );
  }

  if (type === 'baseline-grid-visualizer') {
    return (
      <div className="bg-white border-2 border-black rounded-2xl p-6 my-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <label className="text-[10px] font-semibold text-black uppercase tracking-widest">{label}</label>
            <button 
                onClick={() => setShowGrid(!showGrid)}
                className={cn(
                    "px-3 py-1 rounded text-[10px] font-bold transition-all",
                    showGrid ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                )}
            >
                Grid: {showGrid ? 'ON' : 'OFF'}
            </button>
        </div>
        <div className="relative p-6 bg-white rounded-xl overflow-hidden border border-gray-100">
            {showGrid && (
                <div className="absolute inset-0 pointer-events-none" style={{ 
                    backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                    backgroundSize: '100% 8px'
                }} />
            )}
            <div className="relative z-10 space-y-4">
                <h4 className="text-xl font-bold leading-[24px]">Perfect Alignment</h4>
                <p className="text-sm leading-[16px]">
                    This text is snapped to an 8px baseline grid. Notice how the lines sit exactly on the imaginary horizontal wires.
                </p>
                <p className="text-sm leading-[16px]">
                    Consistent vertical rhythm makes layouts feel professional and stable.
                </p>
            </div>
        </div>
        <p className="mt-4 text-[10px] text-gray-500 italic">Line-heights are multiples of 8 (24px, 16px).</p>
      </div>
    );
  }

  if (type === 'opentype-feature-toggle') {
     return (
        <div className="bg-white border-2 border-black rounded-2xl p-6 my-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <label className="text-[10px] font-semibold text-black uppercase tracking-widest">{label}</label>
                <button 
                    onClick={() => setActiveOpenType(!activeOpenType)}
                    className={cn(
                        "px-3 py-2 rounded-lg text-[10px] font-black transition-all border-2",
                        activeOpenType ? "bg-black border-black text-white" : "bg-white border-black text-black"
                    )}
                >
                    {activeOpenType ? 'LIGATURES ENABLED' : 'ENABLE LIGATURES'}
                </button>
            </div>
            <div className="bg-gray-50 p-10 rounded-xl flex items-center justify-center gap-10">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-gray-300 mb-2 uppercase">"fi" pair</span>
                    <span className="text-5xl font-serif" style={{ fontVariantLigatures: activeOpenType ? 'common-ligatures' : 'none' }}>
                        fi
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-gray-300 mb-2 uppercase">"ffl" pair</span>
                    <span className="text-5xl font-serif" style={{ fontVariantLigatures: activeOpenType ? 'common-ligatures' : 'none' }}>
                        ffl
                    </span>
                </div>
            </div>
            <p className="mt-4 text-[10px] text-gray-500 text-center">Ligatures combine multiple characters into a single glyph for better flow.</p>
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
          className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold text-[11px] uppercase tracking-widest transition-all hover:bg-slate-700 active:translate-y-[2px]"
        >
          {result.isCorrect ? "Next lesson" : "Review material"}
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
                className="px-8 py-3 bg-slate-800 text-white rounded-full font-black text-[11px] uppercase tracking-widest transition-all shadow-[0_4px_0_0_#000000] hover:bg-slate-700 active:shadow-none active:translate-y-[4px] mb-1"
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

      <div className="flex flex-col gap-4 mb-10">
        {question.options_json.map((option: string, idx: number) => {
          const isSelected = selectedOption === idx;
          const isCorrect = question.correct_answer === idx;
          
          return (
            <button
              key={idx}
              disabled={isSubmitted || isTimeout}
              onClick={() => onSelect(idx)}
              className={cn(
                "w-full text-left px-5 py-4 rounded-full border-2 transition-all flex items-center justify-between group",
                !isSubmitted && isSelected && "bg-[#2B7FFF] border-[#2B7FFF] text-white shadow-[0_4px_0_0_#1556B8] active:shadow-none active:translate-y-[4px]",
                !isSubmitted && !isSelected && "bg-white border-gray-200 text-gray-600 font-semibold shadow-[0_4px_0_0_#e5e7eb] hover:bg-gray-50 active:shadow-none active:translate-y-[4px]",
                isSubmitted && isCorrect && "bg-green-50 border-green-500 text-green-700 shadow-[0_4px_0_0_#22c55e]",
                isSubmitted && isSelected && !isCorrect && "bg-red-50 border-red-500 text-red-700 shadow-[0_4px_0_0_#ef4444]",
                isSubmitted && !isSelected && !isCorrect && "bg-white border-gray-200 text-gray-400 opacity-50 shadow-[0_4px_0_0_#e5e7eb]"
              )}
            >
              <span className="text-sm md:text-[15px] pl-1">{option}</span>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                isSelected && !isSubmitted ? "border-white bg-white/20" : "border-gray-300",
                isSubmitted && isCorrect ? "border-green-500 bg-green-500" : "",
                isSubmitted && isSelected && !isCorrect ? "border-red-500 bg-red-500" : ""
              )}>
                {isSelected && !isSubmitted && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                {isSubmitted && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleLocalSubmit}
        disabled={disabled || selectedOption === null || isSubmitted || isTimeout}
        className={cn(
          "w-full h-12 rounded-full font-black tracking-widest text-[11px] md:text-xs uppercase transition-all flex items-center justify-center mb-2",
          (disabled || selectedOption === null || isSubmitted || isTimeout)
            ? "bg-gray-200 text-gray-400 shadow-[0_4px_0_0_#d1d5db]"
            : "bg-slate-800 text-white shadow-[0_4px_0_0_#000000] hover:bg-slate-700 active:shadow-none active:translate-y-[4px]"
        )}
      >
        {isSubmitted ? "Checking..." : "Submit answer"}
      </button>
    </div>
  );
}
