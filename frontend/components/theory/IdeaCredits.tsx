"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Beaker, Star } from "lucide-react";

interface ImplementedIdea {
    id: number;
    name: string;
    idea: string;
    user_image?: string;
}

export function IdeaCredits() {
    const [credits, setCredits] = useState<ImplementedIdea[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const res = await fetch("/api/admin/ideas");
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Only show implemented ideas for the credits gallery
                    const implemented = data.filter((i: any) => i.status === 'implemented');
                    setCredits(implemented);
                }
            } catch (error) {
                console.error("Failed to fetch credits", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCredits();
    }, []);

    if (loading || credits.length === 0) return null;

    return (
        <section className="mt-20">
            <div className="flex flex-col items-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow text-xs font-black uppercase tracking-widest mb-4">
                    <Star className="w-3 h-3 fill-accent-yellow" /> Community Contributions
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic text-center">Lab Gallery</h2>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2">Experiments powered by your ideas</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credits.map((item, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={item.id}
                        className="bg-white border-4 border-black p-6 rounded-[32px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent-blue border-2 border-black flex items-center justify-center text-white font-black overflow-hidden shadow-sm">
                                {item.user_image ? (
                                    <img src={item.user_image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{item.name.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <h4 className="font-black uppercase text-sm leading-tight">{item.name}</h4>
                                <p className="text-[10px] text-accent-blue font-black uppercase tracking-widest">Idea Contributor</p>
                            </div>
                        </div>
                        <p className="text-sm font-bold italic text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-100">
                            "{item.idea}"
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-600 mt-auto">
                            <Beaker className="w-3 h-3" /> Status: Live in Lab
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
