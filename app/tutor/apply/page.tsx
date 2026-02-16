"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Send, ArrowRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { useEffect } from 'react';

export default function TutorApplicationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    portfolio: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
        if (user.role === 'TUTOR' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            router.push('/tutor-dashboard');
        }
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
        <div className="container mx-auto px-4 pt-32 text-center">
            <div className="text-2xl font-black animate-pulse uppercase">Verifying Status...</div>
        </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/tutor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.status === 401) {
          setError('Your session has expired. Please login again.');
          router.push('/login?from=/tutor/apply');
          return;
      }

      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
      return (
          <div className="container mx-auto px-4 pt-32 pb-12 min-h-screen flex items-center justify-center">
              <div className="bg-white border-2 border-black rounded-2xl p-8 max-w-md w-full text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-16 h-16 bg-green-100 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-black uppercase mb-4">Application Sent!</h2>
                  <p className="text-gray-600 mb-8">
                      We have received your request to become a tutor. Our team will review your portfolio and get back to you shortly.
                  </p>
                  <button 
                    onClick={() => router.push('/profile')}
                    className="w-full py-4 bg-black text-white font-black rounded-xl hover:opacity-90 transition-opacity"
                  >
                      BACK TO PROFILE
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Option 1: Apply (Active) */}
            <div className="p-8 bg-white border-4 border-black rounded-[40px] shadow-[12px_12px_0px_0px_#ec4899] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6">
                    <CheckCircle className="w-10 h-10 text-accent-pink" />
                </div>
                <h3 className="text-3xl font-black italic uppercase mb-2 tracking-tighter">Apply to Teach</h3>
                <p className="text-sm text-gray-400 font-bold mb-6 italic">Join our network of elite creators and share your knowledge.</p>
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-accent-pink text-white text-[10px] font-black rounded-full border-2 border-black uppercase shadow-[2px_2px_0px_0px_#000]">
                    Current Hub
                </div>
            </div>

            {/* Option 2: Login */}
            <Link href="/tutor/login" className="p-8 bg-gray-50 border-4 border-black rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all group relative">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity translate-x-4">
                    <Zap className="w-12 h-12 text-accent-yellow fill-accent-yellow" />
                </div>
                <h3 className="text-3xl font-black italic uppercase mb-2 tracking-tighter">Already a Mentor?</h3>
                <p className="text-sm text-gray-400 font-bold mb-6 italic">Access your courses, students, and dashboard analytics.</p>
                <div className="inline-flex items-center gap-2 text-black font-black uppercase text-xs italic">
                    Login to Portal <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform text-accent-pink" />
                </div>
            </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Start Your Journey</h1>
          <p className="text-lg text-gray-500">
            Fill out the form below to begin the verification process.
          </p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-4 border-black rounded-[40px] p-10 md:p-14 shadow-[16px_16px_0px_0px_#000]"
        >
            {error && (
                <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl text-red-600 font-bold mb-6 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
                    <input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 border-2 border-black rounded-xl outline-none focus:bg-gray-50 transition-colors bg-white font-bold" 
                        placeholder="Your Name" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Area of Expertise</label>
                    <select 
                            required
                            value={formData.expertise}
                            onChange={e => setFormData({...formData, expertise: e.target.value})}
                            className="w-full p-4 border-2 border-black rounded-xl outline-none appearance-none bg-white font-bold"
                    >
                        <option value="">Select an area...</option>
                        <option value="UI Design">UI Design</option>
                        <option value="UX Research">UX Research</option>
                        <option value="Motion Graphics">Motion Graphics</option>
                        <option value="3D Modeling">3D Modeling</option>
                        <option value="Frontend Dev">Frontend Dev</option>
                    </select>
                </div>

                <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Portfolio URL</label>
                        <input 
                        required
                        type="url"
                        value={formData.portfolio}
                        onChange={e => setFormData({...formData, portfolio: e.target.value})}
                        className="w-full p-4 border-2 border-black rounded-xl outline-none focus:bg-gray-50 transition-colors bg-white font-bold" 
                        placeholder="https://dribbble.com/yourname" 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Why do you want to join?</label>
                    <textarea 
                        required
                        value={formData.bio}
                        onChange={e => setFormData({...formData, bio: e.target.value})}
                        className="w-full p-4 border-2 border-black rounded-xl outline-none focus:bg-gray-50 transition-colors h-32 bg-white font-medium resize-none" 
                        placeholder="Tell us about yourself..." 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-black text-white font-black rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    {loading ? 'SENDING...' : (
                        <>
                            SUBMIT APPLICATION <Send className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </motion.div>
      </div>
    </div>
  );
}
