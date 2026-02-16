"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, PenTool, Layout } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

export function MasterDesignSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-24 bg-[#fafafa] overflow-hidden">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Everything You Need to <br/> Master Design</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">Structured modules designed to take you from beginner to expert.</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <FeatureCard 
              icon={<BookOpen className="w-10 h-10" />}
              title="Resource Library"
              description="Icons, Typography, and Wireframes to speed up your workflow."
              color="bg-accent-yellow"
              href="/library"
              variants={itemVariants}
            />
            <FeatureCard 
              icon={<PenTool className="w-10 h-10" />}
              title="Theory Library"
              description="Interactive design encyclopedia. Color, Typography, Grid, and more."
              color="bg-accent-blue"
              href="/theory"
              textColor="text-white"
              variants={itemVariants}
            />
             <FeatureCard 
              icon={<Layout className="w-10 h-10" />}
              title="Tool Mastery"
              description="Master Figma, Webflow, Rive, and more with practical tasks."
              color="bg-accent-pink"
              href="/tools"
              textColor="text-white"
              variants={itemVariants}
            />
          </motion.div>
        </div>
      </section>
  );
}

interface FeatureCardProps { 
    icon: ReactNode; 
    title: string; 
    description: string; 
    color: string; 
    href: string; 
    textColor?: string;
    variants?: any;
}

function FeatureCard({ icon, title, description, color, href, textColor = "text-black", variants }: FeatureCardProps) {
  return (
    <motion.div variants={variants}>
        <Link href={href} className={`group block p-10 rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_#000] transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000] relative overflow-hidden ${color} ${textColor}`}>
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110" />
            
            <div className="relative z-10">
                <div className={`mb-6 p-4 rounded-2xl border-2 border-black inline-flex ${textColor === 'text-white' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    {icon}
                </div>
                <h3 className="text-3xl font-black mb-3">{title}</h3>
                <p className={`text-lg font-medium leading-relaxed mb-8 opacity-90`}>{description}</p>
                
                <div className={`inline-flex items-center gap-2 font-black text-lg border-b-2 ${textColor === 'text-white' ? 'border-white' : 'border-black'} pb-1 group-hover:gap-4 transition-all`}>
                    Explore <ArrowRight className="w-5 h-5" />
                </div>
            </div>
        </Link>
    </motion.div>
  );
}
