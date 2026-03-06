"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Trash2, Edit2, Play, MoreHorizontal, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { InlineComments } from "./InlineComments";
import { ReactionPicker, REACTIONS } from "./ReactionPicker";
import { EditIdeaModal } from "./EditIdeaModal";

export function IdeaCard({ idea, small, onClick }: { idea: any, small?: boolean, onClick?: () => void }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(idea.liked || false);
    const [likesCount, setLikesCount] = useState(idea.likes_count || 0);
    const [commentsCount, setCommentsCount] = useState(idea.comments_count || 0);
    const [reactionType, setReactionType] = useState<string | null>(idea.liked ? (idea.reaction_type || 'heart') : null);
    const [showReactions, setShowReactions] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [saved, setSaved] = useState(idea.saved || false);
    const [isSaving, setIsSaving] = useState(false);
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
            setLiked(liked);
            setReactionType(reactionType);
            toast.error("Failed to update reaction.");
        } finally {
            setIsLiking(false);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = `${window.location.origin}/ideas?idea=${idea.id}`;
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

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSaving) return;
        if (!user) {
            toast.error("Please login to save ideas.");
            return;
        }

        setIsSaving(true);
        const newSaved = !saved;
        setSaved(newSaved);

        try {
            const res = await fetch(`/api/ideas/${idea.id}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) throw new Error();
            toast.success(newSaved ? "Idea saved to your collection!" : "Idea removed from saved.");
        } catch (error) {
            setSaved(!newSaved);
            toast.error("Failed to update save status.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
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
                "group bg-white border border-gray-100/60 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col",
                small ? "p-3" : "p-4 md:p-5"
            )}
        >
            {/* Header - Always accessible */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-xs overflow-hidden">
                        {idea.user_avatar ? (
                            <img src={idea.user_avatar} alt={idea.user_handle} className="w-full h-full object-cover" />
                        ) : (
                            idea.user_handle?.charAt(0).toUpperCase() || "A"
                        )}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm text-gray-900 truncate max-w-[120px]">
                            {idea.user_handle || "Anonymous"}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap">
                            • {timeAgo}
                        </span>
                    </div>
                </div>

                {user?.id === idea.user_id && (
                    <div className="flex gap-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}
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

            {/* Clickable Area for Detail View */}
            <div 
                className="cursor-pointer flex-1 flex flex-col"
                onClick={onClick}
            >
                <p className={cn(
                    "text-gray-700 font-medium leading-relaxed mb-4 whitespace-pre-wrap break-words line-clamp-3",
                    small ? "text-sm" : "text-[15px]"
                )}>
                    {idea.idea}
                </p>

                {idea.video ? (
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 aspect-video bg-black relative group/video mt-auto shadow-sm">
                        <video src={idea.video} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/40 transition-colors">
                            <Play className="w-10 h-10 text-white fill-current opacity-80" />
                        </div>
                    </div>
                ) : idea.image ? (
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 aspect-[4/3] bg-gray-50 mt-auto shadow-sm">
                        <img src={idea.image} className="w-full h-full object-cover" alt="Spark" />
                    </div>
                ) : null}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-1 pt-2 border-t border-black/5 mt-auto">
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
                        onClick={(e) => { e.stopPropagation(); handleLike(reactionType || 'heart'); }}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95", 
                            liked ? "bg-accent-yellow/10" : "text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        <div className={cn(liked ? (REACTIONS.find(r => r.type === reactionType)?.color || "text-accent-red") : "text-gray-400")}>
                            {liked && reactionType ? (
                                (() => {
                                    const R = REACTIONS.find(r => r.type === reactionType);
                                    return R ? <R.icon className="w-4 h-4 fill-current" /> : <Heart className="w-4 h-4" />;
                                })()
                            ) : (
                                <Heart className="w-4 h-4" />
                            )}
                        </div>
                        <span className={cn(liked ? "text-black" : "text-gray-500")}>
                            {likesCount > 0 && likesCount}
                        </span>
                    </button>
                </div>

                <button 
                    onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-100 transition-colors"
                >
                    <MessageCircle className="w-4 h-4" />
                    {commentsCount}
                </button>
                <button  
                    onClick={handleShare}
                    className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-xl font-bold text-xs transition-colors ml-auto"
                >
                    <Share2 className="w-4 h-4" />
                </button>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors disabled:opacity-50",
                        saved ? "text-accent-blue bg-accent-blue/10" : "text-gray-500 hover:bg-gray-100"
                    )}
                >
                    <Bookmark className={cn("w-4 h-4", saved ? "fill-current" : "")} />
                </button>
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
