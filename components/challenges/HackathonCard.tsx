"use client";

import { motion } from "framer-motion";
import { Calendar, Users, Trophy, ExternalLink, Bell, BellOff } from "lucide-react";
import { useState } from "react";

interface HackathonCardProps {
  title: string;
  organizer: string;
  date: string;
  prizes: string;
  participants: string;
  tags: string[];
  url: string;
  isClosingSoon?: boolean;
}

export function HackathonCard({ 
  title, 
  organizer, 
  date, 
  prizes, 
  participants, 
  tags, 
  url, 
  isClosingSoon 
}: HackathonCardProps) {
  const [isReminded, setIsReminded] = useState(false);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-full"
    >
      {isClosingSoon && (
        <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-accent-pink text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse border-2 border-black">
          Closing Soon
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-black flex items-center justify-center font-black text-xl italic group-hover:bg-accent-yellow transition-colors">
            {organizer.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{organizer}</h4>
            <h3 className="text-xl font-black leading-tight group-hover:text-accent-blue transition-colors">{title}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-600 uppercase">
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Calendar className="w-4 h-4 text-accent-blue" />
            {date}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Trophy className="w-4 h-4 text-accent-yellow" />
            {prizes}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Users className="w-4 h-4 text-accent-pink" />
            {participants}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t-2 border-gray-100 mt-auto">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white font-black text-sm rounded-xl hover:opacity-90 transition-opacity"
          >
            REGISTER <ExternalLink className="w-4 h-4" />
          </a>
          <button 
            onClick={() => setIsReminded(!isReminded)}
            className={`w-12 flex items-center justify-center rounded-xl border-2 border-black transition-colors ${
              isReminded ? 'bg-accent-yellow' : 'bg-white hover:bg-gray-50'
            }`}
          >
            {isReminded ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
