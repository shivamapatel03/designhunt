"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Trash2, Edit2, Play, Users, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { InlineComments } from "./InlineComments";
import { REACTIONS } from "./ReactionPicker";

export function PostDetailModal({ post, onClose, onUpdate }: { post: any, onClose: () => void, onUpdate?: (updatedPost: any) => void }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(post.liked || false);
    const [reactionType, setReactionType] = useState<string | null>(post.liked ? (post.reaction_type || 'heart') : null);
    const [likesCount, setLikesCount] = useState(post.likes_count || 0);
    const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
    const [isLiking, setIsLiking] = useState(false);

    const handleLike = async (type: string = 'heart') => {
        if (isLiking) return;

        const isUnliking = liked && reactionType === type;
        const newLiked = !isUnliking;
        const newReactionType = isUnliking ? null : type;

        setLiked(newLiked);
        setReactionType(newReactionType);
        if (isUnliking) {
            setLikesCount((prev: number) => prev - 1);
        } else if (!liked) {
            setLikesCount((prev: number) => prev + 1);
        }
        
        setIsLiking(true);

        try {
            const res = await fetch(`/api/ideas/${post.id}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user_id: user?.id || "GUEST",
                    type: type 
                })
            });
            if (!res.ok) throw new Error();
            
            // Notify parent to sync feed
            onUpdate?.({
                ...post,
                liked: newLiked,
                reaction_type: newReactionType,
                likes_count: isUnliking ? likesCount - 1 : (!liked ? likesCount + 1 : likesCount)
            });
        } catch (error) {
            setLiked(liked);
            setReactionType(reactionType);
            toast.error("Failed to update reaction.");
        } finally {
            setIsLiking(false);
        }
    };

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
                    <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                                    {post.user_avatar ? (
                                        <img src={post.user_avatar} alt={post.user_handle} className="w-full h-full object-cover" />
                                    ) : (
                                        post.user_handle?.charAt(0).toUpperCase() || "A"
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-base text-gray-900 truncate">
                                        {post.idea?.split('\n')[0] || "Untitled Design"}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-500 truncate">
                                        {post.user_handle || "Anonymous"} 
                                        <span className="mx-2 bg-gray-100 text-gray-500 font-bold text-[9px] px-1.5 py-0.5 rounded tracking-widest leading-none mt-0.5 align-middle">PRO</span>
                                        • <span className="text-blue-500 font-bold hover:underline cursor-pointer ml-1">Follow</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-semibold transition-all">
                                    Save
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-full text-sm font-bold transition-all shadow-sm">
                                    Get in touch
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900 ml-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        <div className="space-y-6">
                            {/* Stats & Actions */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <button 
                                    onClick={() => handleLike(reactionType || 'heart')}
                                    disabled={isLiking}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm border border-transparent",
                                        liked ? "bg-red-50 text-red-500 border-red-100" : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                                    )}
                                >
                                    <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                                    <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                                </button>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-sm shadow-sm">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{commentsCount}</span>
                                </div>
                                <div className="flex-1" />
                                <div className="flex items-center gap-2 text-gray-500">
                                    <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm transition-colors">
                                        Share
                                    </button>
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none">
                                <p className="text-[15px] font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {post.idea}
                                </p>
                            </div>
                            
                            <div className="text-[12px] font-semibold tracking-wide text-gray-400 uppercase">
                                Published {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-xs uppercase tracking-wide text-gray-400 mb-4 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" /> Discussion Highlights
                            </h4>
                            <InlineComments 
                                ideaId={post.id} 
                                user={user} 
                                onCommentAdded={() => {
                                    setCommentsCount((prev: number) => prev + 1);
                                    onUpdate?.({
                                        ...post,
                                        comments_count: commentsCount + 1
                                    });
                                }}
                            />
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
