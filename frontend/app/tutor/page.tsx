"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, Award, Globe, ArrowRight, LogIn } from 'lucide-react';

export default function TutorLandingPage() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-yellow-100 border-2 border-black rounded-full text-xs font-black uppercase tracking-widest mb-6">
                Join the Faculty
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
              Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-pink to-accent-yellow">Mentor</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium mb-10">
              Share your expertise, shape the future of design, and earn while you teach.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Link href="/tutor/login" className="w-full md:w-auto px-8 py-4 bg-white border-2 border-black text-black font-black rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" /> TUTOR LOGIN
                </Link>
                <Link href="/tutor/apply" className="w-full md:w-auto px-8 py-4 bg-black text-white font-black rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    APPLY NOW <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="p-8 bg-white border-2 border-black rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-accent-blue rounded-2xl border-2 border-black flex items-center justify-center mb-6">
                    <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-3">Paid Opportunities</h3>
                <p className="text-gray-600 font-medium">Earn competitive rates by creating coursework and providing 1-on-1 mentorship.</p>
            </div>

            <div className="p-8 bg-white border-2 border-black rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-accent-pink rounded-2xl border-2 border-black flex items-center justify-center mb-6">
                    <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-3">Build Authority</h3>
                <p className="text-gray-600 font-medium">Establish yourself as a thought leader in the design community.</p>
            </div>

            <div className="p-8 bg-white border-2 border-black rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-accent-yellow rounded-2xl border-2 border-black flex items-center justify-center mb-6">
                    <Globe className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-3">Global Impact</h3>
                <p className="text-gray-600 font-medium">Reach students worldwide and help them launch their creative careers.</p>
            </div>
        </div>

      </div>
    </div>
  );
}
