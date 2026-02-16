"use client";

import { ExternalLink, ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ToolCardProps {
  name: string;
  category: string;
  description: string;
  url: string;
  icon?: ReactNode;
  color?: string; // Tailwind bg color class
  pricing: "Free" | "Freemium" | "Premium";
  index?: number;
}

export function ToolCard({ name, category, description, url, icon, color = "bg-black", pricing, index = 0 }: ToolCardProps) {
  return (
    <motion.a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group flex flex-col p-6 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_#000] transition-all h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-20 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-full blur-2xl -mr-10 -mt-10" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-white shadow-sm group-hover:rotate-6 transition-transform ${color}`}>
            {icon ? (
                typeof icon === 'string' ? <img src={icon} alt={name} className="w-6 h-6 object-contain invert bg-white rounded-full p-0.5" /> : icon
            ) : (
                 <span className="font-bold text-lg">{name.substring(0,2)}</span>
            )}
        </div>
        <div className="flex flex-col items-end gap-1">
            <div className="bg-gray-100 border border-black px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                {category}
            </div>
            <div className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-black border border-black ${
                pricing === 'Free' ? 'bg-green-100 text-green-700' :
                pricing === 'Freemium' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
            }`}>
                {pricing}
            </div>
        </div>
      </div>

      <h3 className="text-xl font-black mb-2 flex items-center gap-2 relative z-10">
        {name} 
        <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent-purple" />
      </h3>
      <p className="text-sm text-gray-600 mb-6 flex-grow font-medium relative z-10 leading-relaxed">
        {description}
      </p>

      <div className="mt-auto relative z-10">
        <div className="w-full font-black text-sm text-center py-3 border-2 border-black rounded-xl bg-white group-hover:bg-black group-hover:text-white transition-all flex items-center justify-center gap-2">
            Visit Website <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </motion.a>
  );
}
