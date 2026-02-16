"use client";

import { motion } from "framer-motion";

interface SocialProofProps {
  count: number;
  recentUsers: { name: string; avatar: string }[];
}

export function SocialProof({ count, recentUsers }: SocialProofProps) {
  // Use recentUsers if available, otherwise just use count logic or fallback
  // For the demo we use whatever we get. 
  // If count < 4, we might not have enough avatars to show, but that's fine.

  // We want to show up to 4 avatars. If we have fewer real users, fill with placeholders?
  // Let's just show up to 4 real users.
  
  const displayUsers = recentUsers.slice(0, 4);
  const displayCount = count > 10000 ? '10k+' : `${count}+`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex items-center gap-4 text-sm font-semibold text-gray-500 pt-6 border-t border-gray-100"
    >
      <div className="flex -space-x-3">
         {displayUsers.map((user, i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm overflow-hidden bg-gray-200 relative">
                {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-black">{user.name.charAt(0)}</span>
                )}
            </div>
         ))}
         
         {/* If we have more than 4, show the overflow counter or a generic + icon if we didn't fill 4 avatars */}
         {/* The original design had 4 circles. 3 colored, one black with "10k+". Let's mimic that if we have few users */}
         {displayUsers.length < 4 && Array.from({ length: 4 - displayUsers.length }).map((_, i) => (
            <div key={`placeholder-${i}`} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                i === 0 ? 'bg-accent-blue' : i === 1 ? 'bg-accent-pink' : 'bg-accent-yellow text-black'
            }`}>
                {/* Empty placeholders for style */}
            </div>
         ))}

         {/* The count bubble */}
         <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm bg-black">
            {displayCount}
         </div>
      </div>
      <div className="flex flex-col">
         <span className="text-black font-black uppercase tracking-tighter italic">Joined by {count > 10000 ? '10,000+' : count} Students</span>
         <span className="text-xs font-bold text-gray-400">Rated 4.9/5 by beginners</span>
      </div>
    </motion.div>
  );
}
