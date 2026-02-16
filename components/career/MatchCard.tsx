"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { X, Heart, MapPin, Briefcase, Quote, Star } from "lucide-react";
import { useState } from "react";

interface Startup {
  id: string;
  name: string;
  mission: string;
  industry: string;
  location: string;
  tags: string[];
  requiredSkills: string[];
  image: string;
  role: string;
  equity: string;
}

interface MatchCardProps {
  startup: Startup;
  onSwipe: (dir: "left" | "right") => void;
  isFront: boolean;
}

export function MatchCard({ startup, onSwipe, isFront }: MatchCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: isFront ? 10 : 0 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 w-full h-full bg-white border-4 border-black rounded-[40px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col ${!isFront && 'scale-95 opacity-50'}`}
    >
      {/* Visual Feedback Overlays */}
      <motion.div 
        style={{ opacity: likeOpacity }} 
        className="absolute top-10 right-10 z-20 border-4 border-green-500 rounded-xl px-6 py-2 rotate-12"
      >
        <span className="text-4xl font-black text-green-500 uppercase">Mission!</span>
      </motion.div>
      <motion.div 
        style={{ opacity: nopeOpacity }} 
        className="absolute top-10 left-10 z-20 border-4 border-red-500 rounded-xl px-6 py-2 -rotate-12"
      >
        <span className="text-4xl font-black text-red-500 uppercase">Skip</span>
      </motion.div>

      {/* Hero Image */}
      <div className="relative h-2/5 overflow-hidden">
        <img src={startup.image} alt={startup.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8 text-white">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-1">{startup.name}</h3>
            <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                <MapPin className="w-4 h-4" /> {startup.location}
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent-blue bg-accent-blue/5 border border-accent-blue/10 px-3 py-1 rounded-full w-fit">
                <Briefcase className="w-3 h-3" /> {startup.role}
            </div>
            
            <div className="relative">
                <Quote className="absolute -left-2 -top-2 w-8 h-8 text-gray-100 -z-1" />
                <p className="text-xl font-bold leading-tight relative z-1">{startup.mission}</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {startup.tags.map(tag => (
                   <span key={tag} className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-500">#{tag}</span>
                ))}
            </div>
        </div>

        <div className="pt-6 border-t-2 border-dashed border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <Star className="w-3 h-3 text-accent-yellow fill-accent-yellow" /> Ideal Candidate Skills
            </h4>
            <div className="flex flex-wrap gap-2">
                {startup.requiredSkills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-black text-white rounded-lg text-xs font-bold">{skill}</span>
                ))}
            </div>
        </div>
      </div>

      {/* Bottom Actions (Visual Only) */}
      <div className="p-8 pt-0 flex justify-center gap-6">
          <button 
            onClick={() => onSwipe("left")}
            className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
              <X className="w-8 h-8 text-red-500" />
          </button>
          <button 
            onClick={() => onSwipe("right")}
            className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center bg-black shadow-[4px_4px_0px_0px_#000,0_0_20px_rgba(255,105,180,0.3)] hover:scale-110 transition-all"
          >
              <Heart className="w-8 h-8 text-accent-pink fill-accent-pink" />
          </button>
      </div>
    </motion.div>
  );
}
