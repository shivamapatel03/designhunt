"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Trophy, Flame, ChevronRight } from "lucide-react";
import Link from "next/link";

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  category: string;
  expires_at: string;
}

export function DailyChallengeHero() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDaily() {
      try {
        const res = await fetch("/api/challenges/daily");
        if (res.ok) {
          const data = await res.json();
          setChallenge(data);
        }
      } catch (error) {
        console.error("Failed to fetch daily challenge", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDaily();
  }, []);

  useEffect(() => {
    if (!challenge?.expires_at) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(challenge.expires_at).getTime();
      const distance = expiry - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [challenge]);

  if (loading) return <div className="h-64 bg-gray-100 rounded-3xl animate-pulse" />;
  if (!challenge) return null; // Or show a specific "No active challenge" state

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black text-white rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_#000] border-2 border-black relative overflow-hidden mb-16"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-sm font-bold text-accent-yellow mb-6">
            <Flame className="w-4 h-4 fill-current" />
            DAILY CHALLENGE
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            {challenge.title}
          </h2>
          
          <p className="text-lg text-gray-400 mb-8 max-w-xl">
            {challenge.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/challenges/${challenge.id}`}
              className="px-8 py-4 bg-white text-black font-black text-lg rounded-xl hover:bg-gray-100 transition-transform active:scale-95 flex items-center gap-2"
            >
              Start Challenge <ChevronRight className="w-5 h-5" />
            </Link>
            
            <div className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl font-mono text-lg font-bold flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent-blue" />
              <span>{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Stats / Rewards */}
        <div className="w-full md:w-80 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Rewards & Stats</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-yellow rounded-xl flex items-center justify-center text-black">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{challenge.points} XP</p>
                <p className="text-sm text-gray-400">Completion Reward</p>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Difficulty</span>
              <span className={`font-bold px-2 py-1 rounded ${
                challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {challenge.difficulty}
              </span>
            </div>
             <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Category</span>
              <span className="font-bold text-white">{challenge.category}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
