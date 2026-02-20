"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export function InlineComments({ 
    ideaId, 
    user, 
    onCommentAdded 
}: { 
    ideaId: number, 
    user: any, 
    onCommentAdded: () => void 
}) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [ideaId]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/ideas/${ideaId}/comment`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        setIsPosting(true);
        try {
            const res = await fetch(`/api/ideas/${ideaId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user?.id || "GUEST",
                    user_handle: user?.handle || "Guest Designer",
                    user_avatar: user?.avatar || null,
                    content: newComment
                })
            });

            if (res.ok) {
                setNewComment("");
                fetchComments();
                onCommentAdded();
                toast.success("Design feedback shared!");
            }
        } catch (error) {
            toast.error("Failed to post comment.");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-black/5 space-y-4">
            <div className="space-y-4">
                {isLoading ? (
                    <div className="py-4 text-center">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-200" />
                    </div>
                ) : comments.length > 0 ? (
                    <div className="space-y-4 relative">
                        {/* Vertical thread line indicator */}
                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-black/5 rounded-full" />
                        
                        {comments.map((comment) => (
                            <div key={comment.id} className="pl-8 relative group">
                                <div className="absolute left-0 top-0 w-6 h-6 rounded-full border border-black/10 overflow-hidden shadow-sm">
                                    <img 
                                        src={comment.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.id}`} 
                                        className="w-full h-full object-cover" 
                                        alt="User" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-black text-[11px] tracking-tight">{comment.user_handle || "Designer"}</span>
                                        <span className="text-[9px] font-bold text-gray-400">
                                            • {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-600 leading-snug">
                                        {comment.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 opacity-30">
                        <p className="font-bold uppercase text-[9px] tracking-widest">No feedback yet. Be the first!</p>
                    </div>
                )}
            </div>

            {/* Compact Input Area */}
            <div className="relative group/input mt-2">
                <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    disabled={isPosting}
                    className="w-full p-3 pr-12 bg-gray-50 border border-black/10 rounded-xl focus:bg-white focus:border-black/20 focus:outline-none font-medium text-xs h-12 min-h-[48px] max-h-32 resize-none transition-all no-scrollbar"
                />
                <button 
                    onClick={handlePostComment}
                    disabled={isPosting || !newComment.trim()}
                    className="absolute right-2 top-1.5 p-2 bg-black text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-30 disabled:scale-100 shadow-sm"
                    title="Post feedback"
                >
                    {isPosting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
            </div>
        </div>
    );
}
