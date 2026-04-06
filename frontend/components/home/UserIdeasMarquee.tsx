"use client";

import { IdeaCard } from "@/components/community/IdeaCard";
import { motion } from "framer-motion";

export function UserIdeasMarquee({ ideas }: { ideas: any[] }) {
  if (!ideas?.length) return null;

  // Duplicate the ideas array to create a seamless infinite loop
  const duplicatedIdeas = [...ideas, ...ideas, ...ideas];

  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-2 font-clash tracking-tight">Community Ideas</h2>
        <p className="text-xl text-muted-foreground font-medium font-clash">See what other designers are sharing.</p>
      </div>

      <div className="relative flex overflow-x-hidden w-full group py-4">
        <motion.div 
          className="flex gap-6 w-max px-4"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {duplicatedIdeas.map((idea, index) => (
            <div key={`idea-${idea.id}-${index}`} className="w-[380px] flex-shrink-0">
               <IdeaCard idea={idea} small={true} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
