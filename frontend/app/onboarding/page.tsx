"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Upload, Sparkles, Check, Globe, ChevronDown, CheckCircle2, Loader2, X } from "lucide-react";
import { updateAvatar, updateOnboardingData } from "@/app/actions/onboarding";
import { useAuth } from "@/components/providers/auth-provider";

const ANIMATED_CHARACTERS = [
  { id: 'builder_anim', name: 'The Builder', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Technologist.png' },
  { id: 'artist_anim', name: 'The Artist', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Artist.png' },
  { id: 'analyst_anim', name: 'The Analyst', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Detective.png' },
  { id: 'leader_anim', name: 'The Leader', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Teacher.png' },
  { id: 'visionary_anim', name: 'The Visionary', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Astronaut.png' },
  { id: 'explorer_anim', name: 'The Explorer', url: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Superhero.png' },
];

const STATIC_CHARACTERS = [
  { id: 'char1', name: 'The Builder', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Builder&backgroundColor=ffdfbf' },
  { id: 'char2', name: 'The Artist', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Artist&backgroundColor=c0aede' },
  { id: 'char3', name: 'The Analyst', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Analyst&backgroundColor=b6e3f4' },
  { id: 'char4', name: 'The Leader', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Leader&backgroundColor=ffdfbf' },
  { id: 'char5', name: 'The Visionary', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Visionary&backgroundColor=d1d4f9' },
  { id: 'char6', name: 'The Explorer', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Explorer&backgroundColor=ffd5dc' },
];

// --- Components moved outside to prevent re-animation on state change ---

const Header = ({ progress }: { progress: number }) => (
    <>
      <div className="w-full h-1 bg-gray-100 fixed top-0 left-0 z-50 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="h-full bg-black"
        />
      </div>
      <div className="w-full p-6 md:p-8 flex justify-between items-center fixed top-1 left-0 z-40 pointer-events-none">
        <div className="flex items-center pointer-events-auto">
          <div className="text-xl font-black tracking-tight text-black">
            Designhunt.
          </div>
        </div>
      </div>
    </>
);

const SkipButton = ({ next }: { next: () => void }) => (
    <button 
        onClick={next} 
        className="mt-4 text-[10px] font-bold text-gray-400 hover:text-black hover:underline underline-offset-4 uppercase tracking-widest transition-colors"
    >
        Skip for now
    </button>
);

const Step0Welcome = ({ userName, next }: { userName: string, next: () => void }) => (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full relative z-10 text-center">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          <span className="text-gray-300">Welcome <Sparkles className="inline w-6 h-6 text-yellow-400 mb-1" /></span> {userName}
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight opacity-80">
          Start Your Creative Learning Journey
        </h2>
      </div>
      <div className="mb-10 relative w-48 h-48 md:w-56 md:h-56">
        <Image src="/onbording images/study.png" alt="Study" fill className="object-contain" priority />
      </div>
      <button 
        onClick={next}
        className="px-10 py-3 bg-black text-white font-bold text-xs rounded-full hover:bg-gray-900 transition-all active:scale-95"
      >
        Start Learning
      </button>
    </div>
);

const Step1Goal = ({ data, setData, next }: { data: any, setData: any, next: () => void }) => {
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [customGoal, setCustomGoal] = useState("");
    const goals = ["Improve Skills", "Get a Job", "Freelancing", "Other"];

    const handleGoalClick = (goal: string) => {
        if (goal === "Other") {
            setIsAddingCustom(true);
        } else {
            setData({ ...data, goal });
        }
    };

    const confirmCustom = () => {
        if (customGoal.trim()) {
            setData({ ...data, goal: customGoal });
            setIsAddingCustom(false);
        }
    };

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full relative z-10 text-center">
        <AnimatePresence mode="wait">
            {!isAddingCustom ? (
                <motion.div 
                    key="grid"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex flex-col items-center w-full"
                >
                    <div className="mb-6">
                        <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">This helps us personalize your journey</p>
                        <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight">What’s your goal with design?</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 w-full max-w-[360px]">
                        {goals.map(goal => (
                            <button key={goal} 
                                onClick={() => handleGoalClick(goal)}
                                className={`p-3.5 rounded-xl font-bold text-[11px] transition-all border-2 ${data.goal === goal || (goal === "Other" && data.goal && !goals.includes(data.goal)) ? 'border-[#6366F1] bg-[#6366F1] text-white' : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                {goal === "Other" && data.goal && !goals.includes(data.goal) ? data.goal : goal}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={next} 
                        disabled={!data.goal}
                        className="mt-8 w-full max-w-[140px] py-3 bg-black text-white font-bold text-[11px] rounded-full transition-all active:scale-98 disabled:opacity-50"
                    >
                        Next
                    </button>
                    <SkipButton next={next} />
                </motion.div>
            ) : (
                <motion.div 
                    key="custom-input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center w-full max-w-[340px]"
                >
                    <div className="mb-8">
                        <h3 className="text-xl font-black mb-2">Tell us more</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">What specific design journey are you on?</p>
                    </div>
                    <div className="w-full relative">
                        <input 
                            type="text"
                            autoFocus
                            placeholder="Type your goal here..."
                            value={customGoal}
                            onChange={(e) => setCustomGoal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && confirmCustom()}
                            className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-xs focus:border-black outline-none transition-all placeholder:text-gray-300 pr-12"
                        />
                        <button 
                            onClick={confirmCustom}
                            disabled={!customGoal.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-xl disabled:opacity-20 transition-all active:scale-90"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <button 
                        onClick={() => setIsAddingCustom(false)}
                        className="mt-6 text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest underline decoration-1 underline-offset-4"
                    >
                        Back to options
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    );
};

const Step2Skill = ({ data, setData, next }: { data: any, setData: any, next: () => void }) => {
    const levels = [{ name: "Beginner", icon: "📏" }, { name: "Intermediate", icon: "🌓" }, { name: "Advanced", icon: "🌑" }];
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full relative z-10 text-center">
        <div className="mb-6">
          <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Tell us about your background</p>
          <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight">What’s your current skill level?</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5 w-full max-w-[460px]">
          {levels.map(lvl => (
            <button key={lvl.name} 
                onClick={() => setData({ ...data, skill_level: lvl.name })}
                className={`px-5 py-3.5 rounded-xl font-bold text-[11px] transition-all border-2 flex items-center gap-2 ${data.skill_level === lvl.name ? 'border-[#6366F1] bg-[#6366F1] text-white' : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {lvl.name} <span className="text-sm">{lvl.icon}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={next} 
          disabled={!data.skill_level}
          className="mt-8 w-full max-w-[140px] py-3 bg-black text-white font-bold text-[11px] rounded-full transition-all active:scale-98 disabled:opacity-50"
        >
          Next
        </button>
        <SkipButton next={next} />
      </div>
    );
};

const Step3Topics = ({ data, setData, next }: { data: any, setData: any, next: () => void }) => {
    const topics = ["Typography", "Motion", "Animation", "UI/UX", "Colour Theory", "UI Laws", "Design Fundamentals", "Design Thinking", "Design Systems", "Design Tools", "Design Principle", "Wireframe"];
    const toggleTopic = (topic: string) => {
        const current = data.topics_to_learn;
        if (current.includes(topic)) {
            setData({ ...data, topics_to_learn: current.filter((t: string) => t !== topic) });
        } else if (current.length < 3) {
            setData({ ...data, topics_to_learn: [...current, topic] });
        }
    };
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full relative z-10 text-center">
        <div className="mb-6">
          <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Select your primary interests</p>
          <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight">What do you want to learn?</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 w-full max-w-[560px]">
          {topics.map(topic => (
            <button key={topic} 
                onClick={() => toggleTopic(topic)}
                className={`p-3 rounded-xl font-bold text-[10px] transition-all border-2 ${data.topics_to_learn.includes(topic) ? 'border-[#6366F1] bg-[#6366F1] text-white' : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {topic}
            </button>
          ))}
        </div>
        <p className="text-[10px] font-bold text-black mt-5 uppercase tracking-wide">Chosen {data.topics_to_learn.length}/3 topics</p>
        <button 
          onClick={next} 
          disabled={data.topics_to_learn.length === 0}
          className="mt-8 w-full max-w-[140px] py-3 bg-black text-white font-bold text-[11px] rounded-full transition-all active:scale-98 disabled:opacity-50"
        >
          Next
        </button>
        <SkipButton next={next} />
      </div>
    );
};

const Step4Dedication = ({ data, setData, next }: { data: any, setData: any, next: () => void }) => {
    const times = ["10 minutes", "30 minutes", "1 hour"];
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full relative z-10 text-center">
        <div className="mb-6">
          <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Set your learning tempo</p>
          <h1 className="text-2xl md:text-3xl font-black text-black tracking-tight">How much time can you dedicate daily?</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5 w-full max-w-[460px]">
          {times.map(time => (
            <button key={time} 
                onClick={() => setData({ ...data, daily_dedication: time })}
                className={`px-7 py-3.5 rounded-xl font-bold text-[11px] transition-all border-2 ${data.daily_dedication === time ? 'border-[#6366F1] bg-[#6366F1] text-white' : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {time}
            </button>
          ))}
        </div>
        <button 
          onClick={next} 
          disabled={!data.daily_dedication}
          className="mt-8 w-full max-w-[140px] py-3 bg-black text-white font-bold text-[11px] rounded-full transition-all active:scale-98 disabled:opacity-50"
        >
          Next
        </button>
        <SkipButton next={next} />
      </div>
    );
};

const Step5Avatar = ({ selectedChar, setSelectedChar, customAvatar, setCustomAvatar, activeTab, setActiveTab, next }: { selectedChar: any, setSelectedChar: any, customAvatar: any, setCustomAvatar: any, activeTab: any, setActiveTab: any, next: any }) => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setCustomAvatar(reader.result as string);
          reader.readAsDataURL(file);
        }
    };
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full relative z-10">
        <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-black mb-1">Pick an avatar</h1>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Almost at the finish line</p>
        </div>
        
        <div className="grid md:grid-cols-[2fr_1fr] gap-6 w-full max-w-[700px]">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xs tracking-tight">Select Character</h3>
                    <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-100">
                        <button onClick={() => setActiveTab('animated')} className={`px-3 py-1.5 rounded-md text-[9px] font-bold transition-all ${activeTab === 'animated' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>Animated</button>
                        <button onClick={() => setActiveTab('classic')} className={`px-3 py-1.5 rounded-md text-[9px] font-bold transition-all ${activeTab === 'classic' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>Classic</button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {(activeTab === 'animated' ? ANIMATED_CHARACTERS : STATIC_CHARACTERS).map(char => (
                        <button key={char.id} onClick={() => {setSelectedChar(char.id); setCustomAvatar(null);}} 
                            className={`aspect-square rounded-xl border-2 p-2 transition-all ${selectedChar === char.id ? 'border-black bg-gray-50' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}>
                            <img src={char.url} alt={char.name} className="w-full h-full object-contain" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <button onClick={() => document.getElementById('avatar-up')?.click()} className="w-full aspect-square bg-gray-50 border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center p-6 hover:bg-gray-100 transition-all group">
                    <input type="file" id="avatar-up" hidden onChange={handleFileUpload} />
                    {customAvatar ? (
                        <img src={customAvatar} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-2" alt="Custom" />
                    ) : (
                        <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Upload className="w-4 h-4 text-gray-400" /></div>
                    )}
                    <span className="font-bold text-[11px] tracking-tight text-gray-500">Upload Your Own</span>
                </button>
                <button onClick={next} className="w-full py-3.5 bg-black text-white font-bold text-xs rounded-2xl hover:bg-gray-900 transition-all disabled:opacity-50" disabled={!selectedChar && !customAvatar}>
                    Finalize Identity
                </button>
            </div>
        </div>
      </div>
    );
};

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [onboardingData, setOnboardingData] = useState({
    goal: "",
    skill_level: "",
    topics_to_learn: [] as string[],
    daily_dedication: "",
    avatar: ""
  });

  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'animated' | 'classic'>('animated');

  const nextStep = () => setCurrentStep(prev => prev + 1);

  const finalizeOnboarding = async () => {
    setLoading(true);
    try {
        const finalAvatar = customAvatar || (selectedChar ? [...ANIMATED_CHARACTERS, ...STATIC_CHARACTERS].find(c => c.id === selectedChar)?.url : "");
        const res = await updateOnboardingData({
            ...onboardingData,
            avatar: finalAvatar,
            onboarding_completed: true
        });
        if (res.success) {
            router.push('/profile');
        } else {
            console.error("Onboarding Sync Error:", res.error);
            alert("Failed to save progress: " + (res.error || "Unknown error"));
        }
    } catch (err) {
        console.error("Fatal Onboarding Error:", err);
        alert("A server error occurred during finalization. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep === 6) {
        const timer = setTimeout(finalizeOnboarding, 2500);
        return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const progressPercentage = ((currentStep) / 6) * 100;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-black selection:text-white transition-all duration-500 overflow-hidden">
      <Header progress={progressPercentage} />
      <AnimatePresence mode="wait">
        <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
        >
            {currentStep === 0 && <Step0Welcome userName={user?.name || 'Explorer'} next={nextStep} />}
            {currentStep === 1 && <Step1Goal data={onboardingData} setData={setOnboardingData} next={nextStep} />}
            {currentStep === 2 && <Step2Skill data={onboardingData} setData={setOnboardingData} next={nextStep} />}
            {currentStep === 3 && <Step3Topics data={onboardingData} setData={setOnboardingData} next={nextStep} />}
            {currentStep === 4 && <Step4Dedication data={onboardingData} setData={setOnboardingData} next={nextStep} />}
            {currentStep === 5 && <Step5Avatar selectedChar={selectedChar} setSelectedChar={setSelectedChar} customAvatar={customAvatar} setCustomAvatar={setCustomAvatar} activeTab={activeTab} setActiveTab={setActiveTab} next={nextStep} />}
            {currentStep === 6 && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-500 animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-black text-black mb-1">Finalizing Your Content</h1>
                    <p className="text-gray-400 font-bold text-[10px] max-w-[240px] uppercase tracking-widest">Tailoring your creative journey...</p>
                    <Loader2 className="w-5 h-5 text-black animate-spin mt-8" />
                </div>
            )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
