"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Trash2, Edit2, Play, Users, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { InlineComments } from "./InlineComments";
import { REACTIONS } from "./ReactionPicker";

export function PostDetailModal({ post, onClose }: { post: any, onClose: () => void }) {
    const { user } = useAuth();
    const [likesCount, setLikesCount] = useState(post.likes_count || 0);
    const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white border border-gray-200/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
                {/* Media Section - Left */}
                <div className="flex-[1.5] bg-gray-50 border-b border-gray-100 md:border-b-0 md:border-r relative overflow-hidden flex items-center justify-center">
                    {post.video ? (
                        <video src={post.video} controls className="w-full h-full object-contain bg-black" />
                    ) : post.image ? (
                        <img src={post.image} className="w-full h-full object-contain" alt="Spark" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center p-12 text-center">
                             <p className="text-2xl font-black uppercase text-gray-300">No Media</p>
                        </div>
                    )}
                </div>

                {/* Content Section - Right */}
                <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-sm overflow-hidden">
                                {post.user_avatar ? (
                                    <img src={post.user_avatar} alt={post.user_handle} className="w-full h-full object-cover" />
                                ) : (
                                    post.user_handle?.charAt(0).toUpperCase() || "A"
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-gray-900">{post.user_handle || "Anonymous"}</h3>
                                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Shared a design spark</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-50 rounded-full transition-colors border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-900"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="space-y-4">
                            {/* Action Bar - Top Pills */}
                            <div className="flex items-center gap-3 pt-2">
                                <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-black text-xs shadow-md">
                                    <MessageCircle className="w-4 h-4 fill-white" />
                                    <span>{commentsCount}</span>
                                </div>
                                <button 
                                    onClick={() => setLikesCount((prev: number) => prev + 1)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-transparent hover:border-gray-200 rounded-full font-bold text-xs text-gray-600 transition-all"
                                >
                                    <Heart className="w-4 h-4" />
                                    <span>{likesCount}</span>
                                </button>
                                <div className="flex-1" />
                                <div className="flex items-center gap-2 text-gray-400">
                                    <button className="p-2 hover:bg-gray-50 hover:text-gray-900 rounded-full transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-[15px] font-normal text-gray-700 leading-relaxed whitespace-pre-wrap pt-4">
                                {post.idea}
                            </p>
                            <div className="flex items-center gap-4 text-[11px] font-medium text-gray-400">
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-xs uppercase tracking-wide text-gray-400 mb-4 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" /> Discussion Highlights
                            </h4>
                            <InlineComments 
                                ideaId={post.id} 
                                user={user} 
                                onCommentAdded={() => setCommentsCount((prev: number) => prev + 1)}
                            />
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
