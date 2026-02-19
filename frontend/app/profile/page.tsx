"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { XPTracker } from "@/components/profile/XPTracker";
import { Celebrate } from "@/components/ui/Celebrate";
import { DashboardToggle } from "@/components/layout/DashboardToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { DailyLawCard } from "@/components/theory/DailyLawCard";
import { 
  Trophy, Zap, Star, Share2, Download, 
  Linkedin, Award, Clock, CheckCircle2, 
  Flame, Layout, Type, LogOut, Settings as SettingsIcon,
  BookOpen, History as HistoryIcon, User as UserIcon, Save,
  Rocket, PlusCircle, Heart, Loader2
} from "lucide-react";
import { IdeaCard } from "@/components/community/IdeaCard";
import { ShareIdeaModal } from "@/components/community/ShareIdeaModal";

function ProfileContent() {
  const searchParams = useSearchParams();
  const showCelebrate = searchParams.get('celebrate') === 'true';
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isUpdating, setIsUpdating] = useState(false);
  const [userIdeas, setUserIdeas] = useState<any[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    bio: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "shared") {
        fetchUserIdeas();
    }
  }, [activeTab, data?.user?.id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }
      const profile = await res.json();
      setData(profile);
      if (profile.user) {
        setEditForm({
          name: profile.user.name || "",
          username: profile.user.handle?.replace("@", "") || "",
          bio: profile.user.bio || ""
        });
      }
    } catch (err) {
      console.error(err);
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
  };

  const fetchUserIdeas = async () => {
    if (!data?.user?.id) return;
    setIsLoadingIdeas(true);
    try {
        const res = await fetch("/api/ideas");
        if (res.ok) {
            const allIdeas = await res.json();
            setUserIdeas(allIdeas.filter((i: any) => i.user_id === data.user.id));
        }
    } catch (error) {
        console.error("Error fetching user ideas:", error);
    } finally {
        setIsLoadingIdeas(false);
    }
  };

  const handleShareSuccess = () => {
    setIsShareModalOpen(false);
    fetchUserIdeas();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        fetchProfile();
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"/></div>;

  if (data.error) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }

  const tabs: { id: string, label: string, icon: any }[] = [
    { id: "overview", label: "Overview", icon: Layout },
    { id: "shared", label: "Shared Ideas", icon: Share2 },
    { id: "liked", label: "Liked Ideas", icon: Heart },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-32 pb-24">
      {showCelebrate && <Celebrate />}
      <div className="container mx-auto max-w-5xl px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 text-center md:text-left">
           <div className="relative">
              <img src={data.user.avatar} className={cn("w-32 h-32 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_#000] object-cover bg-white")} alt="Profile Avatar" />
           </div>

           <div className="flex-1 space-y-4 w-full">
                   <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                          <h1 className="text-4xl font-black flex items-center gap-3">
                            {data.user.name}
                          </h1>
                          <p className="text-gray-500 font-medium">{data.user.handle} • {data.user.bio}</p>
                      </div>
                      <div className="flex gap-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl font-bold text-sm hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-[2px] active:shadow-none"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                      </div>
                   </div>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-4 no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border-2",
                        activeTab === tab.id
                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                        : 'bg-white text-gray-500 border-transparent hover:border-black/10 hover:bg-white/80'
                    )}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "overview" && (
                <div className="space-y-8">
                     <DailyLawCard className="mb-0" />
                </div>
            )}

            {activeTab === "shared" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Your Shared Ideas</h3>
                        <button 
                            onClick={() => setIsShareModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                        >
                            <PlusCircle className="w-4 h-4" /> Share New Idea
                        </button>
                    </div>
                    
                    {isLoadingIdeas ? (
                        <div className="py-20 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-300" />
                        </div>
                    ) : userIdeas.length > 0 ? (
                        <div className="grid gap-6">
                            {userIdeas.map((idea) => (
                                <IdeaCard small key={idea.id} idea={idea} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white border-2 border-black border-dashed rounded-[32px]">
                            <Share2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-black uppercase">No ideas shared yet</h3>
                            <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest">Your design brainstorms will appear here.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "liked" && (
                <div className="text-center py-20 bg-white border-2 border-black border-dashed rounded-[32px]">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-black uppercase">Your Liked Ideas</h3>
                    <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest">Ideas you like will appear here.</p>
                </div>
            )}

            {activeTab === "settings" && (
                <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                        <SettingsIcon className="w-6 h-6 text-gray-600" /> Account Settings
                    </h3>
                    <form onSubmit={handleUpdateProfile} className="max-w-xl space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</label>
                                <input 
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                                    <input 
                                        type="text"
                                        value={editForm.username}
                                        onChange={e => setEditForm({...editForm, username: e.target.value})}
                                        className="w-full p-4 pl-9 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Bio</label>
                            <textarea 
                                value={editForm.bio}
                                onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none font-medium h-32 resize-none"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isUpdating}
                            className="flex items-center gap-2 px-8 py-4 bg-accent-yellow border-2 border-black rounded-2xl font-black text-lg hover:scale-[1.02] transition-all shadow-[6px_6px_0px_0px_black] active:translate-y-[2px] active:shadow-none"
                        >
                            {isUpdating ? <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                        </button>
                    </form>

                    {data.user.role === 'USER' && (
                        <div className="mt-12 pt-12 border-t-2 border-dashed border-gray-100">
                             <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                                <Rocket className="w-6 h-6 text-accent-blue" /> Share your knowledge
                             </h4>
                             <p className="text-gray-500 font-medium mb-6">Apply to become a verified tutor on Design-Hunt and start creating your own paths.</p>
                             <BecomeTutorButton />
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Post Modal */}
        <AnimatePresence>
            {isShareModalOpen && (
                <ShareIdeaModal 
                    user={data.user} 
                    onClose={() => setIsShareModalOpen(false)} 
                    onSuccess={handleShareSuccess} 
                />
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"/></div>}>
            <ProfileContent />
        </Suspense>
    )
}

function BecomeTutorButton() {
    const [enableMarketplace, setEnableMarketplace] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch("http://localhost:5000/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data && data.ENABLE_MARKETPLACE) {
                    setEnableMarketplace(data.ENABLE_MARKETPLACE);
                }
            })
            .catch(err => console.error("Failed to fetch settings:", err));
    }, []);

    const handleClick = () => {
        if (!enableMarketplace) {
            alert("This feature is presently under development.");
        } else {
            router.push("/become-tutor");
        }
    };

    return (
        <button 
            onClick={handleClick}
            className="flex items-center gap-2 px-8 py-4 bg-black text-white border-2 border-black rounded-2xl font-black text-lg hover:scale-[1.02] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-none"
        >
            <Rocket className="w-5 h-5" /> Become a Tutor
        </button>
    );
}
