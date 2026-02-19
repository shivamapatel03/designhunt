"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { CommentModal } from "./CommentModal";

export function IdeaCard({ idea, small }: { idea: any, small?: boolean }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(idea.likes_count || 0);
    const [commentsCount, setCommentsCount] = useState(idea.comments_count || 0);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const timeAgo = new Date(idea.created_at).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const handleLike = async () => {
        if (!user) {
            toast.error("Join the tribe to like this spark!", {
                action: {
                    label: "Login",
                    onClick: () => window.location.href = "/login"
                }
            });
            return;
        }

        if (isLiking) return;

        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount((prev: number) => newLiked ? prev + 1 : prev - 1);
        setIsLiking(true);

        try {
            const res = await fetch(`/api/ideas/${idea.id}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id })
            });
            if (!res.ok) throw new Error();
        } catch (error) {
            setLiked(!newLiked);
            setLikesCount((prev: number) => !newLiked ? prev + 1 : prev - 1);
            toast.error("Failed to update like status.");
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
            }
        } catch (error) {
            toast.error("Failed to delete idea.");
        }
    };

    return (
        <>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "group bg-white border-2 border-black rounded-[32px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform relative",
                    small ? "p-6 rounded-[24px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "p-8"
                )}
            >
                {user?.id === idea.user_id && (
                    <button 
                        onClick={handleDelete}
                        className="absolute top-6 right-6 p-2 text-gray-300 hover:text-accent-red hover:bg-accent-red/5 rounded-xl transition-all z-10"
                        title="Delete Spark"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}

                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "rounded-full border-2 border-black bg-accent-yellow flex items-center justify-center font-black overflow-hidden",
                            small ? "w-10 h-10 text-base" : "w-12 h-12 text-lg"
                        )}>
                            {idea.user_avatar ? (
                                <img src={idea.user_avatar} alt={idea.user_handle} className="w-full h-full object-cover" />
                            ) : (
                                idea.user_handle?.charAt(0).toUpperCase() || "A"
                            )}
                        </div>
                        <div>
                            <div className={cn("font-black leading-tight", small ? "text-base" : "text-lg")}>
                                {idea.user_handle || "Anonymous Designer"}
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                @{idea.user_handle?.toLowerCase().replace(/\s/g, '') || "designer"}
                            </div>
                        </div>
                    </div>
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{timeAgo}</div>
                </div>

                <p className={cn(
                    "text-gray-700 font-medium leading-relaxed mb-6",
                    small ? "text-base" : "text-lg"
                )}>
                    {idea.idea}
                </p>

                {idea.image && (
                    <div className="mb-8 rounded-2xl overflow-hidden border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] transition-transform group-hover:scale-[1.01]">
                        <img src={idea.image} className="w-full h-auto max-h-[400px] object-cover" alt="Design Spark" />
                    </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-black/5">
                    <div className="flex gap-6">
                        <button 
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-2 font-black text-sm transition-all active:scale-90", 
                                liked ? "text-accent-red" : "text-gray-400 hover:text-black"
                            )}
                        >
                            <motion.div
                                animate={liked ? { scale: [1, 1.4, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                <Heart className={cn("w-5 h-5", liked ? "fill-accent-red" : "")} />
                            </motion.div>
                            {likesCount}
                        </button>
                        <button 
                            onClick={() => setIsCommentModalOpen(true)}
                            className="flex items-center gap-2 font-black text-sm text-gray-400 hover:text-black transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            {commentsCount}
                        </button>
                    </div>
                    <button 
                        onClick={handleShare}
                        className="p-3 hover:bg-black hover:text-white border-2 border-transparent hover:border-black rounded-2xl transition-all"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isCommentModalOpen && (
                    <CommentModal 
                        idea={idea} 
                        user={user} 
                        onClose={() => setIsCommentModalOpen(false)} 
                        onCommentAdded={() => setCommentsCount((prev: number) => prev + 1)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
