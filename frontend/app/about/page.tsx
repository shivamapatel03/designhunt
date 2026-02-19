"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  ArrowRight,
  Library,
  Star
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision First",
      description: "We don't just collect resources; we curate the absolute best. Every tool and tutorial is vetted for quality.",
      color: "bg-accent-blue"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Design for All",
      description: "Breaking down complex design theories into visual, easy-to-digest formats for designers at any stage.",
      color: "bg-accent-pink"
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Trust & Transparency",
      description: "A community-focused approach where credit is always given and feedback is used to grow together.",
      color: "bg-accent-yellow"
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: "Constant Evolution",
      description: "The design world moves fast. We stay ahead of the curve so you don't have to.",
      color: "bg-accent-purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-6 md:px-16 lg:px-24 py-20 bg-white border-b-4 border-black">
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-xs font-black uppercase tracking-[0.2em] mb-8">
              <Star className="w-3 h-3 text-accent-yellow fill-accent-yellow" /> Our Mission
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 tracking-tighter italic uppercase leading-[0.9]">
              Democratizing <span className="text-accent-blue">Design</span> <br />
              Through <span className="text-accent-pink">Discovery.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl lg:text-2xl font-bold text-gray-500 max-w-2xl leading-relaxed mb-12">
              Design Hunt started as a simple repo and grew into a specialized ecosystem for modern visual creators. We bridge the gap between creative messy energy and structured professional mastery.
            </motion.p>
          </motion.div>
        </div>

        {/* Abstract Floating Element - Re-positioned to stay within reach */}
        <motion.div 
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-[10%] hidden lg:block opacity-20 pointer-events-none"
        >
          <div className="w-[300px] h-[300px] rounded-[80px] border-8 border-black shadow-[12px_12px_0px_0px_rgba(255,103,137,1)] bg-accent-yellow/10 -rotate-12 translate-x-1/2" />
        </motion.div>
      </section>

      {/* Narrative Section */}
      <section className="px-6 md:px-16 lg:px-24 py-24 bg-[#fafafa]">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">The Design Hunt <br />Story</h2>
            <div className="space-y-6 text-base md:text-lg font-bold text-gray-400 leading-relaxed">
              <p>In a world overflowing with generic "UI Kits" and low-quality assets, we realized the real challenge wasn't finding resources—it was finding the <span className="text-black italic underline decoration-4 decoration-accent-blue underline-offset-4">right</span> ones.</p>
              <p>We built Design Hunt to be the filter. A place where color theory, typography systems, and prototyping tools are organized for execution, not just inspiration.</p>
              <p>Today, we're a community-driven hub that empowers thousands of designers to build premium interfaces with speed and accuracy.</p>
            </div>
            
            <div className="flex gap-4 pt-4">
                <div className="p-5 md:p-6 bg-white border-4 border-black rounded-[24px] md:rounded-[32px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center flex-1">
                    <div className="text-3xl md:text-4xl font-black mb-1">500+</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curated Tools</div>
                </div>
                <div className="p-5 md:p-6 bg-white border-4 border-black rounded-[24px] md:rounded-[32px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center flex-1">
                    <div className="text-3xl md:text-4xl font-black mb-1">10k+</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly Users</div>
                </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="w-full aspect-square bg-black rounded-[48px] md:rounded-[64px] border-4 border-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] group">
                <img 
                    src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000" 
                    alt="Process" 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 font-bold italic"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8 md:p-12">
                     <p className="text-white font-black italic text-xl md:text-2xl">Building the future <br />of design education.</p>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="px-6 md:px-16 lg:px-24 py-24 bg-white border-t-4 border-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic">Our Shared Values</h2>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm text-center">The principles behind the hunt</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center sm:text-left">
            {values.map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 md:p-8 bg-white border-4 border-black rounded-[32px] md:rounded-[40px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2 group flex flex-col items-center sm:items-start"
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-6 md:mb-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:rotate-12 ${v.color} text-white`}>
                  {v.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 uppercase italic tracking-tighter">{v.title}</h3>
                <p className="text-gray-500 font-bold leading-relaxed text-xs md:text-sm">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-16 lg:px-24 py-24 bg-accent-yellow border-t-4 border-black flex items-center justify-center overflow-hidden relative">
        <motion.div 
            animate={{ 
                x: [-100, 100],
                rotate: [0, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 text-black/5 text-[200px] md:text-[300px] font-black pointer-events-none select-none uppercase"
        >
            HUNT
        </motion.div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 italic uppercase leading-none tracking-tighter">
            Ready to Start <br />Your Journey?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Link 
                href="/library" 
                className="group flex items-center justify-center gap-3 bg-black text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black uppercase text-xs md:text-sm tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Explore Library <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
