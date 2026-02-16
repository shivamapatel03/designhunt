"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MatchCard } from "@/components/career/MatchCard";
import { JobCard } from "@/components/career/JobCard";
import { SkillBadgeSystem } from "@/components/career/SkillBadgeSystem";
import { Sparkles, ArrowRight, User, Rocket, MessageSquare, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";


export default function CareerPage() {
  const [startups, setStartups] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMatched, setHasMatched] = useState(false);
  const [lastMatch, setLastMatch] = useState<any>(null);

  useEffect(() => {
    fetch("/api/matchmaking")
      .then(res => res.json())
      .then(data => setStartups(data));

    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      setHasMatched(true);
      setLastMatch(startups[currentIndex]);
      setTimeout(() => setHasMatched(false), 3000);
    }
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-32 pb-24 relative overflow-hidden">
      {/* ... backgrounds */}

      <div className="container mx-auto max-w-7xl px-6">
        <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-black uppercase tracking-widest">
              <Rocket className="w-3 h-3" /> Career Accelerator
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">Career Hub</h1>
            <p className="text-xl text-gray-500 font-medium max-w-xl">
              Stop job hunting. Start mission matching. Swipe through high-growth startups or browse open roles below.
            </p>
          </div>
          
          <div className="flex gap-4">
               {/* ... stats cards */}
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Sidebar: Skill Dashboard */}
          <div className="lg:col-span-4 space-y-8 sticky top-32">
            {/* ... sidebar content */}
            <div className="bg-black text-white rounded-[32px] p-8 shadow-xl">
               <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 rounded-full bg-accent-pink border-2 border-white flex items-center justify-center text-2xl font-black shadow-lg">JD</div>
                   <div>
                       <h3 className="text-xl font-black">Junior Designer</h3>
                       <p className="text-gray-400 text-sm font-medium">Verified Talent</p>
                   </div>
               </div>
               
               <SkillBadgeSystem />
               
               <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
                   <Link href="/theory" className="flex items-center justify-between group p-3 hover:bg-white/5 rounded-xl transition-colors">
                       <span className="text-sm font-bold text-gray-400 group-hover:text-white">Master More Theory</span>
                       <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-accent-blue" />
                   </Link>
                   <Link href="/tools" className="flex items-center justify-between group p-3 hover:bg-white/5 rounded-xl transition-colors">
                       <span className="text-sm font-bold text-gray-400 group-hover:text-white">Learn Build Tools</span>
                       <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-accent-pink" />
                   </Link>
               </div>
            </div>

            <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {/* ... old school prep */}
                <h4 className="text-lg font-black mb-4">Old-School Prep</h4>
                <div className="grid grid-cols-1 gap-4">
                    <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-black transition-all text-left">
                        <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-black text-sm">Practice Interviews</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">Step-by-step prep</div>
                        </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-black transition-all text-left">
                        <div className="w-10 h-10 rounded-xl bg-accent-yellow/20 flex items-center justify-center text-yellow-600">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-black text-sm">Portfolio Review</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">AI Analysis</div>
                        </div>
                    </button>
                    
                    <Link href="/mentorship" className="flex items-center gap-3 p-4 bg-black text-white rounded-2xl border-2 border-black hover:scale-105 transition-all text-left shadow-lg">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-black text-sm">Find a Mentor</div>
                            <div className="text-[10px] text-white/60 font-bold uppercase">Book 1:1 Sessions</div>
                        </div>
                    </Link>
                </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-16">
            {/* Matchmaking Section */}
            <section>
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black uppercase italic">Startup Matchmaking</h3>
                    <div className="text-xs font-bold uppercase text-gray-400">Swipe to Apply</div>
                 </div>
                 <div className="relative h-[600px] w-full max-w-[500px] mx-auto">
                  <AnimatePresence>
                    {currentIndex < startups.length ? (
                      startups.slice(currentIndex, currentIndex + 2).reverse().map((startup, idx) => (
                        <MatchCard 
                          key={startup.id} 
                          startup={startup} 
                          onSwipe={handleSwipe}
                          isFront={idx === 1 || startups.length - currentIndex === 1}
                        />
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white border-4 border-black border-dashed rounded-[40px]"
                      >
                         {/* ... empty state */}
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Trophy className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">That's everyone!</h3>
                        <p className="text-gray-500 font-medium mb-8">You've swiped through all available missions.</p>
                        <button 
                          onClick={() => setCurrentIndex(0)}
                          className="px-8 py-4 bg-black text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all"
                        >
                          Restart Discovery
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
            </section>

            {/* Job Board Section */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black uppercase italic">Featured Positions</h3>
                    <Link href="#" className="text-xs font-bold uppercase text-black underline decoration-2 underline-offset-4">View All Roles</Link>
                </div>
                <div className="space-y-4">
                    {jobs.map((job, index) => (
                        <JobCard key={job.id} job={job} index={index} />
                    ))}
                </div>
            </section>
          </div>
        </div>
      </div>

      {/* Match Overlay */}
       <AnimatePresence>
        {hasMatched && lastMatch && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10001] bg-accent-pink/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white"
            >
                <motion.div
                    initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="flex justify-center -space-x-8">
                        <div className="w-32 h-32 rounded-full border-8 border-white bg-black flex items-center justify-center text-4xl font-black shadow-2xl">JD</div>
                        <div className="w-32 h-32 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-white">
                            <img src={lastMatch.image} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <motion.h2 
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="text-7xl font-black italic uppercase italic tracking-tighter"
                        >
                            IT'S A MATCH!
                        </motion.h2>
                        <p className="text-2xl font-bold opacity-80 uppercase tracking-widest">You & {lastMatch.name}</p>
                    </div>

                    <div className="pt-8 flex gap-4 justify-center">
                        <button className="px-10 py-5 bg-white text-accent-pink font-black rounded-2full uppercase tracking-widest hover:scale-110 transition-transform shadow-xl">Send Introduction</button>
                        <button onClick={() => setHasMatched(false)} className="px-10 py-5 bg-transparent border-2 border-white font-black rounded-2full uppercase tracking-widest hover:bg-white/10 transition-colors">Keep Swiping</button>
                    </div>
                </motion.div>
                
                <SparkleBurst />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 22V18" />
      <path d="M14 22V18" />
      <path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
    </svg>
  )
}

function SparkleBurst() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ 
                        opacity: 0, 
                        scale: 0,
                        x: "50%",
                        y: "50%"
                    }}
                    animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0.5],
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: i * 0.1
                    }}
                    className="absolute"
                >
                    <Sparkles className="w-8 h-8 text-white/40" />
                </motion.div>
            ))}
        </div>
    );
}
