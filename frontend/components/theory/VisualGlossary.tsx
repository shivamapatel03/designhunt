"use client";

import { useState } from "react";
import { GLOSSARY_TERMS } from "@/lib/glossary-data";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VisualGlossaryProps {
    term: string;
    children?: React.ReactNode;
}

export function VisualGlossary({ term, children }: VisualGlossaryProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Normalize fuzzy match (case insensitive)
    const key = Object.keys(GLOSSARY_TERMS).find(k => k.toLowerCase() === term.toLowerCase());
    const data = key ? GLOSSARY_TERMS[key] : null;

    if (!data) return <>{children || term}</>;

    return (
        <span 
            className="relative inline-block cursor-help border-b-2 border-dotted border-accent-blue hover:bg-accent-blue/10 transition-colors rounded px-0.5"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(!isOpen)}
        >
            {children || term}
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-black text-white p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] z-50 text-left"
                    >
                        <div className="flex items-center gap-2 mb-2 border-b border-white/20 pb-2">
                            <Info className="w-4 h-4 text-accent-yellow" />
                            <span className="font-bold text-accent-yellow text-sm uppercase tracking-wider">{data.category}</span>
                        </div>
                        <h4 className="font-bold text-lg mb-1">{data.term}</h4>
                        <p className="text-sm font-medium leading-relaxed text-gray-300">
                            {data.definition}
                        </p>
                        
                        {/* Triangle Pointer */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black" />
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
