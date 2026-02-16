"use client";

import { motion } from "framer-motion";
import { Star, Timer, Trophy } from "lucide-react";

interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  time: string;
  avatar: string;
  isMaster: boolean;
}

interface SprintLeaderboardProps {
  entries: LeaderboardEntry[];
}

export function SprintLeaderboard({ entries }: SprintLeaderboardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent-yellow" /> Hall of Sprint
        </h3>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Live Ranking</span>
      </div>

      <div className="divide-y divide-white/5">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group"
          >
            <div className="w-6 text-center font-black italic text-gray-500 group-hover:text-accent-blue">
              #{index + 1}
            </div>
            
            <div className="w-10 h-10 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center font-black text-accent-blue text-xs relative">
              {entry.avatar}
              {entry.isMaster && (
                <div className="absolute -top-1 -right-1 bg-accent-yellow p-0.5 rounded-full border border-black">
                  <Star className="w-2 h-2 text-black fill-black" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white">{entry.name}</span>
                {entry.isMaster && (
                    <span className="px-1.5 py-0.5 rounded bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow text-[8px] font-black uppercase tracking-tighter">
                        Sprint Master
                    </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-gray-500">
                    <Star className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{entry.score} pts</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                    <Timer className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{entry.time}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
                <div className={`text-lg font-black italic ${index === 0 ? 'text-accent-yellow' : 'text-white'}`}>
                    {entry.score}
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
