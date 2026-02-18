"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createTool, getTools, deleteTool } from "@/app/actions/tools";
import { cn } from "@/lib/utils";

export function ToolsManager() {
  const [tools, setTools] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleDelete = async (id: string) => {
      if (confirm("Are you sure you want to delete this tool?")) {
          await deleteTool(id);
          loadTools();
      }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black">Design Tools</h2>
         <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
         >
            <Plus className="w-5 h-5" />
            Add Tool
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
                        <label className="block text-sm font-bold uppercase text-gray-400">Tool Details</label>
                        <input name="name" placeholder="Tool Name (e.g. Figma)" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-black outline-none transition-colors" />
                        <textarea name="description" placeholder="Short description" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-black outline-none transition-colors" />
                        <input name="category" placeholder="Category (e.g. Prototyping)" required className="w-full p-4 bg-gray-50 rounded-xl font-bold border-2 border-transparent focus:border-black outline-none transition-colors" />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold uppercase text-gray-400">Assets</label>
                        <div className="p-4 border-2 border-gray-100 rounded-xl space-y-2">
                             <div className="flex items-center gap-2 font-bold text-xs uppercase text-gray-400"><LinkIcon className="w-3 h-3" /> URL</div>
                             <input name="url" placeholder="https://example.com" required className="w-full p-2 bg-white border-b-2 border-gray-200 focus:border-black outline-none" />
                        </div>
                        <div className="p-4 border-2 border-gray-100 rounded-xl space-y-2">
                             <div className="flex items-center gap-2 font-bold text-xs uppercase text-gray-400"><ImageIcon className="w-3 h-3" /> Icon / Image</div>
                             <input name="icon" placeholder="Image URL" required className="w-full p-2 bg-white border-b-2 border-gray-200 focus:border-black outline-none text-xs font-mono" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-black">Cancel</button>
                    <button disabled={loading} className="px-8 py-3 bg-green-500 text-white font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                        {loading ? "Adding..." : "Add Tool"}
                    </button>
                </div>
            </motion.form>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {tools.map((tool) => (
             <div key={tool.id} className="p-6 bg-white border-2 border-black rounded-2xl flex flex-col gap-4 group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                 <div className="flex items-start justify-between">
                     <div className="w-16 h-16 bg-gray-100 rounded-xl border-2 border-black overflow-hidden relative">
                         {tool.icon ? (
                             <img src={tool.icon} alt={tool.name} className="w-full h-full object-cover" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-6 h-6" /></div>
                         )}
                     </div>
                     <button onClick={() => handleDelete(tool.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                     </button>
                 </div>
                 
                 <div>
                     <h3 className="font-bold text-lg">{tool.name}</h3>
                     <p className="text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                 </div>

                 <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                     <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 rounded">{tool.category}</span>
                     <a href={tool.url} target="_blank" className="text-xs font-black flex items-center gap-1 hover:underline">
                        Visit <LinkIcon className="w-3 h-3" />
                     </a>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
