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
  Rocket, PlusCircle, Heart, Loader2, Bookmark, X
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
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [likedIdeas, setLikedIdeas] = useState<any[]>([]);
  const [isLoadingLiked, setIsLoadingLiked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    bio: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    website: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "shared") {
        fetchUserIdeas();
    } else if (activeTab === "saved") {
        fetchSavedIdeas();
    } else if (activeTab === "liked") {
        fetchLikedIdeas();
    }
  }, [activeTab, data?.user?.id]);

  useEffect(() => {
    if (data?.user) {
        setEditForm({
            name: data.user.name || "",
            username: data.user.handle?.replace("@", "") || "",
            bio: data.user.bio || ""
        });
        setSocialLinks(data.user.social_links ? (typeof data.user.social_links === 'string' ? JSON.parse(data.user.social_links) : data.user.social_links) : {
            linkedin: "",
            github: "",
            website: ""
        });
    }
  }, [data]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        if (res.status === 401) {
            await fetch("/api/auth/logout", { method: "POST" });
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

  const fetchSavedIdeas = async () => {
    if (!data?.user?.id) return;
    setIsLoadingSaved(true);
    try {
        const res = await fetch("/api/ideas?sort=saved");
        if (res.ok) {
            const ideas = await res.json();
            setSavedIdeas(ideas);
        }
    } catch (error) {
        console.error("Error fetching saved ideas:", error);
    } finally {
        setIsLoadingSaved(false);
    }
  };

  const fetchLikedIdeas = async () => {
    if (!data?.user?.id) return;
    setIsLoadingLiked(true);
    try {
        const res = await fetch("/api/ideas?sort=liked");
        if (res.ok) {
            const ideas = await res.json();
            setLikedIdeas(ideas);
        }
    } catch (error) {
        console.error("Error fetching liked ideas:", error);
    } finally {
        setIsLoadingLiked(false);
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
        body: JSON.stringify({
            ...editForm,
            social_links: socialLinks,
            looking_for_work: data.user.looking_for_work,
            portfolio_items: data.user.portfolio_items
        })
      });
      if (res.ok) {
        fetchProfile();
        alert("Settings saved successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    setIsChangingPassword(true);
    try {
        const res = await fetch("/api/user/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(passwordForm)
        });
        if (res.ok) {
            alert("Password updated successfully!");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            const err = await res.json();
            alert(err.error || "Failed to update password");
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("ARE YOU SURE? This action is permanent and cannot be undone.")) {
        if (confirm("Final confirmation: Delete everything?")) {
            alert("Account deletion initiated. (Mocked for safety)");
        }
    }
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"/></div>;

  if (data?.error) {
    if (typeof window !== 'undefined') {
        fetch("/api/auth/logout", { method: "POST" }).then(() => {
            window.location.href = '/login';
        });
    }
    return null;
  }

  const tabs: { id: string, label: string, icon: any }[] = [
    { id: "overview", label: "Overview", icon: Layout },
    { id: "portfolio", label: "Portfolio", icon: Rocket },
    { id: "shared", label: "Shared Ideas", icon: Share2 },
    { id: "saved", label: "Saved Ideas", icon: Bookmark },
    { id: "liked", label: "Liked Ideas", icon: Heart },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-32 pb-24">
      {showCelebrate && <Celebrate />}
      <div className="container mx-auto max-w-[1600px] px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 text-center md:text-left">
           <div className="relative">
              <img src={data.user.avatar} className={cn("w-32 h-32 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_#000] object-cover bg-white")} alt="Profile Avatar" />
           </div>

           <div className="flex-1 space-y-4 w-full">
                   <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                          <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                              {data.user.name}
                            </h1>
                            {data.user.looking_for_work && (
                              <span className="px-3 py-1 bg-[#FFCF0D] border-2 border-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
                                🟢 Looking for work
                              </span>
                            )}
                          </div>
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
            
            {activeTab === "portfolio" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Your Portfolio</h3>
                        <button 
                            onClick={() => {
                                const title = prompt("Project Title:");
                                if (title) {
                                    const description = prompt("Project Description:");
                                    const image = prompt("Image URL (optional):") || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80";
                                    const url = prompt("Project URL (optional):") || "#";
                                    const newPortfolio = [...(data.user.portfolio_items || []), { id: Date.now(), title, description, image, url }];
                                    setData({ ...data, user: { ...data.user, portfolio_items: newPortfolio } });
                                }
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                        >
                            <PlusCircle className="w-4 h-4" /> Add Project
                        </button>
                    </div>

                    {data.user.portfolio_items?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data.user.portfolio_items.map((project: any) => (
                                <motion.div 
                                    key={project.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white border-2 border-black rounded-[24px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group"
                                >
                                    <div className="aspect-video bg-gray-100 border-b-2 border-black relative overflow-hidden">
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute top-4 right-4 group-hover:translate-x-0 translate-x-12 opacity-0 group-hover:opacity-100 transition-all">
                                            <button 
                                                onClick={() => {
                                                    const newItems = data.user.portfolio_items.filter((p: any) => p.id !== project.id);
                                                    setData({ ...data, user: { ...data.user, portfolio_items: newItems } });
                                                }}
                                                className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_#000]"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xl font-black uppercase tracking-tight">{project.title}</h4>
                                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-black/5 rounded-lg">
                                                <Share2 className="w-4 h-4" />
                                            </a>
                                        </div>
                                        <p className="text-gray-500 font-medium text-sm mb-4 line-clamp-2">{project.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase rounded-full">Case Study</span>
                                            <span className="px-3 py-1 border-2 border-black text-[10px] font-black uppercase rounded-full italic">UI/UX</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white border-2 border-black border-dashed rounded-[40px]">
                            <Rocket className="w-16 h-16 mx-auto mb-6 text-gray-200" />
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Your Portfolio is Empty</h3>
                            <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest max-w-[300px] mx-auto">Showcase your best design work to the community and potential clients.</p>
                        </div>
                    )}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
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

            {activeTab === "saved" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Your Saved Ideas</h3>
                    </div>
                    
                    {isLoadingSaved ? (
                        <div className="py-20 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-300" />
                        </div>
                    ) : savedIdeas.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                            {savedIdeas.map((idea) => (
                                <IdeaCard small key={idea.id} idea={idea} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white border-2 border-black border-dashed rounded-[32px]">
                            <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-black uppercase">No saved ideas</h3>
                            <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest">Ideas you bookmark will appear here.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "liked" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Your Liked Ideas</h3>
                    </div>
                    
                    {isLoadingLiked ? (
                        <div className="py-20 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-300" />
                        </div>
                    ) : likedIdeas.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                            {likedIdeas.map((idea) => (
                                <IdeaCard small key={idea.id} idea={idea} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white border-2 border-black border-dashed rounded-[32px]">
                            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-black uppercase">No liked ideas</h3>
                            <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest">Ideas you like will appear here.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "settings" && (
               <div className="grid gap-8">
               {/* Profile Section */}
               <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                   <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                       <UserIcon className="w-6 h-6 text-accent-blue" /> Personal Information
                   </h3>
                   <form onSubmit={handleUpdateProfile} className="space-y-6">
                       <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                           <div className="relative group">
                               <img src={data.user.avatar} className="w-24 h-24 rounded-full border-4 border-black shadow-[4px_4px_0_0_#000] object-cover" alt="Avatar" />
                               <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                   <PlusCircle className="w-6 h-6 text-white" />
                               </div>
                           </div>
                           <div className="flex-1 w-full space-y-4">
                               <div className="grid md:grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Display Name</label>
                                       <input 
                                           type="text"
                                           value={editForm.name}
                                           onChange={e => setEditForm({...editForm, name: e.target.value})}
                                           className="w-full p-3 bg-gray-50 border-2 border-black/5 rounded-xl font-bold focus:border-black outline-none transition-colors"
                                       />
                                   </div>
                                   <div className="space-y-2">
                                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Handle (@)</label>
                                       <input 
                                           type="text"
                                           value={editForm.username}
                                           onChange={e => setEditForm({...editForm, username: e.target.value})}
                                           className="w-full p-3 bg-gray-50 border-2 border-black/5 rounded-xl font-bold focus:border-black outline-none transition-colors"
                                       />
                                   </div>
                               </div>
                               <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bio</label>
                                   <textarea 
                                       value={editForm.bio}
                                       onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                       className="w-full p-4 bg-gray-50 border-2 border-black/5 rounded-xl font-medium h-24 resize-none focus:border-black outline-none transition-colors"
                                   />
                               </div>
                               <div className="mt-4 flex items-center gap-3 p-4 bg-[#FFCF0D]/10 border-2 border-[#FFCF0D] rounded-2xl">
                                    <input 
                                        type="checkbox"
                                        id="lookingForWork"
                                        checked={data.user.looking_for_work}
                                        onChange={e => {
                                            setData({
                                                ...data,
                                                user: { ...data.user, looking_for_work: e.target.checked }
                                            });
                                        }}
                                        className="w-5 h-5 accent-black cursor-pointer shadow-sm"
                                    />
                                    <label htmlFor="lookingForWork" className="text-sm font-bold cursor-pointer select-none text-black">
                                        Show "Looking for work" badge on my profile
                                    </label>
                                </div>
                           </div>
                       </div>
    
                       <div className="pt-8 border-t-2 border-black/5">
                           <h4 className="text-xl font-black mb-6 flex items-center gap-2">
                               <Share2 className="w-5 h-5 text-accent-pink" /> Social Presence
                           </h4>
                           <div className="grid md:grid-cols-3 gap-4">
                               <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">LinkedIn</label>
                                   <input 
                                       type="text"
                                       placeholder="linkedin.com/in/..."
                                       value={socialLinks.linkedin}
                                       onChange={e => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                                       className="w-full p-3 bg-gray-50 border-2 border-black/5 rounded-xl font-bold text-sm"
                                   />
                               </div>
                               <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">GitHub</label>
                                   <input 
                                       type="text"
                                       placeholder="github.com/..."
                                       value={socialLinks.github}
                                       onChange={e => setSocialLinks({...socialLinks, github: e.target.value})}
                                       className="w-full p-3 bg-gray-50 border-2 border-black/5 rounded-xl font-bold text-sm"
                                   />
                               </div>
                               <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Website</label>
                                   <input 
                                       type="text"
                                       placeholder="yourportfolio.com"
                                       value={socialLinks.website}
                                       onChange={e => setSocialLinks({...socialLinks, website: e.target.value})}
                                       className="w-full p-3 bg-gray-50 border-2 border-black/5 rounded-xl font-bold text-sm"
                                   />
                               </div>
                           </div>
                       </div>
    
                       <div className="flex justify-end pt-6">
                           <button 
                               type="submit"
                               disabled={isUpdating}
                               className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[4px_4px_0_0_#ccc]"
                           >
                               {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                               Save Info
                           </button>
                       </div>
                   </form>
               </div>
    
               {/* Security Section */}
               <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                   <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                       <SettingsIcon className="w-6 h-6 text-accent-yellow" /> Security & Privacy
                   </h3>
                   <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                       <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Password</label>
                           <input 
                               type="password"
                               required
                               value={passwordForm.currentPassword}
                               onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                               className="w-full p-3 bg-gray-50 border-2 border-black/5 rounded-xl font-bold"
                           />
                       </div>
                       <div className="grid md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">New Password</label>
                               <input 
                                   type="password"
                                   required
                                   value={passwordForm.newPassword}
                                   onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                   className="w-full p-3 bg-gray-50 border-2 border-black/5 rounded-xl font-bold"
                               />
                           </div>
                           <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Confirm New</label>
                               <input 
                                   type="password"
                                   required
                                   value={passwordForm.confirmPassword}
                                   onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                   className="w-full p-3 bg-gray-50 border-2 border-black/5 rounded-xl font-bold"
                               />
                           </div>
                       </div>
                       <button 
                           type="submit"
                           disabled={isChangingPassword}
                           className="px-8 py-3 bg-accent-yellow border-2 border-black rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[4px_4px_0_0_#000]"
                       >
                           {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                           Update Password
                       </button>
                   </form>
    
                   <div className="mt-12 pt-12 border-t-2 border-black/5">
                       <h4 className="text-xl font-black mb-4 text-red-500">Danger Zone</h4>
                       <p className="text-gray-500 text-sm font-medium mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                       <button 
                           onClick={handleDeleteAccount}
                           className="px-6 py-3 bg-white border-2 border-red-500 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0_0_#ef4444]"
                       >
                           Delete DesignHunt Account
                       </button>
                   </div>
               </div>
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
        fetch("/api/settings")
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
