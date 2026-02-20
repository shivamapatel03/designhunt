"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Camera, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

export function EditIdeaModal({ idea, user, onClose, onSuccess }: { idea: any, user: any, onClose: () => void, onSuccess: () => void }) {
    const [content, setContent] = useState(idea.idea);
    const [selectedImage, setSelectedImage] = useState<string | null>(idea.image);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        if (!content.trim()) return;
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/ideas/${idea.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idea: content,
                    image: selectedImage,
                    user_id: user?.id
                })
            });

            if (res.ok) {
                toast.success("Design spark updated!");
                onSuccess();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update spark.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white border-4 border-black rounded-[40px] p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue -mr-16 -mt-16 rotate-45 border-l-4 border-black" />
                
                <div className="relative z-10">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Refine Your Spark</h2>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-8">Polishing your ideas is part of the process.</p>
                    
                    <div className="space-y-4">
                        <textarea 
                            autoFocus
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="I've been thinking about a new way to..."
                            className="w-full h-32 bg-gray-50 border-2 border-black rounded-[24px] p-6 text-xl font-medium outline-none focus:ring-4 focus:ring-accent-blue transition-all resize-none"
                        />

                        {/* Image Upload Area */}
                        <div className="flex gap-4">
                            {!selectedImage ? (
                                <label className="flex-1 border-2 border-black border-dashed rounded-2xl p-6 hover:bg-gray-50 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group">
                                    <div className="p-3 bg-gray-100 rounded-xl group-hover:scale-110 transition-transform">
                                        <Camera className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Add / Change Screenshot</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            ) : (
                                <div className="flex-1 relative border-2 border-black rounded-2xl overflow-hidden group">
                                    <img src={selectedImage} className="w-full h-40 object-cover" alt="Selected" />
                                    <button 
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-2 right-2 p-2 bg-black text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                        <button 
                            onClick={handleUpdate}
                            disabled={!content || isUpdating}
                            className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-30 flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#000]"
                        >
                            {isUpdating ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</> : <><Save className="w-5 h-5" /> Save Changes</>}
                        </button>
                        <button 
                            onClick={onClose}
                            className="px-8 py-4 bg-white border-2 border-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
