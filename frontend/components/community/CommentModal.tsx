"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CommentModal({ 
    idea, 
    user, 
    onClose,
    onCommentAdded
}: { 
    idea: any, 
    user: any, 
    onClose: () => void,
    onCommentAdded: () => void
}) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [idea.id]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/ideas/${idea.id}/comment`);
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
        if (!user) {
            toast.error("Please login to join the conversation.");
            return;
        }
        if (!newComment.trim()) return;

        setIsPosting(true);
        try {
            const res = await fetch(`/api/ideas/${idea.id}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    user_handle: user.handle,
                    user_avatar: user.avatar,
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white border-4 border-black rounded-[40px] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="p-8 border-b-2 border-black flex items-center justify-between bg-accent-blue/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border-2 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_black]">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Conversation</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">
                                Feedback for @{idea.user_handle?.toLowerCase()}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 hover:bg-black hover:text-white rounded-2xl transition-all border-2 border-transparent hover:border-black"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    {isLoading ? (
                        <div className="py-20 text-center">
                            <Loader2 className="w-10 h-10 animate-spin mx-auto text-gray-300" />
                        </div>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 group">
                                <img 
                                    src={comment.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.id}`} 
                                    className="w-10 h-10 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_black]" 
                                    alt="User" 
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-black text-sm">{comment.user_handle || "Designer"}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(comment.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-medium text-sm text-gray-700 shadow-sm transition-all group-hover:border-black/10 group-hover:bg-white">
                                        {comment.content}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 opacity-30">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                            <p className="font-black uppercase text-xs tracking-widest">No feedback yet. Be the first to spark dialogue!</p>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-8 bg-gray-50 border-t-4 border-black">
                    <div className="relative">
                        <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={user ? "Share your feedback or critique..." : "Please login to comment"}
                            disabled={!user || isPosting}
                            className="w-full p-6 pr-20 bg-white border-2 border-black rounded-3xl focus:outline-none font-bold text-sm h-28 resize-none shadow-[4px_4px_0px_0px_black]"
                        />
                        <button 
                            onClick={handlePostComment}
                            disabled={!user || isPosting || !newComment.trim()}
                            className="absolute bottom-6 right-6 p-4 bg-black text-white rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                        >
                            {isPosting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
