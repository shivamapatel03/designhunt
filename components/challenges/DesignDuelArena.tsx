"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Flame, MessageCircle, Heart, User, Send } from "lucide-react";

export function DesignDuelArena() {
  const [duel, setDuel] = useState<any>(null);
  const [votedFor, setVotedFor] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/duels")
      .then(res => res.json())
      .then(setDuel);
  }, []);

  if (!duel) return <div className="h-64 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"/></div>;

  const totalVotes = duel.contestants[0].votes + duel.contestants[1].votes;

  return (
    <div className="bg-black text-white rounded-[40px] border-4 border-accent-pink shadow-[12px_12px_0px_0px_#ff69b4] overflow-hidden relative">
      {/* Header */}
      <div className="p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-pink rounded-xl rotate-3">
                <Swords className="w-8 h-8 text-white" />
            </div>
            <div>
                <h2 className="text-2xl font-black uppercase tracking-widest italic">Live Arena</h2>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {duel.viewers.toLocaleString()} Spectators
                </div>
            </div>
        </div>
        
        <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 text-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Current Prompt</div>
            <div className="text-xl font-black text-accent-yellow">{duel.prompt}</div>
        </div>

        <div className="font-mono text-3xl font-black text-white/50">{duel.timeLeft}</div>
      </div>

      {/* Battle Ground */}
      <div className="grid lg:grid-cols-2 h-[500px] relative">
          {duel.contestants.map((contestant: any, idx: number) => {
             const percent = Math.round((contestant.votes / totalVotes) * 100);
             const isBlue = idx === 0;

             return (
                 <div key={contestant.id} className={`relative p-8 flex flex-col justify-between border-b lg:border-b-0 ${isBlue ? 'lg:border-r border-white/10' : ''}`}>
                     {/* Contestant Info */}
                     <div className="flex items-center gap-4 z-10">
                         <img src={contestant.avatar} className={`w-14 h-14 rounded-full border-2 ${isBlue ? 'border-accent-blue' : 'border-accent-pink'}`} />
                         <div>
                             <div className="font-black text-lg">{contestant.name}</div>
                             <div className="text-xs font-bold text-gray-500 uppercase">{contestant.handle}</div>
                         </div>
                     </div>

                     {/* Mock Canvas Area */}
                     <div className="absolute inset-0 top-24 bottom-24 m-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden group">
                         <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
                             <div className="text-4xl mb-2">🎨</div>
                             <div className="text-xs font-bold uppercase tracking-widest">Live Design Feed</div>
                             <div className="text-[10px] text-gray-500">Signal Lost (Mock)</div>
                         </div>
                     </div>

                     {/* Voting Controls */}
                     <div className="z-10 mt-auto pt-6">
                         <div className="flex justify-between items-end mb-2">
                             <div className={`text-4xl font-black ${isBlue ? 'text-accent-blue' : 'text-accent-pink'}`}>{percent}%</div>
                             <button 
                                onClick={() => setVotedFor(contestant.id)}
                                disabled={!!votedFor}
                                className={`px-6 py-2 rounded-xl font-black text-sm uppercase tracking-wider transition-all
                                    ${votedFor === contestant.id 
                                        ? 'bg-white text-black ring-2 ring-white' 
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                    }
                                `}
                             >
                                 {votedFor === contestant.id ? 'Voted' : 'Vote'}
                             </button>
                         </div>
                         <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                className={`h-full ${isBlue ? 'bg-accent-blue' : 'bg-accent-pink'}`}
                             />
                         </div>
                     </div>
                 </div>
             )
          })}
          
          {/* VS Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black border-4 border-white rounded-full flex items-center justify-center font-black italic text-xl z-20 shadow-xl">
              VS
          </div>
      </div>

      {/* Live Chat Ticker */}
      <div className="bg-black border-t border-white/10 p-4 overflow-hidden">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {duel.chat.map((msg: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-gray-400">{msg.user}:</span>
                      <span className="text-white">{msg.message}</span>
                  </div>
              ))}
               {duel.chat.map((msg: any, i: number) => (
                  <div key={`d-${i}`} className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-gray-400">{msg.user}:</span>
                      <span className="text-white">{msg.message}</span>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
