"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Trophy, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { playClickSound, playSuccessSound } from "@/lib/audio";

interface Duel {
  id: string;
  title: string;
  description: string;
  option_a_label: string;
  option_a_image: string;
  option_b_label: string;
  option_b_image: string;
  category: string;
  votes: {
    a: number;
    b: number;
    total: number;
  };
}

export function DailyDuel() {
  const [duel, setDuel] = useState<Duel | null>(null);
  const [loading, setLoading] = useState(true);
  const [votedChoice, setVotedChoice] = useState<"A" | "B" | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  /* Sounds handled via utility */

  useEffect(() => {
    fetchDuel();
    // Check local storage for previous vote
    const storedVote = localStorage.getItem("daily_duel_vote");
    if (storedVote) {
       try {
           const votes = JSON.parse(storedVote);
           // We'll check inside fetchDuel once we have the ID (or just rely on the stored object logic below)
       } catch (e) {}
    }
  }, []);

  const fetchDuel = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/duels/daily");
      if (!res.ok) throw new Error("Failed to fetch duel");
      const data = await res.json();
      setDuel(data);
      
      // Check if already voted for *this* duel
      const stored = localStorage.getItem("daily_duel_vote");
      if (stored) {
          const votes = JSON.parse(stored);
          if (votes[data.id]) {
              setVotedChoice(votes[data.id]);
          }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (choice: "A" | "B") => {
    if (votedChoice || isVoting || !duel) return;
    setIsVoting(true);
    playClickSound();

    // Trigger Confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#000000', '#FFFFFF'] // Gold, Black, White theme
    });

    setTimeout(() => playSuccessSound(), 500);

    try {
      // Optimistic update
      setDuel(prev => {
          if (!prev) return null;
          return {
              ...prev,
              votes: {
                  ...prev.votes,
                  [choice.toLowerCase()]: prev.votes[choice.toLowerCase() as 'a'|'b'] + 1,
                  total: prev.votes.total + 1
              }
          }
      });
      setVotedChoice(choice);

      // Persist to local storage
      const stored = localStorage.getItem("daily_duel_vote");
      const votes = stored ? JSON.parse(stored) : {};
      votes[duel.id] = choice;
      localStorage.setItem("daily_duel_vote", JSON.stringify(votes));

      await fetch(`http://localhost:5000/api/duels/${duel.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice }),
      });
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) return <DuelSkeleton />;
  if (!duel) return null;

  const percentA = duel.votes.total === 0 ? 50 : Math.round((duel.votes.a / duel.votes.total) * 100);
  const percentB = duel.votes.total === 0 ? 50 : Math.round((duel.votes.b / duel.votes.total) * 100);

  return (
    <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 relative overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                 <div className="bg-yellow-400 p-2 border-2 border-black rounded-lg">
                    <Trophy className="w-6 h-6 text-black" />
                 </div>
                 <div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Daily Duel</h2>
                    <p className="text-sm font-bold text-gray-500">{duel.category}</p>
                 </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase bg-black text-white px-3 py-1 rounded-full">
                <Timer className="w-3 h-3" />
                <span>Ends in 12h</span>
            </div>
        </div>

        {/* Question */}
        <h3 className="text-xl font-bold mb-6">{duel.description}</h3>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 flex-1">
            <DuelOption 
                label={duel.option_a_label}
                image={duel.option_a_image}
                choice="A"
                selected={votedChoice === "A"}
                disabled={!!votedChoice}
                percent={percentA}
                showResult={!!votedChoice}
                onClick={() => handleVote("A")}
            />
            <DuelOption 
                label={duel.option_b_label}
                image={duel.option_b_image}
                choice="B"
                selected={votedChoice === "B"}
                disabled={!!votedChoice}
                percent={percentB}
                showResult={!!votedChoice}
                onClick={() => handleVote("B")}
            />
        </div>
        
        {/* Total Votes Footer */}
        <div className="text-center">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                {duel.votes.total.toLocaleString()} Community Votes
            </p>
        </div>
    </div>
  );
}

function DuelOption({ 
    label, 
    image, 
    choice, 
    selected, 
    disabled, 
    percent, 
    showResult, 
    onClick 
}: { 
    label: string, 
    image: string, 
    choice: "A" | "B", 
    selected: boolean, 
    disabled: boolean, 
    percent: number, 
    showResult: boolean, 
    onClick: () => void 
}) {
    return (
        <motion.button 
            whileHover={!disabled ? { y: -4, boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" } : {}}
            whileTap={!disabled ? { y: 0, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" } : {}}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "group relative rounded-2xl border-2 border-black overflow-hidden transition-all h-full flex flex-col text-left",
                selected && "ring-4 ring-yellow-400 ring-offset-2"
            )}
        >
            {/* Image Area */}
            <div className="relative h-32 w-full bg-gray-100 border-b-2 border-black">
                <img src={image} alt={label} className="w-full h-full object-cover" />
                
                {/* Overlay Result */}
                <AnimatePresence>
                    {showResult && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col text-white"
                        >
                            <span className="text-3xl font-black">{percent}%</span>
                            {selected && <CheckCircle2 className="w-6 h-6 mt-1 text-green-400" />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Label Area */}
            <div className="p-3 bg-white flex-1 w-full flex items-center justify-between">
                <span className="font-bold text-sm text-left">{label}</span>
                <span className={cn(
                    "w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-xs font-black",
                    selected ? "bg-black text-white" : "bg-gray-100"
                )}>
                    {choice}
                </span>
            </div>
            
            {/* Progress Bar Background (Optional advanced visual, keeping simple for now) */}
        </motion.button>
    )
}

function DuelSkeleton() {
    return (
        <div className="bg-white rounded-3xl border-4 border-black p-6 h-full animate-pulse">
            <div className="h-8 w-1/3 bg-gray-200 rounded mb-6" />
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-2 gap-4">
                <div className="h-40 bg-gray-200 rounded-2xl" />
                <div className="h-40 bg-gray-200 rounded-2xl" />
            </div>
        </div>
    )
}
