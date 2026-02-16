'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Check, ChevronRight, User, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    role: '',
    bio: '',
    avatar: '',
    skills: [] as string[]
  });

  const roles = [
    "Product Designer", "UX Researcher", "Frontend Developer", 
    "Motion Designer", "Graphic Designer", "Student"
  ];

  const skillsList = [
    "Figma", "React", "Next.js", "Tailwind", "Motion", 
    "User Research", "Prototyping", "UI Design", "UX Writing"
  ];

  const avatars = [
    "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Milo",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Bella",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Leo",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Zoe"
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/profile');
      } else {
        const errorData = await res.json();
        console.error('Onboarding Error:', errorData.error || 'Failed to update profile');
        alert(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[32px] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
        
        {/* Progress */}
        <div className="flex gap-2 mb-12">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i <= step ? 'bg-black' : 'bg-gray-200'}`} />
           ))}
        </div>

        {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center">
                    <h1 className="text-3xl font-black mb-2">Pick your avatar</h1>
                    <p className="text-gray-500 font-medium">This is how you'll appear on leaderboards.</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {avatars.map((avatar) => (
                        <button 
                            key={avatar}
                            onClick={() => setFormData({...formData, avatar})}
                            className={`aspect-square rounded-2xl border-2 overflow-hidden hover:scale-105 transition-all ${
                                formData.avatar === avatar ? 'border-black ring-4 ring-accent-yellow/30 bg-accent-yellow/10' : 'border-transparent hover:border-black/10'
                            }`}
                        >
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                <button 
                    onClick={nextStep}
                    disabled={!formData.avatar}
                    className="w-full py-4 bg-black text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    Continue <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center">
                    <h1 className="text-3xl font-black mb-2">Tell us about you</h1>
                    <p className="text-gray-500 font-medium">We'll customize your learning path.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Username</label>
                        <input 
                            type="text" 
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold focus:border-black focus:outline-none transition-colors"
                            placeholder="@username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Primary Role</label>
                        <div className="grid grid-cols-2 gap-2">
                            {roles.map(role => (
                                <button
                                    key={role}
                                    onClick={() => setFormData({...formData, role})}
                                    className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                                        formData.role === role ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-black'
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Bio</label>
                         <textarea 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium focus:border-black focus:outline-none transition-colors h-24 resize-none"
                            placeholder="I design things..."
                        />
                    </div>
                </div>

                <button 
                    onClick={nextStep}
                    disabled={!formData.username || !formData.role}
                    className="w-full py-4 bg-black text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    Continue <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        )}

        {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center">
                    <h1 className="text-3xl font-black mb-2">What are you good at?</h1>
                    <p className="text-gray-500 font-medium">Select your top skills.</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {skillsList.map(skill => (
                        <button
                            key={skill}
                            onClick={() => {
                                const newSkills = formData.skills.includes(skill)
                                    ? formData.skills.filter(s => s !== skill)
                                    : [...formData.skills, skill];
                                setFormData({...formData, skills: newSkills});
                            }}
                            className={`px-4 py-2 rounded-full border-2 font-bold text-sm transition-all ${
                                formData.skills.includes(skill) 
                                    ? 'bg-accent-blue text-white border-accent-blue shadow-[2px_2px_0px_0px_#000]' 
                                    : 'bg-white border-gray-200 hover:border-black text-gray-600'
                            }`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={loading || formData.skills.length === 0}
                    className="w-full py-4 bg-accent-yellow text-black border-2 border-black font-black rounded-xl hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Setup <Check className="w-5 h-5" /></>}
                </button>
            </div>
        )}

      </div>
    </div>
  );
}
