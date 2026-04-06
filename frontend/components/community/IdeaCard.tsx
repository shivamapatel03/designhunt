"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Play, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function IdeaCard({ idea, small, onClick }: { idea: any, small?: boolean, onClick?: () => void }) {
    // Determine time ago for tooltip or subtleness if needed
    const timeAgo = new Date(idea.created_at).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric'
    });

    // Formatting counts (e.g. 1500 -> 1.5k)
    const formatCount = (count: number) => {
        if (!count) return "0";
        if (count >= 1000) return (count / 1000).toFixed(1) + "k";
        return count.toString();
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex flex-col gap-3 relative cursor-pointer"
            onClick={onClick}
        >
            {/* Main Thumbnail Area */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative bg-gray-100/50">
                {idea.video ? (
                    <>
                        <video src={idea.video} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300" />
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-1.5 rounded-full">
                            <Play className="w-4 h-4 text-white fill-current" />
                        </div>
                    </>
                ) : idea.image ? (
                    <>
                        <img src={idea.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Idea" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300" />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-gray-50 to-gray-200">
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                        <p className="text-gray-800 font-bold text-lg md:text-xl leading-tight line-clamp-4 relative z-10">
                            {idea.idea}
                        </p>
                    </div>
                )}

                {/* Hover overlay text if it has media */}
                {(idea.video || idea.image) && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-white font-semibold text-lg line-clamp-1 drop-shadow-md">
                            {idea.idea}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Area */}
            <div className="flex items-center justify-between px-1">
                {/* User Info */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                        {idea.user_avatar ? (
                            <img src={idea.user_avatar} alt={idea.user_handle} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                                {idea.user_handle?.charAt(0).toUpperCase() || "A"}
                            </div>
                        )}
                    </div>
                    <span className="font-semibold text-sm text-gray-900 truncate max-w-[120px] hover:text-black hover:underline cursor-pointer">
                        {idea.user_handle || "Anonymous"}
                    </span>
                    <span className="bg-gray-100 text-gray-500 font-bold text-[9px] px-1.5 py-0.5 rounded tracking-widest leading-none mt-0.5">
                        PRO
                    </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-900 transition-colors">
                        <Heart className={cn("w-3.5 h-3.5", idea.liked ? "fill-red-500 text-red-500" : "")} />
                        <span className="text-xs font-semibold">{formatCount(idea.likes_count || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-900 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{formatCount(idea.comments_count || 0)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
