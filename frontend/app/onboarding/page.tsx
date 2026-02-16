"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Sparkles, Check } from "lucide-react";
import { completeOnboarding } from "@/app/actions/onboarding";

// Placeholder "GIF" avatars (using high-quality static images for now as reliable GIFs are hard to link without hosting)
// But I'll use some fun Notion-style or 3D avatars URLs if possible, or just colors/initials with animation.
// Let's use some DiceBear API URLs which generate consistent avatars, or just some placeholders.
// Actually, I'll use some placeholder images that look like "characters".

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

const ALL_CHARACTERS = [...ANIMATED_CHARACTERS, ...STATIC_CHARACTERS];

export default function OnboardingPage() {
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
        setSelectedChar(null); // Deselect character if custom uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedChar && !customAvatar) return;

    setLoading(true);
    
    // Determine the avatar URL to save
    let avatarToSave = customAvatar;
    if (!avatarToSave && selectedChar) {
        avatarToSave = ALL_CHARACTERS.find(c => c.id === selectedChar)?.url || '';
    }

    if (avatarToSave) {
        const res = await completeOnboarding(avatarToSave);
        if (res.success) {
            router.push('/profile'); // Or dashboard
        } else {
            console.error(res.error);
        }
    }
    
    setLoading(false);
  };

  const [activeTab, setActiveTab] = useState<'animated' | 'classic'>('animated');

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
            <h1 className="text-4xl md:text-5xl font-black mb-4">Choose Your Character</h1>
            <p className="text-xl text-gray-500">How do you want to be seen in the Design Hunt universe?</p>
        </motion.div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            {/* Character Grid */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border-4 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_#000]"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">Select an Avatar</h3>
                    
                    {/* Toggle Switch */}
                    <div className="flex p-1 bg-gray-100 rounded-xl border border-gray-200">
                        <button 
                            onClick={() => setActiveTab('animated')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'animated' 
                                    ? 'bg-white text-black shadow-sm ring-1 ring-black/5' 
                                    : 'text-gray-500 hover:text-black'
                            }`}
                        >
                            Animated
                        </button>
                        <button 
                            onClick={() => setActiveTab('classic')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'classic' 
                                    ? 'bg-white text-black shadow-sm ring-1 ring-black/5' 
                                    : 'text-gray-500 hover:text-black'
                            }`}
                        >
                            Classic
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 min-h-[300px]">
                    {(activeTab === 'animated' ? ANIMATED_CHARACTERS : STATIC_CHARACTERS).map((char) => (
                        <button 
                            key={char.id}
                            onClick={() => { setSelectedChar(char.id); setCustomAvatar(null); }}
                            className={`group relative aspect-square rounded-2xl border-4 transition-all overflow-hidden ${
                                selectedChar === char.id 
                                    ? 'border-accent-blue bg-accent-blue/10 scale-95 ring-4 ring-accent-blue/20' 
                                    : 'border-gray-200 hover:border-black hover:scale-105 bg-gray-50'
                            }`}
                        >
                            <img 
                                src={char.url} 
                                alt={char.name} 
                                className={`w-full h-full p-2 ${activeTab === 'animated' ? 'object-contain' : 'object-cover'}`} 
                            />
                            {selectedChar === char.id && (
                                <div className="absolute top-2 right-2 bg-accent-blue text-white p-1 rounded-full">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] font-bold py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {char.name}
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Custom Upload & Actions */}
            <div className="space-y-6">
                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`bg-white border-4 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_#000] flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        customAvatar ? 'border-accent-pink' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <input 
                        type="file" 
                        id="file-upload" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                    />
                    
                    {customAvatar ? (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-black mb-4">
                            <img src={customAvatar} alt="Custom" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-bold text-xs uppercase">
                                Change
                            </div>
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                             <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                    
                    <h3 className="font-bold text-lg mb-1">{customAvatar ? 'Custom Photo Selected' : 'Upload Your Own'}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">
                        {customAvatar ? 'Tap to change' : 'JPG, PNG or GIF'}
                    </p>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    disabled={(!selectedChar && !customAvatar) || loading}
                    onClick={handleSubmit}
                    className="w-full py-5 bg-black text-white font-black text-xl rounded-[24px] shadow-[6px_6px_0px_0px_#3b82f6] hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 italic uppercase"
                >
                    {loading ? 'Starting...' : 'Start Journey'} <ArrowRight className="w-6 h-6" />
                </motion.button>
            </div>
        </div>
      </div>
    </div>
  );
}
