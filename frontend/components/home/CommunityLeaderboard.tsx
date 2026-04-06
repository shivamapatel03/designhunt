"use client";

import { motion } from "framer-motion";
import { Heart, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  ideas_count: number;
  total_likes: number;
}

export function CommunityLeaderboard({ creators }: { creators: Creator[] }) {
  if (!creators?.length) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <section className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        <div className="text-center mb-16 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4 font-clash tracking-tight"
          >
            Top Creators
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-medium font-clash"
          >
            The driving force behind our community's best ideas.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto space-y-4 relative z-10"
        >
          {creators.map((creator, index) => {
            const isTop3 = index < 3;
            // Rank colors
            const rankStyles = [
              "bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 border-yellow-200", // 1st Gold
              "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800 border-gray-100",   // 2nd Silver
              "bg-gradient-to-br from-orange-200 to-orange-400 text-orange-900 border-orange-100", // 3rd Bronze
            ];

            return (
              <motion.div 
                key={creator.id}
                variants={itemVariants}
                className={cn(
                  "flex items-center justify-between p-4 md:p-6 bg-white border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group",
                  isTop3 ? "md:py-8" : ""
                )}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  {/* Rank Badge */}
                  <div className={cn(
                    "flex items-center justify-center font-black rounded-2xl flex-shrink-0 transition-transform group-hover:scale-105",
                    isTop3 ? "w-12 h-12 md:w-16 md:h-16 text-xl md:text-2xl " + rankStyles[index] : "w-10 h-10 md:w-12 md:h-12 bg-gray-50 text-gray-400 text-lg border border-gray-100"
                  )}>
                    #{index + 1}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-gray-400 overflow-hidden shadow-sm flex-shrink-0",
                      isTop3 ? "w-14 h-14 md:w-16 md:h-16" : "w-12 h-12"
                    )}>
                      {creator.avatar ? (
                        <img src={creator.avatar} alt={creator.handle} className="w-full h-full object-cover" />
                      ) : (
                        (creator.name || creator.handle)?.charAt(0).toUpperCase() || "A"
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className={cn("font-bold text-gray-900 truncate", isTop3 ? "text-lg md:text-xl" : "text-base")}>
                        {creator.name || creator.handle}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium truncate">@{creator.handle}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 md:gap-10 pr-2 flex-shrink-0">
                  <div className="flex flex-col items-center">
                     <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-blue-500 transition-colors">
                        <Lightbulb className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="font-black text-gray-900 text-base md:text-xl">{creator.ideas_count}</span>
                     </div>
                     <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Ideas</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        <span className="font-black text-gray-900 text-base md:text-xl">{creator.total_likes}</span>
                     </div>
                     <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Likes</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
