"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Edit2, Check, X, Upload, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createTool, getTools, deleteTool, updateTool } from "@/app/actions/tools";
import { cn } from "@/lib/utils";

export function ToolsManager() {
  const [tools, setTools] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    const data = await getTools();
    setTools(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createTool(formData);
    if (res.success) {
        setIsCreating(false);
        loadTools();
    } else {
        alert("Failed to create tool");
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateTool(id, formData);
    if (res.success) {
        setEditingId(null);
        loadTools();
    } else {
        alert("Failed to update tool");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
      if (confirm("Are you sure you want to delete this tool?")) {
          await deleteTool(id);
          loadTools();
      }
  };

  const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];

  const filteredTools = tools.filter((tool) => {
      const matchesSearch = 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-full overflow-hidden px-1 pb-10">
      {/* Header & Controls */}
      <div className="flex flex-col gap-6 bg-white p-6 rounded-[32px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-black uppercase flex items-center gap-3 italic tracking-tighter">
                   Tools Repository
                </h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage & organize design assets</p>
            </div>
            <button 
                onClick={() => setIsCreating(!isCreating)}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:translate-x-[2px] hover:translate-y-[2px] transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none uppercase text-xs tracking-widest w-full md:w-auto justify-center"
            >
                <Plus className="w-5 h-5" />
                Add New Tool
            </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t-2 border-gray-50">
            <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools..." 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl font-bold text-sm border-2 border-transparent focus:border-black outline-none transition-all"
                />
            </div>
            
            <div className="flex items-center gap-2 min-w-[200px]">
                <div className="relative w-full">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 border-transparent focus:border-black outline-none appearance-none cursor-pointer transition-all"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Create Form */}
      <AnimatePresence mode="wait">
        {isCreating && (
            <motion.form 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="bg-white border-4 border-black p-8 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] grid gap-6"
            >
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Tool Details</label>
                        <input name="name" placeholder="Tool Name (e.g. Figma)" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-black outline-none transition-colors" />
                        <textarea name="description" placeholder="Short description" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-black outline-none transition-colors min-h-[100px]" />
                        <input name="category" placeholder="Category (e.g. Prototyping)" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-black outline-none transition-colors" />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Assets & Icon</label>
                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl space-y-4">
                             <div className="space-y-2">
                                <div className="flex items-center gap-2 font-bold text-[10px] uppercase text-gray-400 group-focus-within:text-black">
                                    <LinkIcon className="w-3 h-3" /> Website URL
                                </div>
                                <input name="url" placeholder="https://figma.com" required className="w-full p-2 bg-white border-b-2 border-gray-100 focus:border-black outline-none text-sm" />
                             </div>
                             
                             <div className="space-y-2">
                                <div className="flex items-center gap-2 font-bold text-[10px] uppercase text-gray-400 group-focus-within:text-black">
                                    <ImageIcon className="w-3 h-3" /> Icon URL (Optional)
                                </div>
                                <input name="icon_url" placeholder="https://example.com/logo.png" className="w-full p-2 bg-white border-b-2 border-gray-100 focus:border-black outline-none text-sm font-mono" />
                             </div>

                             <div className="pt-2">
                                <label className="flex flex-col items-center justify-center w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <Upload className="w-5 h-5 text-gray-400 mb-2" />
                                    <span className="text-[10px] font-black uppercase text-gray-400">Or Upload File</span>
                                    <input name="icon_file" type="file" accept="image/*" className="hidden" />
                                </label>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-50">
                    <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-black uppercase text-xs">Cancel</button>
                    <button disabled={loading} className="px-10 py-3 bg-green-500 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 uppercase text-xs tracking-widest">
                        {loading ? "Processing..." : "Create Tool"}
                    </button>
                </div>
            </motion.form>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
         {filteredTools.map((tool) => (
             <div key={tool.id} className={cn(
                 "p-4 bg-white border-4 border-black rounded-[24px] flex flex-col gap-3 group transition-all",
                 editingId === tool.id ? "ring-4 ring-accent-yellow shadow-none" : "hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
             )}>
                 {editingId === tool.id ? (
                     <form onSubmit={(e) => handleUpdate(e, tool.id)} className="flex flex-col h-full gap-3">
                         <div className="flex justify-between items-center mb-1">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-accent-yellow italic">Editing</h4>
                             <button type="button" onClick={() => setEditingId(null)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"><X className="w-4 h-4" /></button>
                         </div>
                         <input name="name" defaultValue={tool.name} required className="w-full p-2 bg-gray-50 border-2 border-black rounded-lg font-bold text-xs" />
                         <textarea name="description" defaultValue={tool.description} required className="w-full p-2 bg-gray-50 border-2 border-black rounded-lg font-bold text-[10px] min-h-[60px]" />
                         <input name="category" defaultValue={tool.category} required className="w-full p-2 bg-gray-50 border-2 border-black rounded-lg text-[10px] font-black uppercase tracking-tighter" />
                         <input name="url" defaultValue={tool.url} required className="w-full p-2 bg-gray-50 border-2 border-black rounded-lg font-bold text-[10px]" />
                         
                         <div className="space-y-1">
                            <label className="flex items-center justify-center gap-2 p-2 bg-gray-50 border-2 border-dashed border-black rounded-lg cursor-pointer hover:bg-gray-100 text-[10px] font-black uppercase">
                                <Upload className="w-3 h-3" /> New Icon
                                <input name="icon_file" type="file" accept="image/*" className="hidden" />
                            </label>
                            <input name="existing_icon" type="hidden" value={tool.icon} />
                         </div>

                         <div className="mt-auto pt-2">
                             <button type="submit" disabled={loading} className="w-full bg-black text-white p-2 rounded-lg font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                                 {loading ? "..." : <><Check className="w-3 h-3" /> Save Changes</>}
                             </button>
                         </div>
                     </form>
                 ) : (
                     <>
                        <div className="flex items-start justify-between">
                            <div className="w-16 h-16 bg-gray-50 rounded-[18px] border-4 border-black overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {tool.icon ? (
                                    <img src={tool.icon} alt={tool.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-6 h-6" /></div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <button onClick={() => setEditingId(tool.id)} className="p-1.5 text-gray-300 hover:text-black hover:bg-gray-50 rounded-lg transition-all">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(tool.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-0.5">
                            <h3 className="font-black text-base uppercase italic tracking-tighter line-clamp-1">{tool.name}</h3>
                            <p className="text-[11px] font-bold text-gray-400 leading-tight line-clamp-2">{tool.description}</p>
                        </div>

                        <div className="mt-auto pt-3 flex items-center justify-between border-t-2 border-gray-50">
                            <span className="text-[9px] font-black uppercase bg-accent-yellow text-black px-2 py-0.5 rounded-full border-2 border-black">{tool.category}</span>
                            <a href={tool.url} target="_blank" className="font-black uppercase text-[10px] flex items-center gap-1 hover:underline decoration-2 underline-offset-2">
                                Visit <LinkIcon className="w-3 h-3" />
                            </a>
                        </div>
                     </>
                 )}
             </div>
         ))}
      </div>

      {filteredTools.length === 0 && (
          <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border-4 border-dashed border-gray-100">
              <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-black text-gray-300 uppercase italic">No Tools Found</h3>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Try adjusting your search or category filter</p>
          </div>
      )}
    </div>
  );
}
