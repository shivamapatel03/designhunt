"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Video, 
  Image as ImageIcon,
  Save,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { submitCourse } from '@/app/actions/courses';
import { useEffect } from 'react';

export default function NewCoursePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'UI/UX Design',
    difficulty: 'Beginner',
    thumbnail: '',
    video_url: '',
    modules: [{ id: 1, title: '', duration: '' }]
  });
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => {});
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!user) {
        alert('You must be logged in to submit a course.');
        return;
    }

    setLoading(true);
    try {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('difficulty', formData.difficulty);
        data.append('duration', '12h'); // Placeholder or from modules
        data.append('video_url', formData.video_url);
        data.append('instructor_name', user.name);
        data.append('tutor_id', user.id);
        data.append('modules', JSON.stringify(formData.modules));
        
        if (thumbnailFile) {
            data.append('thumbnail', thumbnailFile);
        } else {
            data.append('thumbnailUrl', formData.thumbnail);
        }

        const res = await submitCourse(data);
        if (res.success) {
            alert('Course submitted for review!');
            router.push('/tutor-dashboard');
        } else {
            alert('Submission failed: ' + res.error);
        }
    } catch (err) {
        alert('An error occurred');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-24">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/tutor-dashboard" className="inline-flex items-center text-sm font-black uppercase text-gray-400 hover:text-black mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back to Hub
        </Link>

        {/* Multi-step Header */}
        <div className="flex justify-between items-center mb-12">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-black transition-all ${step >= s ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                    </div>
                    {s < 3 && <div className={`w-16 h-1 bg-black rounded-full transition-all ${step > s ? 'opacity-100' : 'opacity-10'}`} />}
                </div>
            ))}
        </div>

        <div className="bg-white border-2 border-black rounded-[40px] p-8 md:p-12 shadow-[12px_12px_0px_0px_#000]">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">1. Core Identity</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Course Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Master Figma Components"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-black rounded-2xl font-bold focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Detailed Description</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="What will students learn?"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-black rounded-2xl font-bold focus:bg-white outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-black rounded-2xl font-bold outline-none"
                      >
                        <option>UI/UX Design</option>
                        <option>Motion Design</option>
                        <option>No-Code Dev</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Price ($)</label>
                      <input 
                        type="text" 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        placeholder="Free or Amount"
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-black rounded-2xl font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">2. Media Assets</h2>
                <div className="space-y-8">
                  <div className="border-4 border-dashed border-gray-100 rounded-[32px] p-12 text-center hover:border-accent-blue transition-colors group relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        {thumbnailFile ? (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-accent-blue" />
                        )}
                    </div>
                    <p className="font-black uppercase text-sm mb-2">
                        {thumbnailFile ? thumbnailFile.name : 'Upload Thumbnail'}
                    </p>
                    <p className="text-xs text-gray-400 font-bold mb-6 italic">1920x1080 Recommended (PNG, JPG)</p>
                    <button className="px-6 py-2 bg-black text-white rounded-xl text-xs font-black relative z-10 pointer-events-none">
                        {thumbnailFile ? 'CHANGE FILE' : 'SELECT FILE'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Intro Video URL (YouTube/Vimeo)</label>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                              type="text" 
                              value={formData.video_url}
                              onChange={e => setFormData({...formData, video_url: e.target.value})}
                              placeholder="https://youtube.com/..."
                              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-black rounded-2xl font-bold outline-none"
                            />
                        </div>
                        <button className="px-6 bg-accent-pink text-white border-2 border-black rounded-2xl font-black text-xs shadow-[4px_4px_0px_0px_#000]">VERIFY</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">3. Curriculum</h2>
                <div className="space-y-4">
                  {formData.modules.map((mod, idx) => (
                    <div key={mod.id} className="p-6 bg-gray-50 border-2 border-black rounded-2xl flex items-center gap-4">
                        <div className="font-black text-2xl italic text-gray-200">0{idx + 1}</div>
                        <input 
                          type="text" 
                          placeholder="Module Title"
                          value={mod.title}
                          onChange={(e) => {
                            const newModules = [...formData.modules];
                            newModules[idx].title = e.target.value;
                            setFormData({...formData, modules: newModules});
                          }}
                          className="flex-1 bg-transparent font-bold outline-none border-b-2 border-gray-200 focus:border-black transition-colors"
                        />
                        <button 
                          onClick={() => {
                            const newModules = formData.modules.filter((_, i) => i !== idx);
                            setFormData({...formData, modules: newModules});
                          }}
                          className="p-2 text-red-500 hover:bg-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setFormData({...formData, modules: [...formData.modules, { id: Date.now(), title: '', duration: '' }]})}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl font-black text-xs text-gray-400 hover:border-black hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> ADD MODULE
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 pt-8 border-t-2 border-gray-50 flex justify-between items-center">
            <button 
                onClick={handleBack}
                disabled={step === 1}
                className="px-8 py-3 font-black text-sm uppercase text-gray-400 hover:text-black disabled:opacity-0 transition-all"
            >
                Back
            </button>
            
            {step < 3 ? (
                <button 
                    onClick={handleNext}
                    className="px-10 py-4 bg-accent-blue text-white border-2 border-black rounded-2xl font-black text-sm shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
                >
                    CONTINUE
                </button>
            ) : (
                <button 
                    onClick={handleSubmit}
                    className="px-10 py-4 bg-green-500 text-white border-2 border-black rounded-2xl font-black text-sm shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all flex items-center gap-2"
                >
                    <Globe className="w-5 h-5" /> SUBMIT COURSE
                </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
