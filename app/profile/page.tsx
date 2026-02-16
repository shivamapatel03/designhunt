"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { XPTracker } from "@/components/profile/XPTracker";
import { 
  Trophy, Zap, Star, Share2, Download, 
  Linkedin, Award, Clock, CheckCircle2, 
  Flame, Layout, Type, LogOut, Settings as SettingsIcon,
  BookOpen, History as HistoryIcon, User as UserIcon, Save,
  Rocket, PlusCircle
} from "lucide-react";
import { DashboardToggle } from "@/components/layout/DashboardToggle";

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    bio: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(profile => {
        setData(profile);
        if (profile.user) {
          setEditForm({
            name: profile.user.name || "",
            username: profile.user.handle?.replace("@", "") || "",
            bio: profile.user.bio || ""
          });
        }
      });
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

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Layout },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "history", label: "History", icon: HistoryIcon },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-32 pb-24">
      <div className="container mx-auto max-w-5xl px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 text-center md:text-left">
           <div className="relative">
              <img src={data.user.avatar} className="w-32 h-32 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_#000]" />
              <div className="absolute -bottom-2 -right-2 bg-accent-yellow border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                  Lvl {data.user.level}
              </div>
           </div>
           
           <div className="flex-1 space-y-4 w-full">
                   <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                          <h1 className="text-4xl font-black">{data.user.name}</h1>
                          <p className="text-gray-500 font-medium">{data.user.handle} • {data.user.bio}</p>
                      </div>
                      <div className="flex gap-2">
                          {(data.user.role === 'TUTOR' || data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') && (
                            <DashboardToggle />
                          )}
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl font-bold text-sm hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_#000] active:translate-y-[2px] active:shadow-none"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                      </div>
                   </div>
               
               <XPTracker xp={data.user.xp} nextLevelXp={data.user.nextLevelXp} level={data.user.level} />
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-4 no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border-2 ${
                        activeTab === tab.id 
                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' 
                        : 'bg-white text-gray-500 border-transparent hover:border-black/10 hover:bg-white/80'
                    }`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "dashboard" && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Badges */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <StatCard label="Challenges" value={data.user.stats.challenges_completed} icon={Trophy} color="bg-accent-blue/10 text-accent-blue" />
                            <StatCard label="Sprints Won" value={data.user.stats.sprints_won} icon={Flame} color="bg-accent-pink/10 text-accent-pink" />
                            <StatCard label="Theory Mastered" value={data.user.stats.theory_mastered} icon={Star} color="bg-accent-yellow/10 text-accent-yellow" />
                            <StatCard label="Total XP" value={(data.user.xp / 1000).toFixed(1) + 'k'} icon={Zap} color="bg-purple-100 text-purple-600" />
                        </div>

                        <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5" /> Skills & Badges
                            </h3>
                            {data.user.skills && data.user.skills.length > 0 && (
                                <div className="mb-6 flex flex-wrap gap-2">
                                    {data.user.skills.map((skill: string) => (
                                        <span key={skill} className="px-2 py-1 bg-gray-100 rounded-md text-xs font-bold border border-black/10">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex flex-wrap gap-3">
                                <Badge name="Gestalt Guru" icon={Layout} color="bg-accent-blue text-white" />
                                <Badge name="Sprint Master" icon={Zap} color="bg-accent-yellow text-black" />
                                <Badge name="Kerning King" icon={Type} color="bg-accent-pink text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: LinkedIn Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-[#0077b5] to-[#005582] rounded-[32px] p-6 md:p-8 text-white shadow-xl relative overflow-hidden group mb-8">
                            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                                    <div>
                                        <div className="flex items-center gap-2 opacity-80 mb-2">
                                            <Linkedin className="w-5 h-5" />
                                            <span className="text-xs font-bold uppercase tracking-widest">LinkedIn Proof of Skill</span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black italic">Certified Product Designer</h2>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl font-mono text-xl font-bold">Top 5%</div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-end">
                                    <div className="flex gap-8 w-full md:w-auto">
                                        <div className="space-y-1">
                                            <div className="text-xs opacity-60 uppercase font-bold">Total XP</div>
                                            <div className="text-4xl font-black">{data.user.xp.toLocaleString()}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-xs opacity-60 uppercase font-bold">Skill Level</div>
                                            <div className="text-4xl font-black">Lvl {data.user.level}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto md:ml-auto">
                                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-[#0077b5] rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                                            <Share2 className="w-4 h-4" /> Share
                                        </button>
                                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-black/20 text-white rounded-xl font-bold text-sm hover:bg-black/30 transition-colors">
                                            <Download className="w-4 h-4" /> Asset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "courses" && (
                <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-accent-blue" /> Enrolled Courses
                    </h3>
                    {data.enrollments && data.enrollments.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {data.enrollments.map((course: any) => (
                                <div key={course.id} className="group bg-[#f8f7f4] border-2 border-transparent hover:border-black rounded-2xl p-6 transition-all hover:bg-white hover:shadow-[4px_4px_0px_0px_black]">
                                    <div className="flex gap-4 items-start mb-6">
                                        <div className={`w-16 h-16 rounded-xl ${course.thumbnail || 'bg-gray-200'} flex items-center justify-center border-2 border-black shrink-0 shadow-[2px_2px_0px_0px_black]`}>
                                            <span className="font-bold text-lg">{course.difficulty && course.difficulty[0]}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg mb-1 group-hover:text-accent-blue transition-colors line-clamp-1">{course.title}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-black/10 ${
                                                    course.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {course.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                            <span>Progress</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden border border-black/5">
                                            <div className="h-full bg-accent-blue border-r-2 border-black" style={{ width: `${course.progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">You haven't enrolled in any courses yet.</p>
                            <button className="mt-4 text-accent-blue font-black hover:underline">Explore Path →</button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "history" && (
                <div className="bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                        <HistoryIcon className="w-6 h-6 text-accent-pink" /> Activity History
                    </h3>
                    <div className="space-y-4">
                        {data.history && data.history.length > 0 ? (
                            data.history.map((item: any) => (
                                <div key={item.id} className="bg-[#f8f7f4] border-2 border-transparent hover:border-black rounded-2xl p-4 flex items-center justify-between transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 border-black/5 ${
                                            item.type === 'challenge' ? 'bg-accent-blue/10 text-accent-blue' :
                                            item.type === 'theory' ? 'bg-accent-pink/10 text-accent-pink' :
                                            'bg-accent-yellow/10 text-accent-yellow'
                                        }`}>
                                            {item.type === 'challenge' && <Trophy className="w-6 h-6" />}
                                            {item.type === 'theory' && <Star className="w-6 h-6" />}
                                            {item.type === 'sprint' && <Zap className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{item.title}</h4>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                <Clock className="w-3 h-3" /> {item.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-black text-xl">+{item.xp} XP</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 grayscale opacity-50">
                                <HistoryIcon className="w-12 h-12 mx-auto mb-4" />
                                <p className="font-bold">No recent activities found.</p>
                            </div>
                        )}
                    </div>
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
                             <TutorRequestForm userEmail={data.user.email} initialStatus={data.user.tutor_request_status} />
                        </div>
                    )}

                    {data.user.role === 'TUTOR' && (
                        <div className="mt-12 pt-12 border-t-2 border-dashed border-gray-100">
                             <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                                <PlusCircle className="w-6 h-6 text-accent-blue" /> Share your knowledge
                             </h4>
                             <p className="text-gray-500 font-medium mb-6">Create a new course. It will be live once approved by a Super Admin.</p>
                             <CourseCreationForm />
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function CourseCreationForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'UI Design',
        difficulty: 'Beginner',
        duration: '',
        thumbnail: '',
        video_url: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/courses/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus('success');
                setFormData({ title: '', description: '', category: 'UI Design', difficulty: 'Beginner', duration: '', thumbnail: '', video_url: '' });
            } else setStatus('error');
        } catch (err) {
            setStatus('error');
        }
    };

    if (status === 'success') return (
        <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h5 className="font-black text-green-700">Course Submitted!</h5>
            <p className="text-green-600 text-sm font-medium">Your course is now in the review queue.</p>
            <button onClick={() => setStatus('idle')} className="mt-4 text-xs font-black uppercase underline">Submit another</button>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <input 
                    placeholder="Course Title"
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-black outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                    <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-black outline-none"
                    >
                        {["UI Design", "UX Research", "Motion", "Frontend"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select 
                        value={formData.difficulty}
                        onChange={e => setFormData({...formData, difficulty: e.target.value})}
                        className="p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-black outline-none"
                    >
                        {["Beginner", "Intermediate", "Advanced"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            <textarea 
                placeholder="Course Description"
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium focus:border-black outline-none h-24"
            />
            <div className="grid md:grid-cols-3 gap-4">
                <input 
                    placeholder="Duration (e.g., 2h 30m)"
                    required
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-black outline-none"
                />
                <input 
                    placeholder="Thumbnail URL"
                    required
                    value={formData.thumbnail}
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-black outline-none"
                />
                <input 
                    placeholder="Video/YouTube URL"
                    required
                    value={formData.video_url}
                    onChange={e => setFormData({...formData, video_url: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-black outline-none"
                />
            </div>
            <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-accent-blue text-white font-black rounded-xl hover:brightness-110 disabled:opacity-50 transition-all border-2 border-black shadow-[4px_4px_0px_0px_black]"
            >
                {status === 'loading' ? 'Publishing...' : 'Submit Course for Review'}
            </button>
            {status === 'error' && <p className="text-red-500 text-xs font-bold text-center">Failed to submit course. Check all fields.</p>}
        </form>
    )
}

function TutorRequestForm({ userEmail, initialStatus }: { userEmail: string, initialStatus: string | null }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'PENDING'>(
        initialStatus === 'PENDING' ? 'PENDING' : 'idle'
    );
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        portfolio: '',
        expertise: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/tutor/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, email: userEmail })
            });
            if (res.ok) setStatus('success');
            else setStatus('error');
        } catch (err) {
            setStatus('error');
        }
    };

    if (status === 'success' || status === 'PENDING') return (
        <div className="bg-accent-yellow/10 border-4 border-black border-dashed p-8 rounded-[32px] text-center">
            <div className="w-20 h-20 bg-accent-yellow rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                <Rocket className="w-10 h-10 text-black" />
            </div>
            <h5 className="text-2xl font-black uppercase tracking-tighter mb-2">Application Submitted Successfully!</h5>
            <p className="text-gray-600 font-bold uppercase text-xs tracking-widest max-w-sm mx-auto">
                Design Hunt is reviewing your expertise. We've sent a confirmation to <span className="underline">{userEmail}</span>.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase">Status: Under Review</span>
                </div>
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <input 
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-black outline-none"
                />
                <input 
                    placeholder="Current Job/Role"
                    required
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-black outline-none"
                />
            </div>
            <input 
                placeholder="Portfolio Link (e.g., Behance, Dribbble)"
                value={formData.portfolio}
                onChange={e => setFormData({...formData, portfolio: e.target.value})}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold focus:border-black outline-none"
            />
            <textarea 
                placeholder="Tell us about your area of expertise..."
                required
                value={formData.expertise}
                onChange={e => setFormData({...formData, expertise: e.target.value})}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium focus:border-black outline-none h-24"
            />
            <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-black text-white font-black rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all shadow-[4px_4px_0px_0px_black] active:translate-y-[2px] active:shadow-none"
            >
                {status === 'loading' ? 'Submitting...' : 'Submit Application'}
            </button>
            {status === 'error' && <p className="text-red-500 text-xs font-bold text-center mt-2">Failed to submit. You might already have a pending request.</p>}
        </form>
    )
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className={`p-4 rounded-2xl border-2 border-transparent hover:border-black/5 transition-all bg-white shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</div>
        </div>
    )
}

function Badge({ name, icon: Icon, color }: any) {
    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs ${color} shadow-sm border-2 border-black/10`}>
            <Icon className="w-3.5 h-3.5" />
            {name}
        </div>
    )
}
