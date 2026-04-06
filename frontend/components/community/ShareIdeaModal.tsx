"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Camera, Loader2, ArrowUpRight, Video } from "lucide-react";
import { toast } from "sonner";

export function ShareIdeaModal({ user, onClose, onSuccess }: { user: any, onClose: () => void, onSuccess: () => void }) {
    const [newIdea, setNewIdea] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image too large. Please keep it under 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setSelectedVideo(null); // Clear video if image selected
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) {
                toast.error("Video too large. Please keep it under 20MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedVideo(reader.result as string);
                setSelectedImage(null); // Clear image if video selected
            };
            reader.readAsDataURL(file);
        }
    };

    const handleShare = async () => {
        if (!newIdea.trim()) return;
        setIsPosting(true);
        try {
            const res = await fetch("/api/ideas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idea: newIdea,
                    image: selectedImage,
                    video: selectedVideo,
                    user_id: user?.id,
                    user_handle: user?.name,
                    user_avatar: user?.avatar
                })
            });

            if (res.ok) {
                toast.success("Design idea shared with the community!");
                onSuccess();
            } else {
                toast.error("Failed to share idea.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsPosting(false);
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
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow -mr-16 -mt-16 rotate-45 border-l-4 border-black" />
                
                <div className="relative z-10">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Share an Idea</h2>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-8">Got a design idea? Share it with the community.</p>
                    
                    <div className="space-y-4">
                        <textarea 
                            autoFocus
                            value={newIdea}
                            onChange={(e) => setNewIdea(e.target.value)}
                            placeholder="I've been thinking about a new way to..."
                            className="w-full h-32 bg-gray-50 border-2 border-black rounded-[24px] p-6 text-xl font-medium outline-none focus:ring-4 focus:ring-accent-yellow transition-all resize-none"
                        />

                        {/* Media Upload Area */}
                        <div className="flex gap-4">
                            {!selectedImage && !selectedVideo ? (
                                <div className="flex-1 flex gap-4">
                                    <label className="flex-1 border-2 border-black border-dashed rounded-2xl p-6 hover:bg-gray-50 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group">
                                        <div className="p-3 bg-gray-100 rounded-xl group-hover:scale-110 transition-transform">
                                            <Camera className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Image / Sketch</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                    <label className="flex-1 border-2 border-black border-dashed rounded-2xl p-6 hover:bg-gray-50 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group">
                                        <div className="p-3 bg-gray-100 rounded-xl group-hover:scale-110 transition-transform">
                                            <Video className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Video Demo</span>
                                        <input type="file" className="hidden" accept="video/*" onChange={handleVideoChange} />
                                    </label>
                                </div>
                            ) : (
                                <div className="flex-1 relative border-2 border-black rounded-2xl overflow-hidden group h-48 bg-black">
                                    {selectedImage ? (
                                        <img src={selectedImage} className="w-full h-full object-cover" alt="Selected" />
                                    ) : (
                                        <video src={selectedVideo!} className="w-full h-full object-cover" />
                                    )}
                                    <button 
                                        onClick={() => { setSelectedImage(null); setSelectedVideo(null); }}
                                        className="absolute top-2 right-2 p-2 bg-black text-white rounded-full hover:scale-110 transition-transform shadow-lg z-10"
                                    >
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                        <button 
                            onClick={handleShare}
                            disabled={!newIdea || isPosting}
                            className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-30 flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#000]"
                        >
                            {isPosting ? <><Loader2 className="w-5 h-5 animate-spin" /> Sharing...</> : <><ArrowUpRight className="w-5 h-5" /> Post to Feed</>}
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
