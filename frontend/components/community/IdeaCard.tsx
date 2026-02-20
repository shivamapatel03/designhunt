"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { InlineComments } from "./InlineComments";
import { ReactionPicker, REACTIONS } from "./ReactionPicker";
import { EditIdeaModal } from "./EditIdeaModal";
import { Edit2, MoreHorizontal } from "lucide-react";

export function IdeaCard({ idea, small }: { idea: any, small?: boolean }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(idea.liked || false);
    const [likesCount, setLikesCount] = useState(idea.likes_count || 0);
    const [commentsCount, setCommentsCount] = useState(idea.comments_count || 0);
    const [showComments, setShowComments] = useState(false);
    const [reactionType, setReactionType] = useState<string | null>(idea.liked ? (idea.reaction_type || 'heart') : null);
    const [showReactions, setShowReactions] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const reactionTimer = useRef<any>(null);

    const timeAgo = new Date(idea.created_at).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

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
        setShowReactions(false);

        try {
            const res = await fetch(`/api/ideas/${idea.id}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user_id: user?.id || "GUEST",
                    type: type 
                })
            });
            if (!res.ok) throw new Error();
        } catch (error) {
            // Revert on error
            setLiked(liked);
            setReactionType(reactionType);
            toast.error("Failed to update reaction.");
        } finally {
            setIsLiking(false);
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/community?idea=${idea.id}`;
        if (navigator.share) {
            navigator.share({
                title: "Check out this design spark on Design-Hunt!",
                text: idea.idea,
                url: url
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        }
    };

    const handleDelete = async () => {
        if (!user || !confirm("Are you sure you want to remove this design spark?")) return;

        try {
            const res = await fetch(`/api/ideas/${idea.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id })
            });
            if (res.ok) {
                toast.success("Design spark removed.");
                window.location.reload(); 
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to delete idea.");
            }
        } catch (error) {
            toast.error("An error occurred while deleting.");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group bg-white border-2 border-black rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden",
                small ? "p-4" : "p-5"
            )}
        >
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-black bg-accent-yellow flex items-center justify-center font-black text-xs overflow-hidden shadow-sm">
                            {idea.user_avatar ? (
                                <img src={idea.user_avatar} alt={idea.user_handle} className="w-full h-full object-cover" />
                            ) : (
                                idea.user_handle?.charAt(0).toUpperCase() || "A"
                            )}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-black text-sm truncate max-w-[120px]">
                                {idea.user_handle || "Anonymous"}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                • {timeAgo}
                            </span>
                        </div>
                    </div>

                    {user?.id === idea.user_id && (
                        <div className="flex gap-1">
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="p-1 text-gray-300 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="p-1 text-gray-300 hover:text-accent-red hover:bg-accent-red/5 rounded-lg transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Text Body */}
                <p className={cn(
                    "text-gray-700 font-medium leading-relaxed mb-4 whitespace-pre-wrap break-words",
                    small ? "text-sm" : "text-[15px]"
                )}>
                    {idea.idea}
                </p>

                {/* Image */}
                {idea.image && (
                    <div className="mb-4 rounded-xl overflow-hidden border-2 border-black max-w-2xl">
                        <img src={idea.image} className="w-full h-auto max-h-[400px] object-cover" alt="Spark" />
                    </div>
                )}

                {/* Action Bar (LinkedIn style: Like, Comment, Share) */}
                <div className="flex items-center gap-1 pt-2 border-t border-black/5">
                    <div 
                        className="relative"
                        onMouseEnter={() => {
                            if (reactionTimer.current) clearTimeout(reactionTimer.current);
                            setShowReactions(true);
                        }}
                        onMouseLeave={() => {
                            reactionTimer.current = setTimeout(() => setShowReactions(false), 500);
                        }}
                    >
                        <ReactionPicker 
                            isVisible={showReactions} 
                            onSelect={(type) => handleLike(type)} 
                        />
                        <button 
                            onClick={() => handleLike(reactionType || 'heart')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95", 
                                liked ? "bg-accent-yellow/10" : "text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            <motion.div
                                animate={liked ? { scale: [1, 1.4, 1] } : {}}
                                transition={{ duration: 0.3 }}
                                className={cn(liked ? (REACTIONS.find(r => r.type === reactionType)?.color || "text-accent-red") : "text-gray-400")}
                            >
                                {liked && reactionType ? (
                                    (() => {
                                        const R = REACTIONS.find(r => r.type === reactionType);
                                        return R ? <R.icon className="w-4 h-4 fill-current" /> : <Heart className="w-4 h-4" />;
                                    })()
                                ) : (
                                    <Heart className="w-4 h-4" />
                                )}
                            </motion.div>
                            <span className={cn(liked ? "text-black" : "text-gray-500")}>
                                {likesCount > 0 && likesCount} Like
                            </span>
                        </button>
                    </div>

                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors",
                            showComments ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        <MessageCircle className={cn("w-4 h-4", showComments ? "fill-white" : "fill-none")} />
                        {commentsCount} <span className="hidden sm:inline">Comments</span>
                    </button>
                    
                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-xl font-bold text-xs transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                    </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-4"
                        >
                            <div className="pl-4 border-l-2 border-black/5">
                                <InlineComments 
                                    ideaId={idea.id} 
                                    user={user} 
                                    onCommentAdded={() => setCommentsCount((prev: number) => prev + 1)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isEditModalOpen && (
                    <EditIdeaModal 
                        idea={idea} 
                        user={user} 
                        onClose={() => setIsEditModalOpen(false)} 
                        onSuccess={() => {
                            setIsEditModalOpen(false);
                            window.location.reload();
                        }} 
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
