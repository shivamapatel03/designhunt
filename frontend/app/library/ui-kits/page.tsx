"use client";

import Link from "next/link";
import { ChevronRight, ExternalLink, Layout, Component, Smartphone, Monitor, Code, Palette, Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const UI_KIT_RESOURCES = [
  {
    name: "Untitled UI",
    description: "The largest and most advanced Figma UI kit and design system in the world. Incredible quality and depth.",
    url: "https://www.untitledui.com/free-figma-ui-kit",
    category: "Design System",
    icon: <Layout className="w-5 h-5" />,
    color: "bg-accent-blue/10 text-accent-blue"
  },
  {
    name: "Cruip",
    description: "Ready-to-use landing page templates built with Tailwind CSS and React/Next.js. Clean and developer-friendly.",
    url: "https://cruip.com/free-templates/",
    category: "Landing Pages",
    icon: <Code className="w-5 h-5" />,
    color: "bg-accent-purple/10 text-accent-purple"
  },
  {
    name: "Flowbite",
    description: "Build websites even faster with components on top of Tailwind CSS. Includes dashboards and more.",
    url: "https://flowbite.com/figma/",
    category: "Components",
    icon: <Component className="w-5 h-5" />,
    color: "bg-accent-blue/20 text-accent-blue"
  },
  {
    name: "UIGradients",
    description: "A large collection of beautiful color gradients for your next project. Perfect for UI kits and backgrounds.",
    url: "https://uigradients.com/",
    category: "Design System",
    icon: <Palette className="w-5 h-5" />,
    color: "bg-accent-pink/10 text-accent-pink"
  },
  {
    name: "UI8",
    description: "A marketplace for premium design resources, but they have an incredible freebie section for UI kits.",
    url: "https://ui8.net/category/freebies",
    category: "Mixed",
    icon: <Smartphone className="w-5 h-5" />,
    color: "bg-accent-yellow/20 text-yellow-800"
  },
  {
    name: "Lapa Ninja",
    description: "The best landing page design inspiration and free UI kits from around the web.",
    url: "https://www.lapa.ninja/freebies/",
    category: "Inspiration",
    icon: <Monitor className="w-5 h-5" />,
    color: "bg-accent-purple/20 text-accent-purple"
  }
];

export default function UIKitsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-16 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
          <Link href="/library" className="hover:text-black transition-colors">Library</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">UI Kits</span>
        </div>

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white rounded-full mb-6 shadow-md border border-black/10">
            <Layout className="w-4 h-4 text-accent-blue" />
            <span className="font-bold uppercase text-[11px] tracking-wider">Build Faster</span>
          </div>
          <h1 className="text-5xl font-clash font-black mb-6 tracking-tight">Full-System <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">UI Kits</span></h1>
          <p className="text-xl text-gray-500 max-w-3xl leading-relaxed font-medium">
            Jumpstart your projects with ready-to-use design systems, dashboard templates, and landing page kits. Optimized for Figma, Tailwind, and modern front-end frameworks.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {UI_KIT_RESOURCES.map((resource) => (
            <a 
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_#000] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[12px_12px_0px_0px_#000] transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-3 rounded-2xl flex items-center justify-center", resource.color)}>
                  {resource.icon}
                </div>
                <div className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-black/5">
                  {resource.category}
                </div>
              </div>
              
              <h3 className="text-2xl font-black mb-3 group-hover:text-accent-blue transition-colors">
                {resource.name}
              </h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6 flex-1">
                {resource.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
                Download Resource <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>

        {/* Featured Resource Banner */}
        <div className="mt-20 p-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink rounded-[42px] shadow-2xl">
            <div className="bg-white rounded-[40px] p-10 md:p-14 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-black uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" /> Featured Kit
                    </div>
                    <h2 className="text-4xl md:text-5xl font-clash font-black tracking-tighter leading-[0.9]">Meet the New <br/><span className="text-accent-blue">DesignHunt</span> System</h2>
                    <p className="text-lg text-gray-500 font-medium max-w-xl">
                        Our internal design system is coming soon to the public. 200+ components, 50+ templates, and full integration with Tailwind v4.
                    </p>
                    <button className="px-8 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-none">
                        Join Waitlist
                    </button>
                </div>
                <div className="w-full md:w-1/2 aspect-video bg-gray-50 rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_#000] flex items-center justify-center p-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-accent-blue/5 group-hover:bg-accent-blue/0 transition-colors" />
                    <Wand2 className="w-20 h-20 text-black/10 group-hover:text-accent-blue/20 transition-all group-hover:scale-125 group-hover:rotate-12" />
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-black/5 flex items-center justify-between">
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30 italic">Preview Mode</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
)
