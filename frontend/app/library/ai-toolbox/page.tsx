"use client";

import Link from "next/link";
import { ChevronRight, ExternalLink, Wand2, Brain, Sparkles, Image as ImageIcon, MessageSquare, Code, Search, Zap, ArrowRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const AI_TOOLS = [
  {
    name: "Midjourney",
    description: "The gold standard for high-fidelity AI image generation. Incredible artistic range and community.",
    url: "https://www.midjourney.com/",
    category: "Generation",
    icon: <ImageIcon className="w-5 h-5" />,
    color: "bg-accent-purple/10 text-accent-purple"
  },
  {
    name: "ChatGPT (DALL-E 3)",
    description: "Advanced conversational AI combined with powerful image generation and data analysis.",
    url: "https://chatgpt.com/",
    category: "Productivity",
    icon: <MessageSquare className="w-5 h-5" />,
    color: "bg-accent-blue/10 text-accent-blue"
  },
  {
    name: "Claude",
    description: "Highly helpful, harmless, and honest AI from Anthropic. Exceptional for writing and coding assistance.",
    url: "https://claude.ai/",
    category: "Coding",
    icon: <Code className="w-5 h-5" />,
    color: "bg-accent-pink/10 text-accent-pink"
  },
  {
    name: "Leonardo.ai",
    description: "Full creative production pipeline for high-quality visual assets. Great fine-tuning controls.",
    url: "https://leonardo.ai/",
    category: "Generation",
    icon: <Wand2 className="w-5 h-5" />,
    color: "bg-accent-yellow/20 text-yellow-800"
  },
  {
    name: "Magnific AI",
    description: "The world's most powerful image upscaler and enhancer. Rebuilds pixel detail from scratch.",
    url: "https://magnific.ai/",
    category: "Upscaling",
    icon: <Zap className="w-5 h-5" />,
    color: "bg-accent-blue/20 text-accent-blue"
  },
  {
    name: "Perplexity AI",
    description: "An AI-powered search engine that provides direct answers with cited sources.",
    url: "https://www.perplexity.ai/",
    category: "Research",
    icon: <Search className="w-5 h-5" />,
    color: "bg-accent-purple/20 text-accent-purple"
  }
];

export default function AIToolboxPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-14 md:pt-16 pb-12 overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
          <Link href="/library" className="hover:text-black transition-colors">Library</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">AI Toolbox</span>
        </div>

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-yellow text-black rounded-full mb-6 font-black uppercase text-[10px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border border-black transform -rotate-1">
            <Brain className="w-4 h-4" />
            <span>Empower Your Workflow</span>
          </div>
          <h1 className="text-6xl font-clash font-black mb-6 tracking-tighter leading-[0.9]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">AI Toolbox</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
            A hand-picked selection of the most powerful AI tools for modern designers. Boost your creativity, speed up your production, and stay ahead of the curve.
          </p>
        </div>

        {/* AI Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_TOOLS.map((tool) => (
            <a 
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border-2 border-black rounded-[40px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3", tool.color)}>
                {tool.icon}
              </div>
              
              <div className="px-3 py-1 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                {tool.category}
              </div>
              
              <h3 className="text-2xl font-black mb-4 group-hover:text-accent-yellow transition-colors cursor-pointer flex items-center gap-2">
                {tool.name}
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              
              <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 flex-1">
                {tool.description}
              </p>
              
              <div className="w-full pt-6 border-t border-black/5 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                Try Tool <ArrowRight className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>


      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-80 bg-accent-yellow/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 p-60 bg-accent-blue/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
    </div>
  );
}
