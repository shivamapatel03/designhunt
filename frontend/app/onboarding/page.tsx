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
import { cn } from "@/lib/utils";
import { Celebrate } from "@/components/ui/Celebrate";

// --- Components & Steps ---

const OnboardingContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black selection:text-white transition-all duration-500 overflow-hidden pt-4 md:pt-16">
    <div className="fixed top-4 left-4 md:top-6 md:left-12 z-[110]">
      <Link href="/" className="flex items-center gap-2 group" translate="no">
        <div className="text-xl md:text-2xl font-bold tracking-tighter text-black font-plus-jakarta transition-colors group-hover:text-blue-600" suppressHydrationWarning>
          Designhunt<span className="text-[#2B7FFF]">.</span>
        </div>
      </Link>
    </div>
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
        className="mb-4 md:mb-6 flex flex-col items-center"
    >
        <h1 className="text-3xl font-black text-black tracking-tight mb-1 md:mb-1.5 font-plus-jakarta">
            Master Design Principles
        </h1>
        <p className="text-gray-300 text-2xl font-black tracking-tight mb-4 md:mb-5 font-plus-jakarta">
            One Level at a Time.
        </p>
        <p className="text-gray-400 text-[13px] md:text-sm font-medium max-w-[280px] md:max-w-[400px] mx-auto font-plus-jakarta leading-relaxed mb-6 md:mb-8">
            Stop guessing. Learn the science behind great interfaces with a personalized roadmap.
        </p>
        <div className="w-56 h-56 md:w-64 md:h-64 transition-transform hover:scale-105 duration-500 mb-6 md:mb-8 flex items-center justify-center">
            <img 
                src="/onboardingavatars/firstonboard.png" 
                alt="Welcome" 
                className="w-full h-full object-contain"
            />
        </div>
    </motion.div>
    <button 
      onClick={next}
      className="group px-12 py-4 bg-black text-white font-black text-[11px] md:text-[12px] rounded-[20px] transition-all shadow-[0_5px_0_0_#222] active:shadow-none active:translate-y-[5px] flex items-center gap-2 uppercase tracking-widest font-plus-jakarta"
    >
      Let's Go <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// --- Screen 2: Topics ---
const Screen2Topics = ({ data, setData, next }: { data: any, setData: any, next: () => void }) => {
    const [isCelebrating, setIsCelebrating] = useState(false);
    const topics = [
        { id: "UI/UX Design", image: "/onboardingavatars/UIUXDESIGN.png" },
        { id: "User Research", image: "/onboardingavatars/User Research.png" },
        { id: "Typography", image: "/onboardingavatars/Typography.png" },
        { id: "Color Theory", image: "/onboardingavatars/Color Theory.png" },
        { id: "Design Systems", image: "/onboardingavatars/Design Systems.png" },
        { id: "Layout & Grid", image: "/onboardingavatars/Layout and Grid.png" },
    ];

    const toggleTopic = (id: string) => {
        const current = data.topics_to_learn || [];
        const updated = current.includes(id) 
            ? current.filter((t: string) => t !== id) 
            : [...current, id];
        setData({ ...data, topics_to_learn: updated });
    };

    const handleContinue = () => {
        setIsCelebrating(true);
        setTimeout(() => {
            next();
        }, 1500);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full">
            {isCelebrating && <Celebrate />}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-black tracking-tight font-plus-jakarta">What do you want to learn?</h2>
                <p className="text-gray-400 text-sm font-medium mt-2 font-plus-jakarta">Select the topics that interest you most.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-[500px] px-4">
                {topics.map(t => {
                    const isSelected = data.topics_to_learn?.includes(t.id);
                    return (
                        <button
                            key={t.id}
                            onClick={() => toggleTopic(t.id)}
                            className={cn(
                                "p-3 rounded-[24px] border-2 transition-all flex flex-col items-center gap-1.5 group relative aspect-square justify-center font-plus-jakarta",
                                "translate-y-[-2px] active:translate-y-[0px]",
                                isSelected 
                                ? "border-[#2B7FFF] bg-white border-b-[4px] active:border-b-[2px]" 
                                : "border-gray-200 bg-white border-b-[4px] active:border-b-[2px] hover:border-gray-300"
                            )}
                        >
                            <div className="relative w-20 h-20 transition-transform duration-500 group-hover:scale-110">
                                <Image 
                                    src={t.image} 
                                    alt={t.id} 
                                    fill 
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-[10px] font-black text-black tracking-tight text-center leading-tight">{t.id}</span>
                        </button>
                    );
                })}
            </div>
            <button 
                disabled={!data.topics_to_learn?.length || isCelebrating}
                onClick={handleContinue}
                className="mt-8 px-10 py-3.5 bg-black text-white font-black text-[11px] rounded-[16px] transition-all shadow-[0_4px_0_0_#222] active:shadow-none active:translate-y-[4px] disabled:opacity-30 uppercase tracking-widest font-plus-jakarta"
            >
                {isCelebrating ? "Got it!..." : "Continue"}
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
                <h2 className="text-3xl font-black text-black tracking-tight font-plus-jakarta">What's your level?</h2>
                <p className="text-gray-400 text-sm font-medium mt-2 font-plus-jakarta">This helps us tailor your starting point.</p>
            </div>
            <div className="space-y-4 w-full max-w-[500px]">
                {levels.map(l => {
                    const isSelected = data.skill_level === l.id;
                    return (
                        <button
                            key={l.id}
                            onClick={() => { setData({ ...data, skill_level: l.id }); setTimeout(next, 400); }}
                            className={cn(
                                "w-full p-5 rounded-[24px] border-2 transition-all flex flex-col items-start gap-1 font-plus-jakarta relative",
                                "translate-y-[-2px] active:translate-y-[0px]",
                                isSelected 
                                ? "border-[#2B7FFF] bg-white border-b-[4px] active:border-b-[2px]" 
                                : "border-gray-200 bg-white border-b-[4px] active:border-b-[2px] hover:border-gray-300"
                            )}
                        >
                            <span className="text-base font-black text-black leading-tight">{l.label}</span>
                            <span className="text-[11px] font-medium text-gray-400">{l.sub}</span>
                        </button>
                    );
                })}
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
                <h2 className="text-3xl font-black text-black tracking-tight font-plus-jakarta">How much time per day?</h2>
                <p className="text-gray-400 text-sm font-medium mt-2 font-plus-jakarta">Commit to a goal and we'll keep you on track.</p>
            </div>
            <div className="space-y-3.5 w-full max-w-[500px]">
                {goals.map(g => {
                    const isSelected = data.daily_goal === g.id;
                    return (
                        <button
                            key={g.id}
                            onClick={() => { setData({ ...data, daily_goal: g.id }); setTimeout(next, 400); }}
                            className={cn(
                                "w-full p-5 bg-white border-2 transition-all rounded-[24px] flex items-center justify-between group font-plus-jakarta relative",
                                "translate-y-[-2px] active:translate-y-[0px]",
                                isSelected 
                                ? "border-[#2B7FFF] border-b-[4px] active:border-b-[2px]" 
                                : "border-gray-200 border-b-[4px] active:border-b-[2px] hover:border-gray-300"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <g.icon className={`w-5 h-5 ${g.color}`} />
                                <span className="text-sm font-black text-black uppercase tracking-wider">{g.label}</span>
                            </div>
                            <span className="text-xs font-black text-gray-300">{g.time}</span>
                        </button>
                    );
                })}
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
                <h2 className="text-3xl font-black text-black tracking-tight font-plus-jakarta">Why are you learning?</h2>
                <p className="text-gray-400 text-sm font-medium mt-2 font-plus-jakarta">Knowing your motivation helps us motivate you better.</p>
            </div>
            <div className="space-y-4 w-full max-w-[500px]">
                {motivations.map(m => {
                    const isSelected = data.motivation === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => { setData({ ...data, motivation: m.id }); setTimeout(next, 400); }}
                            className={cn(
                                "w-full p-5 bg-white border-2 transition-all rounded-[24px] flex items-center gap-5 group font-plus-jakarta relative",
                                "translate-y-[-2px] active:translate-y-[0px]",
                                isSelected 
                                ? "border-[#2B7FFF] border-b-[4px] active:border-b-[2px]" 
                                : "border-gray-200 border-b-[4px] active:border-b-[2px] hover:border-gray-300"
                            )}
                        >
                            <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center border-b-2 border-gray-200 group-hover:border-gray-300 transition-colors">
                                <m.icon className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-sm font-black text-black tracking-tight">{m.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// --- Screen 6: Create Account ---
const Screen6Auth = () => {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full text-center">
        <div className="mb-8 flex flex-col items-center">
            <div className="w-32 h-32 mb-6 transition-transform hover:scale-105 duration-500 flex items-center justify-center">
                <img 
                    src="/onboardingavatars/saveprogress.png" 
                    alt="Save Progress" 
                    className="w-full h-full object-contain"
                />
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight font-plus-jakarta">Save your progress</h1>
            <p className="text-gray-400 text-xs font-medium max-w-[260px] mx-auto italic font-plus-jakarta leading-relaxed">
                "The best time to start was yesterday. The second best time is now."
            </p>
        </div>
        
        <div className="w-full space-y-3.5 max-w-[300px]">
            <Link 
                href="/signup?redirect=/onboarding"
                className="w-full py-3.5 bg-black text-white font-black text-[10px] rounded-[18px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_0_#222] active:shadow-none active:translate-y-[4px] uppercase tracking-widest font-plus-jakarta"
            >
                Create Account <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link 
                href="/login?redirect=/onboarding"
                className="w-full py-3.5 bg-white border-2 border-black text-black font-black text-[10px] rounded-[18px] flex items-center justify-center gap-2 transition-all border-b-[4px] active:border-b-[2px] active:translate-y-[2px] hover:bg-gray-50 uppercase tracking-widest font-plus-jakarta"
            >
                Sign In
            </Link>

            <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-[1px] bg-black/5" />
                <span className="text-[9px] font-black text-gray-300 uppercase font-plus-jakarta">Or</span>
                <div className="flex-1 h-[1px] bg-black/5" />
            </div>
            
            {/* Google Signup */}
            <button 
                onClick={() => window.location.href = '/api/auth/google'}
                className="w-full flex items-center justify-center py-2.5 bg-white border-2 border-gray-100 border-b-[3px] rounded-[16px] transition-all active:border-b-[1px] active:translate-y-[2px] hover:bg-gray-50 group"
            >
                <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-[9px] font-black text-black uppercase tracking-widest font-plus-jakarta">Google</span>
            </button>
        </div>
      </div>
    );
};

// --- Screen 7: Success ---
const Screen7Success = ({ dailyGoal, next }: { dailyGoal: string, next: () => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full text-center">
    <Celebrate />
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
