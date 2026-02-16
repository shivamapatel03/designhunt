"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '$49.99',
    difficulty: 'Beginner',
    duration: '4 weeks',
    category: 'UI Design',
    thumbnail: 'https://images.unsplash.com/photo-1541462608143-df3544365431?w=800&q=80' // Default placeholder
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/tutor/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push('/tutor/dashboard');
      } else {
        alert('Failed to create course');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/tutor/dashboard" className="inline-flex items-center text-gray-500 hover:text-black font-bold mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="bg-white border-2 border-black rounded-[32px] p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">Create New Course</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Course Title</label>
                    <input 
                        required
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full p-4 border-2 border-black rounded-xl outline-none focus:bg-gray-50 text-xl font-bold" 
                        placeholder="e.g. Advanced Micro-Interactions" 
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                        <select 
                             value={formData.category}
                             onChange={e => setFormData({...formData, category: e.target.value})}
                             className="w-full p-4 border-2 border-black rounded-xl outline-none bg-white font-bold"
                        >
                            <option>UI Design</option>
                            <option>UX Research</option>
                            <option>Motion Graphics</option>
                            <option>Frontend Dev</option>
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Difficulty</label>
                        <select 
                             value={formData.difficulty}
                             onChange={e => setFormData({...formData, difficulty: e.target.value})}
                             className="w-full p-4 border-2 border-black rounded-xl outline-none bg-white font-bold"
                        >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Price</label>
                        <input 
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            className="w-full p-4 border-2 border-black rounded-xl outline-none focus:bg-gray-50 font-bold" 
                            placeholder="$49.99" 
                        />
                    </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Duration</label>
                        <input 
                            value={formData.duration}
                            onChange={e => setFormData({...formData, duration: e.target.value})}
                            className="w-full p-4 border-2 border-black rounded-xl outline-none focus:bg-gray-50 font-bold" 
                            placeholder="e.g. 4 weeks" 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                    <textarea 
                        required
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full p-4 border-2 border-black rounded-xl outline-none focus:bg-gray-50 min-h-[150px] font-medium resize-none" 
                        placeholder="What will students learn?" 
                    />
                </div>
                
                <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Thumbnail URL</label>
                     <div className="flex gap-4">
                        <input 
                            value={formData.thumbnail}
                            onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                            className="flex-1 p-4 border-2 border-black rounded-xl outline-none focus:bg-gray-50 font-medium" 
                            placeholder="https://..." 
                        />
                         <div className="w-16 h-16 bg-gray-100 border-2 border-black rounded-xl overflow-hidden relative">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                     </div>
                </div>

                <div className="pt-6">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-black text-white font-black rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> PUBLISH COURSE</>}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
