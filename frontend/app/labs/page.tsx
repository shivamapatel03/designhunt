"use client";

import React, { useState, useEffect } from "react";
import { 
  FlaskConical, 
  Plus, 
  Users, 
  ArrowRight, 
  Search,
  Layout,
  MessageSquare,
  Zap,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Lab {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  members: string[];
  status: string;
  created_at: string;
}

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newLabTitle, setNewLabTitle] = useState("");
  const [newLabDesc, setNewLabDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/labs");
      const data = await res.json();
      setLabs(data);
    } catch (error) {
      console.error("Failed to fetch labs:", error);
    }
  };

  const handleCreateLab = async (e: React.FormEvent) => {
    e.preventDefault();
    // Assuming a mock user ID for now, or get from cookie
    const userId = "user_" + Math.random().toString(36).substr(2, 9); 
    
    try {
      const res = await fetch("http://localhost:5000/api/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newLabTitle,
          description: newLabDesc,
          owner_id: userId,
        }),
      });
      if (res.ok) {
        const newLab = await res.json();
        setLabs([newLab, ...labs]);
        setIsCreateModalOpen(false);
        setNewLabTitle("");
        setNewLabDesc("");
        router.push(`/labs/${newLab.id}`);
      }
    } catch (error) {
      console.error("Failed to create lab:", error);
    }
  };

  const filteredLabs = labs.filter(lab => 
    lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFBD4] p-6 lg:p-12 pt-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FFCF0D] border-4 border-black px-4 py-1 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-sm uppercase">
              <FlaskConical className="w-4 h-4" />
              Collaborative Spaces
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[#222222] leading-none mb-4">
              DESIGN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B30] to-[#FF9500]">LABS</span>
            </h1>
            <p className="text-xl font-bold text-[#222222]/70 max-w-2xl">
              Real-time playgrounds for designers. Brainstorm, prototype, and iterate with your team or the community.
            </p>
          </div>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="group relative inline-flex items-center gap-3 bg-[#FFCF0D] border-4 border-black px-8 py-4 text-2xl font-black text-[#222222] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
            CREATE LAB
          </button>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#222222]/40" />
          <input 
            type="text"
            placeholder="Search active labs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-4 border-black p-4 pl-14 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-[#FFCF0D] transition-all placeholder:text-[#222222]/30"
          />
        </div>
        
        <div className="flex gap-4">
            <div className="bg-white border-4 border-black px-6 py-4 font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                {labs.length} ACTIVE ROOMS
            </div>
            <div className="bg-white border-4 border-black px-6 py-4 font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Users className="w-5 h-5" />
                {labs.reduce((acc, lab) => acc + lab.members.length, 0)} ONLINE
            </div>
        </div>
      </div>

      {/* Lab Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLabs.length > 0 ? (
          filteredLabs.map((lab) => (
            <Link 
              key={lab.id} 
              href={`/labs/${lab.id}`}
              className="group bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden"
            >
              {/* Abstract Pattern bg decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFCF0D]/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#222222] text-white px-3 py-1 font-black text-xs uppercase tracking-widest">
                    ACTIVE SESSION
                  </div>
                  <div className="flex -space-x-2">
                    {lab.members.map((m, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-[#FFCF0D] flex items-center justify-center font-black text-xs">
                        {m.substr(0, 1).toUpperCase()}
                      </div>
                    ))}
                    {lab.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center font-black text-xs">
                        +{lab.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-2 group-hover:text-[#FF3B30] transition-colors line-clamp-1 uppercase">
                  {lab.title}
                </h3>
                <p className="text-lg font-bold text-[#222222]/60 mb-6 line-clamp-2 h-14">
                  {lab.description || "No description provided for this session."}
                </p>

                <div className="flex items-center justify-between pt-6 border-t-2 border-black/10">
                  <div className="flex items-center gap-4 text-[#222222]/40 font-black text-sm uppercase">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(lab.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 font-black text-[#222222] group-hover:translate-x-2 transition-transform">
                    JOIN LAB
                    <ArrowRight className="w-6 h-6 border-2 border-black rounded-full p-1 bg-[#FFCF0D]" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white border-4 border-dashed border-black/20 flex flex-col items-center justify-center">
            <FlaskConical className="w-20 h-20 text-black/10 mb-4" />
            <p className="text-3xl font-black text-black/20 uppercase tracking-widest">No labs found</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FDFBD4] border-8 border-black p-8 md:p-12 max-w-2xl w-full shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200">
            <h2 className="text-5xl font-black text-[#222222] mb-8 uppercase tracking-tight leading-none">
              Inaugurate <span className="bg-[#FFCF0D] px-2">New Lab</span>
            </h2>
            
            <form onSubmit={handleCreateLab} className="space-y-6">
              <div>
                <label className="block text-2xl font-black mb-2 uppercase tracking-wide">Lab Title</label>
                <input 
                  autoFocus
                  required
                  type="text"
                  placeholder="e.g., Neo-Brutalist Exploration"
                  value={newLabTitle}
                  onChange={(e) => setNewLabTitle(e.target.value)}
                  className="w-full bg-white border-4 border-black p-4 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-[#FFCF0D] transition-all"
                />
              </div>

              <div>
                <label className="block text-2xl font-black mb-2 uppercase tracking-wide">Objective</label>
                <textarea 
                  rows={4}
                  placeholder="What are we building today?"
                  value={newLabDesc}
                  onChange={(e) => setNewLabDesc(e.target.value)}
                  className="w-full bg-white border-4 border-black p-4 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-[#FFCF0D] transition-all resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-[#222222] text-white border-4 border-black py-4 text-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  START SESSION
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-white text-[#222222] border-4 border-black px-8 py-4 text-2xl font-black hover:bg-black/5 transition-colors"
                >
                  ABORT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Sticker/Hint */}
      <div className="max-w-7xl mx-auto mt-20 flex flex-wrap gap-6 justify-center opacity-40 hover:opacity-100 transition-opacity">
        <div className="bg-white border-2 border-black px-4 py-2 font-black text-xs uppercase flex items-center gap-2">
            <Zap className="w-3 h-3" /> REAL-TIME SYNC
        </div>
        <div className="bg-white border-2 border-black px-4 py-2 font-black text-xs uppercase flex items-center gap-2">
            <Layout className="w-3 h-3" /> INFINITE CANVAS
        </div>
        <div className="bg-white border-2 border-black px-4 py-2 font-black text-xs uppercase flex items-center gap-2">
            <MessageSquare className="w-3 h-3" /> LIVE CHAT
        </div>
      </div>
    </div>
  );
}
