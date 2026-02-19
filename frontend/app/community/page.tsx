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
        if (authLoading) return; // Wait for auth to resolve
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }
        setIsShareModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#f8f7f4] pt-32 pb-20">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="grid lg:grid-cols-[1fr_350px] gap-12">
                    
                    {/* Main Feed Section */}
                    <div className="space-y-8">
                        {/* Header & Controls */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-5xl font-black tracking-tighter uppercase italic">Community Hub</h1>
                                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2">Connect, share, and inspire with designers worldwide.</p>
                            </div>
                            <button 
                                onClick={handleShareClick}
                                className="flex items-center gap-2 px-6 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
                            >
                                <Plus className="w-5 h-5" /> Share Idea
                            </button>
                        </div>

                        {/* Search & Filters */}
                        <div className="flex flex-wrap items-center gap-4 py-6 border-y-2 border-black/5">
                            <div className="flex-1 relative min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search ideas, designers, or tags..." 
                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black rounded-2xl focus:outline-none font-bold"
                                />
                            </div>
                            <div className="flex gap-2">
                                {["Trending", "Newest", "Top Rated"].map((f) => (
                                    <button 
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={cn(
                                            "px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2",
                                            filter === f ? "bg-accent-yellow border-black shadow-[4px_4px_0px_0px_#000]" : "bg-white border-transparent hover:border-black/10"
                                        )}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
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
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Trending Sidebar */}
                        <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-accent-red" /> Trending Now
                            </h3>
                            <div className="space-y-4">
                                {TRENDING_IDEAS.map((item, i) => (
                                    <div key={item.id} className="group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-black text-gray-200 group-hover:text-black transition-colors italic">0{i+1}</span>
                                            <div>
                                                <div className="font-bold text-sm group-hover:underline">{item.title}</div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category} • {item.likes} LIKES</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Creators */}
                        <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-accent-yellow" /> Top Brains
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <img 
                                        key={i}
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
                                        className="w-10 h-10 rounded-full border-2 border-black bg-gray-50 hover:scale-110 transition-transform cursor-pointer" 
                                        alt="Top Brain" 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* External Links */}
                        <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-black uppercase italic tracking-tight mb-6">Join the Tribe</h3>
                            <div className="space-y-4">
                                {COMMUNITY_LINKS.map((link) => (
                                    <a 
                                        key={link.name} 
                                        href={link.href}
                                        className="flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <link.icon className={cn("w-5 h-5", link.color)} />
                                            <span className="font-bold text-sm">{link.name}</span>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                ))}
                            </div>
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
