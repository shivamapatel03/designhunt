"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Sparkles, TrendingUp, Loader2, MessageCircle,
    Home, Library, BookOpen, PenTool, Search, X
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
    const [searchQuery, setSearchQuery] = useState("");

    const filteredIdeas = (ideas || []).filter(idea => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (idea.idea?.toLowerCase() || "").includes(query) || 
               (idea.user_handle?.toLowerCase() || "").includes(query);
    });

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
        <div className="min-h-screen bg-gray-50 pt-14 md:pt-16 pb-20">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="container mx-auto px-6 md:px-16 lg:px-24 relative"
            >
            <div className="flex flex-col gap-6">
                <main className="w-full space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">Community page</h1>
                        <p className="text-gray-500 font-medium text-sm md:text-base">
                            Beautiful, modern community page designs, illustrations, and graphic elements
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap justify-center pt-2">
                            <span>Related:</span>
                            {["landing", "site", "forum", "404", "homepage", "social network"].map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold hover:bg-gray-200 cursor-pointer transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Feed Sorting and Filters */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-between gap-4 pb-6 overflow-x-auto no-scrollbar"
                    >
                        {/* Left Dropdown (Popular) */}
                        <div className="shrink-0 relative group">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:border-gray-300 hover:shadow-sm transition-all focus:outline-none bg-white">
                                Popular
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            {/* Simple dropdown map could go here */}
                        </div>

                        {/* Center Scrollable Tabs */}
                        <div className="flex items-center gap-1 flex-1 px-4 overflow-x-auto no-scrollbar">
                            {["Discover", "Animation", "Branding", "Illustration", "Mobile", "Print", "Product Design", "Typography", "Web Design"].map((f) => (
                                <button 
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all",
                                        filter === f ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Right Filters Button */}
                        <button className="shrink-0 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:border-gray-300 hover:shadow-sm transition-all bg-white text-gray-700">
                            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 1H1M8 6H1M5 11H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Filters
                        </button>
                    </motion.div>

                    <div key="feed-content" className="space-y-6 pb-12">
                        {isLoading ? (
                            <div key="loading" className="py-20 text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-300" />
                                <p className="mt-4 font-medium text-sm text-gray-400">Loading feed...</p>
                            </div>
                        ) : filteredIdeas.length > 0 ? (
                            <div 
                                key="grid"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filteredIdeas.map((idea: any) => (
                                    <div 
                                        key={idea.id}
                                        className="w-full h-full"
                                    >
                                        <IdeaCard idea={idea} onClick={() => setSelectedPost(idea)} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div 
                                key="no-results"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="text-center py-20 bg-white border border-gray-100 border-dashed rounded-3xl"
                            >
                                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {searchQuery ? "No matches found" : "The Feed is Whispering..."}
                                </h3>
                                <p className="text-gray-500 text-sm mt-2">
                                    {searchQuery ? "Try searching for something else or clearing your filters." : "Be the first to share an idea with the community."}
                                </p>
                                {searchQuery ? (
                                    <button 
                                        onClick={() => setSearchQuery("")}
                                        className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleShareClick}
                                        className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black transition-colors"
                                    >
                                        Drop an Idea
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </div>
                </main>
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
                        onUpdate={(updatedPost) => {
                            setIdeas(prev => prev.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p));
                            setSelectedPost(updatedPost);
                        }}
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
                                Please login first to share your creative ideas with the community.
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
