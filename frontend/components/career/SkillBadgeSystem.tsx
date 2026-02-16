"use client";

import { motion } from "framer-motion";
import { Award, Zap, Type, Layout, Palette, Beaker } from "lucide-react";

const BADGES = [
  { id: "gestalt", name: "Gestalt Guru", icon: Layout, color: "bg-accent-blue/10 text-accent-blue border-accent-blue/20" },
  { id: "kerning", name: "Kerning King", icon: Type, color: "bg-accent-pink/10 text-accent-pink border-accent-pink/20" },
  { id: "sprint", name: "Sprint Master", icon: Zap, color: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20" },
  { id: "color", name: "Color Mystic", icon: Palette, color: "bg-purple-100 text-purple-600 border-purple-200" },
  { id: "theory", name: "Theory Titan", icon: Beaker, color: "bg-green-100 text-green-600 border-green-200" },
];

export function SkillBadgeSystem() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-gray-400" />
        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Mastered Skills</h4>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {BADGES.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 font-bold text-xs ${badge.color} shadow-sm cursor-help`}
          >
            <badge.icon className="w-3.5 h-3.5" />
            {badge.name}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
