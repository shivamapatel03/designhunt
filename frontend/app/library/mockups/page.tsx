"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ExternalLink, Briefcase, Image as ImageIcon, Box, Monitor, Layout, PenTool, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCKUP_RESOURCES = [
  {
    name: "LS Graphics",
    description: "Premium stationery and branding mockups with incredible attention to detail. Perfect for portfolio presentations.",
    url: "https://www.ls.graphics/free-mockups",
    category: "Branding",
    icon: <Briefcase className="w-5 h-5" />,
    color: "bg-accent-blue/10 text-accent-blue"
  },
  {
    name: "GraphicBurger",
    description: "A large collection of free, high-quality PSD mockups including stationery, billboards, and packaging.",
    url: "https://graphicburger.com/mock-ups/",
    category: "Mixed",
    icon: <Layout className="w-5 h-5" />,
    color: "bg-accent-yellow/10 text-yellow-700"
  },
  {
    name: "Mockup World",
    description: "The biggest directory of free photo-realistic PSD mockups online. Categorized for easy discovery.",
    url: "https://www.mockupworld.co/",
    category: "Directory",
    icon: <Box className="w-5 h-5" />,
    color: "bg-accent-purple/10 text-accent-purple"
  },
  {
    name: "Pixeden",
    description: "High-end stationery and branding mockups. Offers a great mix of free and premium resources.",
    url: "https://www.pixeden.com/free-design-web-resources",
    category: "Stationery",
    icon: <ImageIcon className="w-5 h-5" />,
    color: "bg-accent-pink/10 text-accent-pink"
  },
  {
    name: "Yellow Images",
    description: "Incredible object mockups for packaging and branding. Best-in-class for realistic textures.",
    url: "https://yellowimages.com/all/freebies",
    category: "Packaging",
    icon: <Box className="w-5 h-5" />,
    color: "bg-accent-yellow/20 text-yellow-800"
  },
  {
    name: "Shots.so",
    description: "The fastest way to create beautiful browser and screen mockups without leaving your browser.",
    url: "https://shots.so/",
    category: "Browser",
    icon: <Monitor className="w-5 h-5" />,
    color: "bg-accent-blue/20 text-accent-blue"
  }
];

export default function MockupsPage() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const rotateLeft = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotateRight = useTransform(scrollYProgress, [0, 1], [0, -45]);

  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-16 pb-12 relative overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative">
        {/* Background Shapes */}
        <motion.div 
          style={{ y: yLeft, rotate: rotateLeft }}
          className="absolute -left-20 md:-left-40 lg:-left-64 top-0 w-40 md:w-64 lg:w-96 opacity-[0.08] pointer-events-none z-0"
        >
          <img src="/bg/Polygon.png" alt="" className="w-full h-auto" />
        </motion.div>

        <motion.div 
          style={{ y: yRight, rotate: rotateRight }}
          className="absolute -right-20 md:-right-40 lg:-right-64 top-20 w-40 md:w-64 lg:w-96 opacity-[0.08] pointer-events-none z-0"
        >
          <img src="/bg/Soft Star.png" alt="" className="w-full h-auto" />
        </motion.div>

        <div className="relative z-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
              <Link href="/library" className="hover:text-black transition-colors">Library</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black">Mockups</span>
            </div>

            {/* Header */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-blue/10 text-accent-blue rounded-full mb-6 border border-accent-blue/20">
                <Briefcase className="w-4 h-4" />
                <span className="font-bold uppercase text-[11px] tracking-wider">Present Your Vision</span>
              </div>
              <h1 className="text-5xl font-clash font-black mb-6 tracking-tight">Stationery & <span className="text-accent-blue">Branding</span> Mockups</h1>
              <p className="text-xl text-gray-500 max-w-3xl leading-relaxed font-medium">
                Showcase your design projects with high-quality, professional mockups. Focused on stationery, identity, and branding—no fluff, just pure presentation power.
              </p>
            </div>
        </div>


        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {MOCKUP_RESOURCES.map((resource) => (
            <a 
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_#000] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[12px_12px_0px_0px_#000] transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-4 rounded-2xl flex items-center justify-center", resource.color)}>
                  {resource.icon}
                </div>
                <div className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {resource.category}
                </div>
              </div>
              
              <h3 className="text-2xl font-black mb-3 flex items-center gap-2">
                {resource.name}
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-6">
                {resource.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-bold text-accent-blue">
                Visit Resource <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="mt-20 p-10 bg-black text-white rounded-[40px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-40 bg-accent-blue/20 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-accent-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg rotate-3">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black mb-2 italic">Pro Tip: Presentation is 50% of the Work</h3>
              <p className="text-gray-400 font-medium text-lg leading-relaxed">
                When using stationery mockups, always ensure the lighting and shadows match your brand's aesthetic. High-contrast mockups work best for bold brands, while soft, natural lighting is perfect for minimal identities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
