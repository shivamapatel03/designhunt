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
  Trash2,
  Plus,
  X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { ProfileStatsCards } from "@/components/profile/ProfileStatsCards";
import { LearningProgressTracker } from "@/components/profile/LearningProgressTracker";
import { SkillActivityCard } from "@/components/profile/SkillActivityCard";
import { updateOnboardingData } from "@/app/actions/onboarding";

const AVAILABLE_SKILLS = [
  { title: "Typography", percentage: 73, status: "best", themeColor: "#FFF8D6" },
  { title: "UI/UX Design", percentage: 45, status: "pending", themeColor: "#E0F2FE" },
  { title: "Motion & Animation", percentage: 100, status: "completed", themeColor: "#F0FDF4" },
  { title: "Color Theory", percentage: 20, status: "pending", themeColor: "#FFEDD5" },
  { title: "Visual Hierarchy", percentage: 10, status: "pending", themeColor: "#F3E8FF" },
  { title: "Layout & Grid", percentage: 65, status: "pending", themeColor: "#ECFDF5" },
  { title: "Design Systems", percentage: 30, status: "pending", themeColor: "#F5F3FF" },
  { title: "UX Laws", percentage: 15, status: "pending", themeColor: "#FEF2F2" },
  { title: "User Research", percentage: 5, status: "pending", themeColor: "#F8FAFC" },
];

function ProfileContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [userSkills, setUserSkills] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
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
      
      // Initialize skills from profile topics
      const topics = profile.user.topics_to_learn || [];
      const initialSkills = topics.length > 0 
        ? topics.map((t: { title: string, percentage: number }) => {
            const staticInfo = AVAILABLE_SKILLS.find(s => s.title === t.title) || { themeColor: "#F3F4F6" };
            return {
              title: t.title,
              percentage: t.percentage || 0,
              status: t.percentage === 100 ? "completed" : t.percentage > 70 ? "best" : "pending",
              themeColor: staticInfo.themeColor
            };
          })
        : [];
      setUserSkills(initialSkills);
    } catch (err) {
      console.error(err);
    }
  };

  const addSkill = async (skill: any) => {
    const updatedSkills = [...userSkills, skill];
    setUserSkills(updatedSkills);
    setIsAddingSkill(false);
    
    // Persist to database
    const topics = updatedSkills.map(s => s.title);
    await updateOnboardingData({ topics_to_learn: topics });
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
    { id: "activity", label: "Activity", icon: Activity },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-20 font-[family-name:var(--font-plus-jakarta)]">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
          {/* Profile Section */}
          <div className="flex items-center gap-5 bg-white p-6 rounded-[32px] border border-black/5 flex-1">
             <Link href="/profile/edit" className="relative group cursor-pointer shrink-0">
                <img 
                  src={user.avatar} 
                  className="w-20 h-20 rounded-full border-2 border-white relative z-10 object-cover bg-gray-50 transition-all group-hover:brightness-90 shadow-sm" 
                  alt="Avatar" 
                />
                <div className="absolute -bottom-1 -right-1 bg-black text-white p-1.5 rounded-full z-20 border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                  <Edit3 className="w-3.5 h-3.5" />
                </div>
             </Link>
             <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-black truncate">
                  {user.name}
                </h1>
                <p className="text-[11px] font-bold text-gray-400 leading-none mt-1.5 uppercase tracking-widest">{user.handle}</p>
                <div className="flex items-center gap-2 mt-4 text-gray-400 font-medium">
                  <Calendar className="w-4 h-4 text-gray-300" />
                  <span className="text-xs font-bold leading-none">{today}</span>
                </div>
             </div>
          </div>

          {/* Learning Stats moved next to profile */}
          <div className="w-full md:w-[480px]">
             <ProfileStatsCards 
               streak={user.streak}
               xp={user.xp}
             />
          </div>
        </div>

        {/* Tab section removed as requested */}

        {/* Skills Section */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Skill Overview</h3>
              <button 
                onClick={() => setIsAddingSkill(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] font-black rounded-xl hover:bg-gray-800 transition-all active:scale-95 uppercase tracking-widest"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userSkills.map((skill: any, idx: number) => (
                <SkillActivityCard 
                  key={skill.title}
                  title={skill.title}
                  percentage={skill.percentage}
                  status={skill.status}
                  themeColor={skill.themeColor}
                />
              ))}
           </div>
        </div>

        {/* Add Skill Modal Overlay */}
        <AnimatePresence>
          {isAddingSkill && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddingSkill(false)}
                className="fixed inset-0 bg-black/40 z-[60]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[32px] p-8 z-[70] shadow-2xl border border-black/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-black tracking-tight">Add New Skill ✨</h3>
                    <p className="text-xs font-medium text-gray-400 mt-1">Select a topic from the theory library</p>
                  </div>
                  <button onClick={() => setIsAddingSkill(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {AVAILABLE_SKILLS.filter(s => !userSkills.find(us => us.title === s.title)).map(skill => (
                    <button
                      key={skill.title}
                      onClick={() => addSkill(skill)}
                      className="p-4 bg-gray-50 border-2 border-transparent hover:border-black/10 hover:bg-gray-100 rounded-2xl transition-all text-left group"
                    >
                      <span className="text-xs font-bold text-gray-400 group-hover:text-black transition-colors">{skill.title}</span>
                    </button>
                  ))}
                </div>

                {AVAILABLE_SKILLS.filter(s => !userSkills.find(us => us.title === s.title)).length === 0 && (
                  <div className="py-10 text-center">
                    <p className="text-sm font-bold text-gray-300">You've added all available skills!</p>
                  </div>
                )}
              </motion.div>
            </>
          )}
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
