"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Target, 
  Zap, 
  ArrowRight, 
  Monitor, 
  Search, 
  Type, 
  Palette, 
  Layers, 
  PenTool,
  CheckCircle2,
  Loader2,
  User,
  Clock,
  Briefcase,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Award
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { updateOnboardingData } from "@/app/actions/onboarding";
import Image from "next/image";

// --- Components & Steps ---

const OnboardingContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black selection:text-white transition-all duration-500 overflow-hidden pt-16">
    {children}
  </div>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="fixed top-0 left-0 w-full h-[4px] bg-black/5 z-[100] overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
    />
  </div>
);

// --- Screen 1: Welcome ---
const Screen1Welcome = ({ next }: { next: () => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full text-center">
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
    >
        <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Sparkles className="w-10 h-10 text-blue-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">
            Master Design Principles <br /> <span className="text-gray-300 italic">One Level at a Time.</span>
        </h1>
        <p className="text-gray-500 text-lg font-medium max-w-lg mx-auto">
            Stop guessing. Learn the science behind great interfaces with a personalized roadmap.
        </p>
    </motion.div>
    <button 
      onClick={next}
      className="group px-12 py-5 bg-black text-white font-bold text-sm rounded-[24px] hover:bg-gray-900 transition-all shadow-[0_8px_0_0_#222] active:shadow-none active:translate-y-[8px] flex items-center gap-3 uppercase tracking-widest"
    >
      Let's Go <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// --- Screen 2: Topics ---
const Screen2Topics = ({ data, setData, next }: { data: any, setData: any, next: () => void }) => {
    const topics = [
        { id: "UI/UX Design", icon: Monitor, color: "bg-purple-50 text-purple-600" },
        { id: "User Research", icon: Search, color: "bg-blue-50 text-blue-600" },
        { id: "Typography", icon: Type, color: "bg-orange-50 text-orange-600" },
        { id: "Color Theory", icon: Palette, color: "bg-pink-50 text-pink-600" },
        { id: "Design Systems", icon: Layers, color: "bg-emerald-50 text-emerald-600" },
        { id: "Layout & Grid", icon: PenTool, color: "bg-indigo-50 text-indigo-600" },
    ];

    const toggleTopic = (id: string) => {
        const current = data.topics_to_learn || [];
        const updated = current.includes(id) 
            ? current.filter((t: string) => t !== id) 
            : [...current, id];
        setData({ ...data, topics_to_learn: updated });
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-black tracking-tight">What do you want to learn?</h2>
                <p className="text-gray-400 text-sm font-medium mt-2">Select the topics that interest you most.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {topics.map(t => (
                    <button
                        key={t.id}
                        onClick={() => toggleTopic(t.id)}
                        className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 group ${
                            data.topics_to_learn?.includes(t.id) 
                            ? "border-black bg-white shadow-xl scale-[1.02]" 
                            : "border-transparent bg-white/50 hover:bg-white hover:border-black/5"
                        }`}
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.color}`}>
                            <t.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-black">{t.id}</span>
                    </button>
                ))}
            </div>
            <button 
                disabled={!data.topics_to_learn?.length}
                onClick={next}
                className="mt-12 px-12 py-4 bg-black text-white font-bold text-sm rounded-[20px] transition-all shadow-[0_4px_0_0_#222] active:shadow-none active:translate-y-[4px] disabled:opacity-30 uppercase tracking-widest"
            >
                Continue
            </button>
        </div>
    );
};

// --- Screen 3: Level ---
const Screen3Level = ({ data, setData, next }: { data: any, setData: any, next: () => void }) => {
    const levels = [
        { id: "Beginner", label: "🌱 Complete Beginner", sub: "I'm just starting out." },
        { id: "Intermediate", label: "🎨 I know the basics", sub: "I've built a few things." },
        { id: "Advanced", label: "🚀 I want to level up", sub: "I'm a pro looking for more." },
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-black tracking-tight">What's your level?</h2>
                <p className="text-gray-400 text-sm font-medium mt-2">This helps us tailor your starting point.</p>
            </div>
            <div className="space-y-4 w-full">
                {levels.map(l => (
                    <button
                        key={l.id}
                        onClick={() => { setData({ ...data, skill_level: l.id }); next(); }}
                        className="w-full p-6 bg-white border-2 border-transparent hover:border-black/5 rounded-[32px] flex flex-col items-start transition-all hover:shadow-lg active:scale-[0.98] group"
                    >
                        <span className="text-lg font-bold text-black mb-1">{l.label}</span>
                        <span className="text-xs font-medium text-gray-400">{l.sub}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Screen 4: Time (Duolingo style) ---
const Screen4Time = ({ data, setData, next }: { data: any, setData: any, next: () => void }) => {
    const goals = [
        { id: "5", label: "Casual", time: "5 min", icon: Zap, color: "text-yellow-500" },
        { id: "10", label: "Regular", time: "10 min", icon: TrendingUp, color: "text-green-500" },
        { id: "15", label: "Serious", time: "15 min", icon: Target, color: "text-blue-500" },
        { id: "20", label: "Intense", time: "20 min+", icon: Award, color: "text-purple-500" },
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-black tracking-tight">How much time per day?</h2>
                <p className="text-gray-400 text-sm font-medium mt-2">Commit to a goal and we'll keep you on track.</p>
            </div>
            <div className="space-y-3 w-full">
                {goals.map(g => (
                    <button
                        key={g.id}
                        onClick={() => { setData({ ...data, daily_goal: g.id }); next(); }}
                        className={`w-full p-6 bg-white border-2 transition-all rounded-[32px] flex items-center justify-between group ${
                            data.daily_goal === g.id ? "border-black shadow-md" : "border-transparent hover:border-black/5"
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <g.icon className={`w-6 h-6 ${g.color}`} />
                            <span className="text-sm font-bold text-black uppercase tracking-wider">{g.label}</span>
                        </div>
                        <span className="text-sm font-black text-gray-300">{g.time}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Screen 5: Motivation ---
const Screen5Motivation = ({ data, setData, next }: { data: any, setData: any, next: () => void }) => {
    const motivations = [
        { id: "job", label: "Get a job in design", icon: Briefcase },
        { id: "freelance", label: "Freelance / side income", icon: Palette },
        { id: "improve", label: "Improve my current work", icon: TrendingUp },
        { id: "curious", label: "Just curious", icon: HelpCircle },
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-black tracking-tight">Why are you learning?</h2>
                <p className="text-gray-400 text-sm font-medium mt-2">Knowing your motivation helps us motivate you better.</p>
            </div>
            <div className="space-y-4 w-full">
                {motivations.map(m => (
                    <button
                        key={m.id}
                        onClick={() => { setData({ ...data, motivation: m.id }); next(); }}
                        className="w-full p-6 bg-white border-2 border-transparent hover:border-black/5 rounded-[32px] flex items-center gap-5 transition-all hover:shadow-lg active:scale-[0.98]"
                    >
                        <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                            <m.icon className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-sm font-bold text-black">{m.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Screen 6: Create Account ---
const Screen6Auth = () => {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full text-center">
        <div className="mb-10">
            <div className="w-24 h-24 bg-blue-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-sm">
                <User className="w-12 h-12 text-blue-500" />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Save your progress</h1>
            <p className="text-gray-400 text-sm font-medium max-w-xs mx-auto italic">
                "The best time to start was yesterday. The second best time is now."
            </p>
        </div>
        
        <div className="w-full space-y-4">
            <Link 
                href="/signup?redirect=/onboarding"
                className="w-full py-5 bg-black text-white font-bold text-[11px] rounded-[24px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_0_#222] active:shadow-none active:translate-y-[4px] uppercase tracking-widest"
            >
                Create Account <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-[1px] bg-black/5" />
                <span className="text-[10px] font-black text-gray-300 uppercase">Or</span>
                <div className="flex-1 h-[1px] bg-black/5" />
            </div>
            <Link 
                href="/login?redirect=/onboarding"
                className="w-full py-5 bg-white border-2 border-black text-black font-bold text-[11px] rounded-[24px] flex items-center justify-center gap-2 transition-all hover:bg-gray-50 active:translate-y-[2px] uppercase tracking-widest"
            >
                Sign In
            </Link>
        </div>
      </div>
    );
};

// --- Screen 7: Success ---
const Screen7Success = ({ dailyGoal, next }: { dailyGoal: string, next: () => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full text-center">
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="mb-12"
    >
        <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-sm border border-green-100">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-4xl font-black text-black tracking-tight mb-4">Your path is ready! 🎉</h1>
        
        <div className="flex flex-col md:flex-row gap-6 mt-10">
            {/* Goal Preview */}
            <div className="flex-1 bg-white p-8 rounded-[40px] border border-black/5 shadow-sm text-left">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Daily Streak Goal</span>
                </div>
                <p className="text-2xl font-black text-black">{dailyGoal} mins</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Keep the flame alive for 365 days.</p>
            </div>
            
            {/* Lesson Preview */}
            <div className="flex-1 bg-black p-8 rounded-[40px] shadow-xl text-left relative overflow-hidden group cursor-pointer" onClick={next}>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">First Lesson</span>
                    </div>
                    <p className="text-2xl font-black text-white">Visual Hierarchy</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">Learn how to guide the eye.</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            </div>
        </div>
    </motion.div>
    
    <button 
      onClick={next}
      className="px-12 py-5 bg-black text-white font-bold text-sm rounded-[24px] hover:bg-gray-900 transition-all shadow-[0_8px_0_0_#222] active:shadow-none active:translate-y-[8px] uppercase tracking-widest flex items-center gap-3"
    >
      Go to learning profile <ArrowRight className="w-5 h-5" />
    </button>
  </div>
);

// --- Main Page Component ---

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [onboardingData, setOnboardingData] = useState({
    topics_to_learn: [] as string[],
    skill_level: "",
    daily_goal: "",
    motivation: "",
    avatar: ""
  });

  // Persistence logic
  useEffect(() => {
    const saved = localStorage.getItem('new_onboarding_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOnboardingData(parsed.data);
        setCurrentStep(parsed.step);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('new_onboarding_progress', JSON.stringify({
      data: onboardingData,
      step: currentStep
    }));
  }, [onboardingData, currentStep]);

  const nextStep = () => setCurrentStep(prev => prev + 1);

  const finalizeOnboarding = async () => {
    if (!user) return;
    setLoading(true);
    try {
        const res = await updateOnboardingData({
            ...onboardingData,
            onboarding_completed: true
        });
        if (res.success) {
            localStorage.removeItem('new_onboarding_progress');
            router.push('/profile');
        }
    } catch (err) {
        console.error("Finalization Error:", err);
    } finally {
        setLoading(false);
    }
  };

  // Auto-finalize if user logs in at Step 5
  useEffect(() => {
    if (currentStep === 5 && user) {
        // Move to success screen
        setCurrentStep(6); 
    }
  }, [user, currentStep]);

  const progressPercentage = ((currentStep) / 6) * 100;

  return (
    <OnboardingContainer>
      <ProgressBar progress={progressPercentage} />
      
      <AnimatePresence mode="wait">
        <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="flex-1 flex flex-col"
        >
            {currentStep === 0 && <Screen1Welcome next={nextStep} />}
            {currentStep === 1 && <Screen2Topics data={onboardingData} setData={setOnboardingData} next={nextStep} />}
            {currentStep === 2 && <Screen3Level data={onboardingData} setData={setOnboardingData} next={nextStep} />}
            {currentStep === 3 && <Screen4Time data={onboardingData} setData={setOnboardingData} next={nextStep} />}
            {currentStep === 4 && <Screen5Motivation data={onboardingData} setData={setOnboardingData} next={nextStep} />}
            {currentStep === 5 && (
                user ? (
                   <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-black text-black">Building your roadmap...</h1>
                        <button onClick={nextStep} className="mt-8 text-xs font-bold text-gray-300 uppercase tracking-widest hover:text-black">Skip to summary</button>
                    </div>
                ) : (
                    <Screen6Auth />
                )
            )}
            {currentStep === 6 && (
                <Screen7Success 
                    dailyGoal={onboardingData.daily_goal || "10"} 
                    next={finalizeOnboarding} 
                />
            )}
            {loading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[200] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                </div>
            )}
        </motion.div>
      </AnimatePresence>
    </OnboardingContainer>
  );
}
