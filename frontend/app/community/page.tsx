"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Sparkles, TrendingUp, Award, Instagram, Globe, 
    Plus, Search, ArrowUpRight, Loader2, MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { IdeaCard } from "@/components/community/IdeaCard";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";
import Link from "next/link";
import { User, Shield, Zap, Flame, BarChart3, Users } from "lucide-react";

// Sidebar Constants
const TRENDING_IDEAS = [
    { id: 1, title: "Glassmorphism 2.0", category: "UI Trends", likes: 1240 },
    { id: 2, title: "Dynamic Island UX", category: "Mobile", likes: 890 },
    { id: 3, title: "Skeuomorphic Cards", category: "Visual", likes: 750 },
];

const COMMUNITY_LINKS = [
    { name: "Reddit /r/Design", icon: Globe, href: "https://reddit.com/r/design", color: "text-orange-500" },
    { name: "Instagram @DesignHunt", icon: Instagram, href: "https://instagram.com", color: "text-pink-500" },
    { name: "Discord Lounge", icon: MessageCircle, href: "#", color: "text-indigo-500" },
];

export default function CommunityPage() {
    const { user, loading: authLoading } = useAuth();
    const [ideas, setIdeas] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("Trending");
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/ideas");
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
        <div className="min-h-screen bg-[#f3f4f6] pt-24 pb-20">
            <div className="container mx-auto max-w-[1400px] px-4">
                <div className="grid lg:grid-cols-[280px_1fr_320px] gap-6 items-start">
                    
                    {/* Left Column: Quick Links Only */}
                    <aside className="hidden lg:block space-y-4 sticky top-24">
                        <div className="bg-white border-2 border-black rounded-[24px] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Quick Links</h4>
                            <nav className="space-y-4">
                                <Link href="/profile" className="flex items-center gap-3 text-sm font-bold hover:text-accent-blue transition-colors group">
                                    <Users className="w-4 h-4" /> My Network
                                </Link>
                                <Link href="/challenges" className="flex items-center gap-3 text-sm font-bold hover:text-accent-red transition-colors group">
                                    <Flame className="w-4 h-4" /> Active Challenges
                                </Link>
                                <Link href="/theory" className="flex items-center gap-3 text-sm font-bold hover:text-accent-yellow transition-colors group">
                                    <Zap className="w-4 h-4" /> Learning Hub
                                </Link>
                            </nav>
                        </div>
                    </aside>

                    {/* Center Column: Main Feed (Reddit/LinkedIn hybrid) */}
                    <main className="space-y-6">
                        {/* Quick Post Box (LinkedIn style) */}
                        <div className="bg-white border-2 border-black rounded-[24px] p-4 flex gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <Link 
                                href="/profile"
                                className="w-12 h-12 rounded-full border-2 border-black bg-gray-100 flex-shrink-0 flex items-center justify-center font-black overflow-hidden hover:scale-105 transition-transform"
                            >
                                {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6" />}
                            </Link>
                            <button 
                                onClick={handleShareClick}
                                className="flex-1 bg-gray-50 hover:bg-gray-100 border-2 border-black/5 rounded-full px-6 text-left text-gray-500 font-bold transition-colors text-sm"
                            >
                                Start a design spark...
                            </button>
                            <div className="flex items-center gap-2 pr-2">
                                <button onClick={handleShareClick} className="p-2 hover:bg-accent-yellow/10 rounded-lg transition-colors text-accent-yellow" title="Add Image">
                                    <Sparkles className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Feed Sorting */}
                        <div className="flex items-center gap-2 pb-2">
                            <div className="h-[2px] flex-1 bg-black/5" />
                            {["Trending", "Newest", "Top"].map((f) => (
                                <button 
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all",
                                        filter === f ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-black/5"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                            <div className="h-[2px] flex-1 bg-black/5" />
                        </div>

                        {/* Feed */}
                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="py-20 text-center">
                                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-300" />
                                    <p className="mt-4 font-black uppercase text-xs tracking-widest text-gray-400">Tuning into the design frequency...</p>
                                </div>
                            ) : ideas.length > 0 ? (
                                ideas.map((idea: any) => (
                                    <IdeaCard key={idea.id} idea={idea} />
                                ))
                            ) : (
                                <div className="text-center py-32 bg-white border-2 border-black border-dashed rounded-[40px]">
                                    <Sparkles className="w-16 h-16 mx-auto mb-6 text-accent-yellow" />
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">The Feed is Whispering...</h3>
                                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-4">Be the first to share a design spark with the tribe.</p>
                                    <button 
                                        onClick={handleShareClick}
                                        className="mt-8 px-8 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform"
                                    >
                                        Drop an Idea
                                    </button>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Right Column: Trending & Creators (Reddit style) */}
                    <aside className="hidden lg:block space-y-6 sticky top-[min(96px,calc(100vh-100%-24px))] self-start">
                        {/* Trending Sidebar */}
                        <div className="bg-white border-2 border-black rounded-[24px] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-accent-red" /> Trending Sparks
                            </h3>
                            <div className="space-y-4">
                                {TRENDING_IDEAS.map((item, i) => (
                                    <div key={item.id} className="group cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <span className="font-black text-gray-300 group-hover:text-black transition-colors italic">0{i+1}</span>
                                            <div>
                                                <div className="font-bold text-xs group-hover:underline leading-snug">{item.title}</div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{item.category} • {item.likes}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Community Stats */}
                        <div className="bg-black text-white border-2 border-black rounded-[24px] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-accent-blue" /> Pulse Check
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xl font-black">2.4k</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Now</div>
                                </div>
                                <div>
                                    <div className="text-xl font-black">152</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">New Sparks</div>
                                </div>
                            </div>
                        </div>

                        {/* Top Creators */}
                        <div className="bg-white border-2 border-black rounded-[24px] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Award className="w-4 h-4 text-accent-yellow" /> Top Designers
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <img 
                                        key={i}
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} 
                                        className="w-8 h-8 rounded-full border-2 border-black bg-gray-50 hover:scale-110 transition-transform cursor-pointer" 
                                        alt="Top Brain" 
                                    />
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                View Leaderboard
                            </button>
                        </div>

                        {/* External Links */}
                         <div className="px-6 space-y-4">
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {COMMUNITY_LINKS.map((link) => (
                                    <a 
                                        key={link.name} 
                                        href={link.href}
                                        className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest flex items-center gap-1.5"
                                    >
                                        <link.icon className="w-3 h-3" />
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">© 2026 Design-Hunt Tribe</p>
                        </div>
                    </aside>
                </div>
            </div>

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
