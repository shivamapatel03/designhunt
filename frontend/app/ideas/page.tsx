"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Sparkles, TrendingUp, Loader2, MessageCircle,
    Home, Library, BookOpen, PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { IdeaCard } from "@/components/community/IdeaCard";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";
import { PostDetailModal } from "@/components/community/PostDetailModal";
import Link from "next/link";
import { User as UserIcon } from "lucide-react";

export default function IdeasPage() {
    const { user, loading: authLoading } = useAuth();
    const [ideas, setIdeas] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("Trending");
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        fetchIdeas();
    }, [filter]);

    const fetchIdeas = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/ideas?sort=${filter.toLowerCase()}`);
            if (res.ok) {
                const data = await res.json();
                setIdeas(data);
            }
        } catch (error) {
            console.error("Failed to fetch ideas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShareClick = () => {
        if (authLoading) return;
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        setIsShareModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 overflow-hidden">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="container mx-auto max-w-7xl px-4 relative"
            >
                {/* Header Intro - Moved out of the grid to span full width above */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-yellow/20 text-yellow-800 rounded-full mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-bold uppercase text-[11px] tracking-wider">Design Tribe Feed</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Idea Sparks</h1>
                    <p className="text-gray-500 font-medium text-sm">Ignite your creativity with the latest design sparks.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
                    {/* Left Column - Main Feed */}
                    <main className="lg:col-span-8 space-y-6">

                        <div className="lg:hidden">
                            {/* Mobile Quick Post Box - Hidden on large screens */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow mb-8">
                                <Link 
                                    href="/profile"
                                    className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity"
                                >
                                    {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <UserIcon className="w-6 h-6 text-gray-400" />}
                                </Link>
                                <button 
                                    onClick={handleShareClick}
                                    className="flex-1 bg-gray-50 hover:bg-gray-100 border border-transparent rounded-full px-6 text-left text-gray-400 font-medium transition-colors text-sm"
                                >
                                    Start a design spark...
                                </button>
                                <div className="flex items-center gap-2 pr-2">
                                    <button onClick={handleShareClick} className="p-2 hover:bg-accent-yellow/10 rounded-lg transition-colors text-accent-yellow" title="Add Image">
                                        <Sparkles className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    {/* Feed Sorting */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-2 pb-2"
                    >
                        <div className="h-px flex-1 bg-gray-200" />
                        {["Trending", "Newest", "Top", "Saved"].map((f) => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wide transition-all",
                                    filter === f ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                        <div className="h-[2px] flex-1 bg-black/5" />
                    </motion.div>

                    {/* Feed */}
                    <div className="space-y-6 pb-12">
                        {isLoading ? (
                            <div className="py-20 text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-300" />
                                <p className="mt-4 font-medium text-sm text-gray-400">Loading feed...</p>
                            </div>
                        ) : ideas.length > 0 ? (
                            <motion.div 
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1, delayChildren: 0.5 }
                                    }
                                }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {ideas.map((idea: any) => (
                                    <motion.div 
                                        key={idea.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        <IdeaCard idea={idea} onClick={() => setSelectedPost(idea)} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-center py-20 bg-white border border-gray-100 border-dashed rounded-3xl"
                            >
                                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-2xl font-bold text-gray-900">The Feed is Whispering...</h3>
                                <p className="text-gray-500 text-sm mt-2">Be the first to share a design spark with the tribe.</p>
                                <button 
                                    onClick={handleShareClick}
                                    className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black transition-colors"
                                >
                                    Drop an Idea
                                </button>
                            </motion.div>
                        )}
                    </div>
                    </main>

                    {/* Right Column - Sidebar */}
                    <aside className="hidden lg:block lg:col-span-4 relative">
                        <div className="sticky top-32 space-y-6">
                            {/* Desktop Quick Post Box */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-4"
                            >
                                <div className="w-16 h-16 rounded-full border-4 border-gray-50 bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Share your latest work</h3>
                                    <p className="text-xs text-gray-500 mt-1">Get inspired and inspire others.</p>
                                </div>
                                <button 
                                    onClick={handleShareClick}
                                    className="w-full bg-gray-900 hover:bg-black text-white rounded-full py-2.5 font-bold text-sm transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Start a design spark
                                </button>
                            </motion.div>
                        </div>
                    </aside>
                </div>
            </motion.div>

            {/* Post Modal */}
            <AnimatePresence>
                {isShareModalOpen && (
                    <ShareIdeaModal 
                        user={user} 
                        onClose={() => setIsShareModalOpen(false)} 
                        onSuccess={() => {
                            setIsShareModalOpen(false);
                            fetchIdeas();
                        }} 
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedPost && (
                    <PostDetailModal 
                        post={selectedPost} 
                        onClose={() => setSelectedPost(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Auth Prompt Popup */}
            <AnimatePresence>
                {showLoginPrompt && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLoginPrompt(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm bg-white border-4 border-black rounded-[32px] p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] text-center"
                        >
                            <div className="w-20 h-20 bg-accent-yellow rounded-full border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_black]">
                                <TrendingUp className="w-10 h-10 text-black" />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Join the Tribe!</h3>
                            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-8 leading-tight">
                                Please login first to share your creative sparks with the community.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link 
                                    href="/login"
                                    onClick={() => setShowLoginPrompt(false)}
                                    className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                                >
                                    Login Now
                                </Link>
                                <button 
                                    onClick={() => setShowLoginPrompt(false)}
                                    className="w-full py-4 bg-white border-2 border-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
