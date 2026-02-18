"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { updateSkills } from "@/app/actions/onboarding";
import { cn } from "@/lib/utils";

const SKILLS = [
  "UI Design", "UX Research", "Frontend Dev", "Backend Dev",
  "Mobile Dev", "Motion Design", "3D Design", "Illustration",
  "Branding", "Marketing", "Product Mgmt", "Data Science",
  "AI/ML", "Game Dev", "Copywriting", "No-Code"
];

export default function SkillsPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    if (selectedSkills.length === 0) return;

    setLoading(true);
    const res = await updateSkills(selectedSkills);
    
    if (res.success) {
      router.push('/profile?celebrate=true');
    } else {
      console.error(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 pt-24 md:pt-32 selection:bg-accent-pink selection:text-white">
      <div className="max-w-4xl w-full">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
        >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3 h-3" /> Step 2 of 2
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">What do you do?</h1>
            <p className="text-xl text-gray-500">Select your skills to help us personalize your experience.</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-4 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_#000]"
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {SKILLS.map((skill) => (
                    <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                            "group relative p-4 rounded-2xl border-2 transition-all font-bold text-sm md:text-base",
                            selectedSkills.includes(skill)
                                ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                                : "bg-white text-gray-600 border-gray-200 hover:border-black hover:bg-gray-50"
                        )}
                    >
                        {skill}
                        {selectedSkills.includes(skill) && (
                            <div className="absolute -top-2 -right-2 bg-accent-yellow text-black border-2 border-black p-1 rounded-full">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <button
                disabled={selectedSkills.length === 0 || loading}
                onClick={handleSubmit}
                className="w-full py-5 bg-accent-blue text-white font-black text-xl rounded-[24px] shadow-[6px_6px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 italic uppercase border-2 border-black"
            >
                {loading ? 'Finishing...' : 'Complete Profile'} <ArrowRight className="w-6 h-6" />
            </button>
        </motion.div>
      </div>
    </div>
  );
}
