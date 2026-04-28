"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, Zap, Target, Trophy, Play, RefreshCw, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ListenButton } from "@/components/ui/ListenButton";

const AaLabel = ({ text, className = "" }: { text: string, className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <span className="text-[10px] font-semibold text-gray-400 tracking-wide">{text}</span>
  </div>
);

export default function TypographyIntroPage() {
  const params = useParams();
  const router = useRouter();
  const topicSlug = params.topic as string;
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedLevelsCount, setCompletedLevelsCount] = useState(0);
  const [totalLevelsCount, setTotalLevelsCount] = useState(42);
  const [progressPercent, setProgressPercent] = useState(0);
  const [userName, setUserName] = useState("Designer");
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Starting progress fetch for:", topicSlug);
      try {
        // Fetch topic data to calculate progress
        const res = await fetch(`/api/learning/topic/${topicSlug}`, {
          cache: 'no-store',
          credentials: 'include'
        });
        const data = await res.json();
        console.log("Topic Data Response:", data);
        
        if (data.levels) {
          const allSections = data.levels.flatMap((l: any) => l.sections);
          const totalSectionsCount = allSections.length;
          const completedSectionsCount = allSections.filter((s: any) => s.progress_status === 'completed').length;
          
          console.log(`Debug Settings: Total Sections=${totalSectionsCount}, Completed Sections=${completedSectionsCount}`);
          
          const levelsCount = data.levels.length;
          const completedFullLevels = data.levels.filter((level: any) => 
            level.sections.length > 0 && level.sections.every((section: any) => section.progress_status === 'completed')
          ).length;
          
          setTotalLevelsCount(levelsCount);
          setCompletedLevelsCount(completedFullLevels);
          
          // Use sections for progress percentage
          const percent = totalSectionsCount > 0 ? Math.round((completedSectionsCount / totalSectionsCount) * 100) : 0;
          setProgressPercent(percent);
          
          console.log(`Current State: isReturningUser=${completedSectionsCount > 0}, progress=${percent}%`);
          
          if (completedSectionsCount > 0) {
            setIsReturningUser(true);
            setCurrentStep(-1); // Welcome back screen
          }
        } else {
            console.warn("No levels found in topic data");
        }

        // Fetch user name
        const meRes = await fetch(`/api/auth/me`, { credentials: 'include' });
        const meData = await meRes.json();
        if (meData.user) {
          setUserName(meData.user.name.split(' ')[0]);
        }
      } catch (err) {
        console.error("Progress Fetch Critical Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicSlug]);

  const nextStep = () => {
    if (currentStep === -1 || currentStep === 2) {
      router.push(`/theory/learning/${topicSlug}`);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-black opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black selection:text-white overflow-hidden pt-6 relative">
      <Navbar />
      
      <div className="absolute top-24 right-6 z-50">
         <ListenButton 
           text="Welcome to your learning journey. Let's explore the fundamentals of design together."
           variant="full"
         />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-black/5 z-40 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${currentStep === -1 ? 100 : ((currentStep + 1) / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="h-full bg-black"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full text-center"
        >
          {currentStep === -1 && (
            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="mb-6">
                <AaLabel text="Welcome back" className="mb-2 justify-center" />
                <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                  Hi, {userName}!
                </h1>
                <p className="text-gray-400 text-xs font-medium italic">Ready to continue your journey?</p>
              </div>

              <div className="w-full bg-white border border-black p-6 rounded-2xl mb-8 relative overflow-hidden">
                 {/* Progress stats */}
                 <div className="flex justify-between items-end mb-4">
                    <div className="text-left">
                       <span className="text-[9px] font-semibold text-gray-400 tracking-widest block mb-1">Mastery</span>
                       <h2 className="text-2xl font-semibold text-black">{completedLevelsCount}<span className="text-gray-200 ml-1">/ {totalLevelsCount}</span></h2>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-semibold text-black tracking-widest block mb-1">Progress</span>
                       <h2 className="text-lg font-semibold text-black">{progressPercent}%</h2>
                    </div>
                 </div>
                 
                 {/* Progress bar background */}
                 <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                      className="h-full bg-black rounded-full"
                    />
                 </div>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-[240px]">
                <button 
                  onClick={nextStep}
                  className="group py-3 bg-black text-white font-semibold text-xs rounded-full hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Play className="w-3 h-3 fill-white" /> Let's go
                </button>
                <button 
                  onClick={() => setCurrentStep(0)}
                  className="py-2 text-[9px] font-semibold text-gray-400 hover:text-black transition-colors tracking-widest flex items-center justify-center gap-2"
                >
                  View intro again
                </button>
              </div>
            </div>
          )}

          {currentStep === 0 && (
            <div className="flex flex-col items-center max-w-sm">
              <div className="mb-8 flex flex-col items-center">
                <AaLabel text="Step 1 of 3" className="mb-1" />
                <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight leading-none">
                  Typography <span className="text-gray-400 ml-2">advanced</span>
                </h1>
                <p className="text-gray-500 text-xs md:text-sm font-medium">
                  Master the art of professional type systems.
                </p>
              </div>

              <button 
                onClick={nextStep}
                className="group px-8 py-3 bg-black text-white font-semibold text-xs rounded-full hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
              >
                Let's begin <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex flex-col items-center max-w-sm">
              <div className="mb-6 flex flex-col items-center">
                <AaLabel text="Curriculum" className="mb-1" />
                <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                  42 Levels
                </h1>
                <p className="text-gray-500 text-xs font-medium">
                  Three difficulty tiers from normal to hard.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-8 w-full max-w-xs">
                <div className="p-3 bg-white border border-black rounded-xl">
                  <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Zap className="w-3 h-3 text-gray-400" />
                  </div>
                  <span className="text-[8px] font-semibold uppercase tracking-widest text-gray-400">Normal</span>
                </div>
                <div className="p-3 bg-white border border-black rounded-xl">
                  <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Target className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-[8px] font-semibold uppercase tracking-widest text-black">Medium</span>
                </div>
                <div className="p-3 bg-white border border-black rounded-xl">
                  <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Trophy className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-[8px] font-semibold uppercase tracking-widest text-black">Hard</span>
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="group px-8 py-3 bg-black text-white font-semibold text-xs rounded-full hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
              >
                Next <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col items-center max-w-sm">
              <div className="mb-6 flex flex-col items-center">
                <AaLabel text="The reward" className="mb-1" />
                <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                  Build your skill profile
                </h1>
                <p className="text-gray-500 text-xs font-medium">
                  Master professional design theory and track your growth.
                </p>
              </div>

              <div className="flex gap-2 justify-center mb-8">
                <div className="w-14 h-14 rounded-2xl border border-black/5 bg-gray-50 flex items-center justify-center">
                   <Target className="w-6 h-6 text-black/10" />
                </div>
                <div className="w-14 h-14 rounded-2xl border-2 border-black bg-white -translate-y-2 flex items-center justify-center shadow-lg">
                   <Zap className="w-6 h-6 text-black" />
                </div>
                <div className="w-14 h-14 rounded-2xl border border-black/5 bg-gray-50 flex items-center justify-center">
                   <Play className="w-6 h-6 text-black/10" />
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="group px-10 py-3.5 bg-black text-white font-semibold text-xs rounded-full hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
              >
                Enter mastery <Sparkles className="w-3 h-3" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="p-6 mt-auto text-center" />
    </div>
  );
}
