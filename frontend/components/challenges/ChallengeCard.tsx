"use client";

import { motion } from "framer-motion";
import { Zap, Trophy, BarChart } from "lucide-react";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  category: string;
}

export function ChallengeCard({ 
  id,
  title, 
  description, 
  difficulty,
  points,
  category
}: ChallengeCardProps) {
  
  const difficultyColor = 
    difficulty === 'Easy' ? 'text-green-600 bg-green-100' :
    difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
    'text-red-600 bg-red-100';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-full"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-gray-100 border border-black px-2 py-1 rounded-md text-xs font-bold uppercase">
              {category}
          </div>
          <div className={`px-2 py-1 rounded-md text-xs font-bold uppercase border border-black ${difficultyColor}`}>
              {difficulty}
          </div>
        </div>

        <h3 className="text-xl font-black leading-tight mb-2 group-hover:text-accent-blue transition-colors">{title}</h3>
        <p className="text-sm text-gray-600 mb-6 flex-grow">{description}</p>

        <div className="pt-4 border-t-2 border-gray-100 mt-auto flex justify-between items-center">
           <div className="flex items-center gap-2 font-bold text-sm">
             <Trophy className="w-4 h-4 text-accent-yellow" />
             <span>{points} XP</span>
           </div>
           
           <button className="px-4 py-2 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
             Start <Zap className="w-4 h-4" />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
