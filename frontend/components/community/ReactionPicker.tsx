"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Zap, Star, Flame, Trophy } from "lucide-react";

export const REACTIONS = [
    { type: 'heart', icon: Heart, color: 'text-accent-red', label: 'Love' },
    { type: 'mindblown', icon: Zap, color: 'text-accent-yellow', label: 'Wow' },
    { type: 'fire', icon: Flame, color: 'text-accent-orange', label: 'Hot' },
    { type: 'top', icon: Trophy, color: 'text-accent-blue', label: 'Top' },
    { type: 'gem', icon: Star, color: 'text-purple-500', label: 'Gem' }
];

export function ReactionPicker({ 
    onSelect, 
    isVisible 
}: { 
    onSelect: (type: string) => void, 
    isVisible: boolean 
}) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: -45 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute z-50 bg-white border-2 border-black rounded-full p-1.5 flex gap-1 shadow-[4px_4px_0px_0px_black] left-0"
                >
                    {REACTIONS.map((reaction, index) => (
                        <motion.button
                            key={reaction.type}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                            whileHover={{ scale: 1.3, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(reaction.type);
                            }}
                            className={`p-2 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors ${reaction.color}`}
                            title={reaction.label}
                        >
                            <reaction.icon className="w-5 h-5 fill-current" />
                        </motion.button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
