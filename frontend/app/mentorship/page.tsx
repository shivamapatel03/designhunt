"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, MessageCircle, Calendar, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BookingModal } from "@/components/mentorship/BookingModal";

export default function MentorshipPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/mentors")
      .then(res => res.json())
      .then(setMentors);
  }, []);

  const filteredMentors = filter === "All" 
    ? mentors 
    : mentors.filter(m => m.specialty === filter);

  const specialties = ["All", "Career Strategy", "Portfolio Review", "Leadership", "Visual Design"];

  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-12">
            <Link href="/career" className="inline-flex items-center gap-2 text-gray-400 hover:text-black font-bold uppercase tracking-widest text-xs mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Career HubHub
            </Link>
            <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">Find a Mentor</h1>
            <p className="text-xl text-gray-500 font-medium max-w-2xl">
                Book 1:1 sessions with industry leaders. Get portfolio feedback, career advice, or technical coaching.
            </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
            {specialties.map(spec => (
                <button 
                    key={spec}
                    onClick={() => setFilter(spec)}
                    className={`px-6 py-3 rounded-full border-2 font-bold text-sm transition-all
                        ${filter === spec 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                        }
                    `}
                >
                    {spec}
                </button>
            ))}
        </div>

        {/* Mentor Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMentors.map((mentor) => (
                <motion.div 
                    key={mentor.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[32px] overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group"
                >
                    <div className="h-32 bg-gray-100 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-pink/20" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 text-accent-yellow fill-accent-yellow" /> {mentor.rating}
                        </div>
                    </div>
                    
                    <div className="px-8 pb-8 -mt-12 relative z-10">
                        <img src={mentor.image} alt={mentor.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover" />
                        
                        <div className="mb-6">
                            <div className="text-xs font-black text-accent-blue uppercase tracking-widest mb-1">{mentor.specialty}</div>
                            <h3 className="text-xl font-black leading-tight mb-1">{mentor.name}</h3>
                            <p className="text-sm font-bold text-gray-400">{mentor.role}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6">
                             <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {mentor.reviews} reviews</div>
                             <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {mentor.availability.length} slots</div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                             <div className="flex flex-col">
                                 <span className="text-[10px] font-black uppercase text-gray-400">Price</span>
                                 <span className="text-xl font-black">${mentor.rate}</span>
                             </div>
                             <button 
                                onClick={() => setSelectedMentor(mentor)}
                                className="px-6 py-3 bg-black text-white font-bold rounded-xl text-sm hover:scale-105 transition-transform"
                             >
                                 Book
                             </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Booking Modal Overlay */}
        <AnimatePresence>
            {selectedMentor && (
                <BookingModal 
                    mentor={selectedMentor} 
                    onClose={() => setSelectedMentor(null)} 
                />
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}
