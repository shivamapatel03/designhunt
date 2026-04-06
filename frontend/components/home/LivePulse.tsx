'use client';

import { motion } from "framer-motion";
import { Sparkles, Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Idea {
    id: number;
    idea: string;
    image?: string;
    user_handle: string;
    likes_count: number;
    comments_count: number;
}

export function LivePulse({ ideas }: { ideas: Idea[] }) {
    if (!ideas || ideas.length === 0) return null;

    // Triple the ideas to ensure a seamless loop
    const displayIdeas = [...ideas, ...ideas, ...ideas];

    return (
        <section className="py-12 bg-black overflow-hidden border-y-4 border-black group">
            <div className="container mx-auto px-6 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25" />
                        <div className="w-3 h-3 bg-red-500 rounded-full relative" />
                    </div>
                    <h2 className="text-white font-black uppercase italic tracking-tighter text-2xl flex items-center gap-2">
                        The Live Pulse
                        <Sparkles className="w-5 h-5 text-accent-yellow" />
                    </h2>
                </div>
                <div className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                    What's buzzing in the tribe right now
                </div>
            </div>

            <div className="relative flex">
                <motion.div 
                    animate={{ x: [0, -300 * ideas.length] }}
                    transition={{ 
                        duration: ideas.length * 8, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatType: "loop"
                    }}
                    whileHover={{ animationPlayState: "paused" }} // This is a bit tricky with Framer, better to use hover state
                    className="flex gap-6 whitespace-nowrap py-4"
                >
                    {displayIdeas.map((idea, idx) => (
                        <motion.div 
                            key={`${idea.id}-${idx}`}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="w-[320px] h-[200px] bg-white rounded-[32px] p-8 flex flex-col justify-between border-4 border-black transition-all cursor-pointer shrink-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group/card"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-accent-yellow border-2 border-black flex items-center justify-center text-xs font-black shadow-[2px_2px_0px_0px_black]">
                                        {idea.user_handle?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest group-hover/card:text-black transition-colors">@{idea.user_handle || 'anonymous'}</span>
                                </div>
                                <p className="text-[13px] font-bold text-gray-900 leading-relaxed whitespace-normal line-clamp-3 italic">
                                    "{idea.idea}"
                                </p>
                            </div>

                            <div className="flex items-center gap-5 pt-5 border-t-2 border-gray-50">
                                <div className="flex items-center gap-2 text-red-500">
                                    <Heart className="w-4 h-4 fill-current animate-pulse-slow" />
                                    <span className="text-[11px] font-black">{idea.likes_count}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 group-hover/card:text-black transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="text-[11px] font-black">{idea.comments_count}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            
            {/* Custom Marquee Styling to prevent pause on hover by default (optional) */}
            <style jsx>{`
                .flex:hover .motion-div {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
