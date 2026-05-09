"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createDuel, getAdminDuels, deleteDuel } from "@/app/actions/duels";
import { cn } from "@/lib/utils";

export function DuelsManager() {
  const [duels, setDuels] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDuels();
  }, []);

  const loadDuels = async () => {
    const data = await getAdminDuels();
    setDuels(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this duel?")) return;
    
    const res = await deleteDuel(id);
    if (res.success) {
        setDuels(prev => prev.filter(d => d.id !== id));
    } else {
        alert("Failed to delete duel");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createDuel(formData);
    if (res.success) {
        setIsCreating(false);
        loadDuels();
    } else {
        alert("Failed to create duel");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black">Daily Duels</h2>
         <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
         >
            <Plus className="w-5 h-5" />
            New Duel
         </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {isCreating && (
            <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="bg-white border-2 border-black p-8 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] grid gap-6"
            >
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold uppercase text-gray-400">Basic Info</label>
                        <input name="title" placeholder="Duel Title (e.g. Button Contrast)" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-black outline-none transition-colors" />
                        <textarea name="description" placeholder="Short description/question" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-black outline-none transition-colors" />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="category" placeholder="Category (e.g. UI Design)" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-black outline-none transition-colors" />
                            <input name="date" type="date" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-black outline-none transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold uppercase text-gray-400">Options</label>
                        
                        <div className="p-4 border-2 border-gray-100 rounded-xl space-y-2">
                             <div className="font-bold text-xs uppercase bg-black text-white inline-block px-2 py-1 rounded">Option A</div>
                             <input name="option_a_label" placeholder="Label (e.g. High Contrast)" required className="w-full p-2 bg-white border-b-2 border-gray-200 focus:border-black outline-none" />
                             <input name="option_a_image" placeholder="Image URL (Optional)" className="w-full p-2 bg-white border-b-2 border-gray-200 focus:border-black outline-none text-xs font-mono" />
                        </div>

                        <div className="p-4 border-2 border-gray-100 rounded-xl space-y-2">
                             <div className="font-bold text-xs uppercase bg-black text-white inline-block px-2 py-1 rounded">Option B</div>
                             <input name="option_b_label" placeholder="Label (e.g. Low Contrast)" required className="w-full p-2 bg-white border-b-2 border-gray-200 focus:border-black outline-none" />
                             <input name="option_b_image" placeholder="Image URL (Optional)" className="w-full p-2 bg-white border-b-2 border-gray-200 focus:border-black outline-none text-xs font-mono" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-black">Cancel</button>
                    <button disabled={loading} className="px-8 py-3 bg-green-500 text-white font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                        {loading ? "Creating..." : "Create Duel"}
                    </button>
                </div>
            </motion.form>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="grid gap-4">
         {duels.map((duel) => (
             <div key={duel.id} className="p-6 bg-white border-2 border-black rounded-2xl flex items-center gap-6 group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                 <div className="w-16 h-16 bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-black font-black">
                     <span className="text-xs uppercase text-gray-400">{new Date(duel.date).toLocaleString('default', { month: 'short' })}</span>
                     <span className="text-2xl">{new Date(duel.date).getDate()}</span>
                 </div>
                 
                 <div className="flex-1">
                     <h3 className="font-bold text-lg">{duel.title}</h3>
                     <p className="text-sm text-gray-500">{duel.category}</p>
                 </div>

                 <div className="flex gap-4 opacity-50 text-sm">
                     <div className="flex items-center gap-2">
                        <img src={duel.option_a_image} className="w-8 h-8 rounded-lg bg-gray-200 object-cover" />
                        <span>A: {duel.option_a_label}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <img src={duel.option_b_image} className="w-8 h-8 rounded-lg bg-gray-200 object-cover" />
                        <span>B: {duel.option_b_label}</span>
                     </div>
                 </div>

                 <button 
                    onClick={() => handleDelete(duel.id)}
                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                 >
                    <Trash2 className="w-5 h-5" />
                 </button>
             </div>
         ))}
      </div>
    </div>
  );
}
