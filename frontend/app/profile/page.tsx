"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  Calendar, 
  Edit3, 
  Flame,
  Award,
  Activity,
  Briefcase,
  BookOpen,
  Bookmark,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { ProfileStatsCards } from "@/components/profile/ProfileStatsCards";
import { LearningProgressTracker } from "@/components/profile/LearningProgressTracker";

type TabType = "lessons" | "badges" | "activity" | "portfolio";

function ProfileContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>("lessons");
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/learning/activity", { credentials: 'include' });
      const activityData = await res.json();
      setBookmarks(activityData.bookmarks || []);
    } catch (err) {
      console.error("Failed to fetch activity:", err);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      await fetch(`/api/learning/activity/bookmark/${id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      setBookmarks(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete bookmark:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchActivity();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to fetch profile");
      }
      const profile = await res.json();
      setData(profile);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full"/>
    </div>
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  const user = data.user;
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const tabs = [
    { id: "lessons", label: "Lessons", icon: BookOpen },
    { id: "badges", label: "Badge collection", icon: Award },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-20 font-[family-name:var(--font-plus-jakarta)]">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
             <Link href="/profile/edit" className="relative group cursor-pointer">
                <img 
                  src={user.avatar} 
                  className="w-16 h-16 rounded-full border-2 border-white relative z-10 object-cover bg-gray-50 transition-all group-hover:brightness-90" 
                  alt="Avatar" 
                />
                <div className="absolute -bottom-1 -right-1 bg-black text-white p-1.5 rounded-full z-20 border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                  <Edit3 className="w-3 h-3" />
                </div>
             </Link>
             <div>
                <h1 className="text-xl font-semibold tracking-tight text-black">
                  {user.name}
                </h1>
                <p className="text-[10px] font-semibold text-gray-400 leading-none mt-1 uppercase tracking-widest">{user.handle}</p>
                <div className="flex items-center gap-2 mt-2 text-gray-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold leading-none">{today}</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1 px-4 py-2 bg-gray-50 rounded-2xl border border-black/5 hover:border-black/10 transition-colors cursor-default">
             <div className="flex items-center gap-2 text-black">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/dashboardicons/streaks.png" alt="Streak" className="w-full h-full object-contain" />
                </div>
                <span className="text-3xl font-black tracking-tighter">{user.streak}</span>
             </div>
             <p className="text-[9px] font-semibold text-gray-400 leading-none">Streak</p>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="border-b border-black/5">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    "relative py-4 text-sm font-semibold transition-all whitespace-nowrap",
                    isActive ? "text-black" : "text-gray-400 hover:text-black/60"
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div 
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Rendering */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-10"
          >
            {activeTab === "lessons" && (
              <>
                {/* Stats Row */}
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black text-gray-400 px-2">Learning statistics</h3>
                   <ProfileStatsCards 
                     streak={user.streak}
                     xp={user.xp}
                     rank={user.xp_percentile || "Top 12%"}
                     badge={{
                       name: (user.typography_progress?.completed || 0) > 18 ? "Hard" : (user.typography_progress?.completed || 0) > 8 ? "Medium" : "Normal",
                       image: (user.typography_progress?.completed || 0) > 18 ? "/badges/typography/hard level/hard.png" : 
                              (user.typography_progress?.completed || 0) > 8 ? "/badges/typography/medium level/medium.png" : 
                              "/badges/typography/normal level/normal.png"
                     }}
                   />
                </div>

                {/* Main Progress Tracker */}
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black text-gray-400 px-2">Current lesson</h3>
                   <LearningProgressTracker 
                      currentTopic="Typography"
                      topicSlug="typography"
                      totalLessons={user.typography_progress?.total || 50}
                      completedCount={user.typography_progress?.completed || 0}
                   />
                </div>
              </>
            )}

            {activeTab === "badges" && (
              <div className="space-y-12">
                <div className="flex flex-col gap-1 px-2">
                  <h3 className="text-sm font-bold text-black tracking-tight">Achievements</h3>
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Mastery progress</p>
                </div>

                {data.badges && data.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-6 px-2">
                    {data.badges.map((badge: any, idx: number) => {
                      return (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group flex flex-col items-center gap-3"
                        >
                          <div className="relative">
                            <div className="w-16 h-16 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                              <img 
                                src={`/badges/typography/images/${badge.image}`} 
                                alt={badge.name}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            {/* Hover Tooltip */}
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                              {badge.name} • {badge.tier}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center text-center">
                            <span className="text-[9px] font-bold text-black uppercase tracking-tighter">{badge.tier}</span>
                            <span className="text-[8px] font-semibold text-gray-400">Mastery</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white border border-dashed border-black/10 rounded-[32px]">
                    <Award className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                    <h3 className="text-lg font-bold text-black">Empty collection</h3>
                    <p className="text-xs text-gray-400 mt-2">Complete mastery levels to earn achievement badges.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-12">
                {/* Bookmarks Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="p-2 bg-[#FF69B4]/5 rounded-xl">
                      <Bookmark className="w-4 h-4 text-[#FF69B4]" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-black tracking-tight">Bookmarks</h3>
                      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Important topics</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarks.length > 0 ? bookmarks.map((item) => (
                      <div key={item.id} className="p-5 bg-white border border-black/5 rounded-3xl hover:border-black/10 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[9px] font-bold text-[#FF69B4] uppercase tracking-widest bg-[#FF69B4]/5 px-2 py-0.5 rounded">{item.category}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBookmark(item.id);
                              }}
                              className="p-1.5 bg-gray-50 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <div className="p-1.5 bg-gray-50 rounded-full text-gray-400 group-hover:text-[#FF69B4] transition-colors">
                              <Bookmark className="w-3 h-3 fill-current" />
                            </div>
                          </div>
                        </div>
                        <h4 className="text-sm font-bold text-black mb-1 group-hover:underline underline-offset-4 decoration-black/20">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{item.description || "Refer back to this important concept in your mastery journey."}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-gray-300 capitalize">{item.level.toLowerCase()} theory</span>
                          <span className="text-[9px] font-bold text-gray-300">{formatDate(item.date)}</span>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-8 text-center bg-gray-50/50 rounded-3xl border border-dashed border-black/5">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No bookmarks</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "portfolio" && (
              <div className="py-20 text-center bg-white border border-dashed border-black/10 rounded-[32px]">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                <h3 className="text-lg font-bold text-black">Portfolio</h3>
                <p className="text-xs text-gray-400 mt-2">Projects you showcase will appear here.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
