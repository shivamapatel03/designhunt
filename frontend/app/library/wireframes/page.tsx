import Link from "next/link";
import { ChevronRight, Figma, PenTool, Layout, Box, Frame, Monitor, Edit3, Grid, PlusCircle } from "lucide-react";

const RESOURCES = [
  {
    category: "UI Kits & Systems",
    items: [
      {
        name: "Untitled UI (Free)",
        description: "The ultimate UI kit and design system for Figma. The free version includes thousands of components.",
        url: "https://www.untitledui.com/free",
        icon: Figma,
        color: "text-[#F24E1E]",
        tag: "Free Version",
        tagColor: "bg-green-100 text-green-700"
      },
      {
        name: "FlowBite Design System",
        description: "Huge collection of open-source UI components and pages in Figma. perfect for Tailwind projects.",
        url: "https://flowbite.com/figma/",
        icon: Box,
        color: "text-blue-600",
        tag: "Open Source",
        tagColor: "bg-blue-100 text-blue-700"
      },
      {
        name: "Relume Library",
        description: "The component library for Webflow and Figma. Thousands of unstyled components for rapid wireframing.",
        url: "https://library.relume.io/",
        icon: Layout,
        color: "text-black",
        tag: "Popular",
        tagColor: "bg-black text-white"
      },
      {
        name: "shadcn/ui Kit",
        description: "Unofficial Figma kit for the popular shadcn/ui component library. Great for modern React apps.",
        url: "https://ui.shadcn.com/docs/figma",
        icon: Frame,
        color: "text-slate-800",
        tag: "Component Kit",
        tagColor: "bg-slate-100 text-slate-800"
      },
       {
        name: "Frames X",
        description: "A comprehensive design system and UI kit for Figma to help you design faster and better.",
        url: "https://framesxdesign.com/",
        icon: Grid,
        color: "text-purple-600",
        tag: "Robust",
        tagColor: "bg-purple-100 text-purple-700"
      }
    ]
  },
  {
    category: "Wireframing Tools",
    items: [
      {
        name: "Excalidraw",
        description: "Virtual whiteboard for sketching hand-drawn like diagrams. Perfect for quick ideation and logic flows.",
        url: "https://excalidraw.com/",
        icon: PenTool,
        color: "text-purple-500",
        tag: "Web Tool",
        tagColor: "bg-purple-50 text-purple-700"
      },
      {
        name: "tldraw",
        description: "A tiny little drawing app. A simple, free, and open-source infinite canvas whiteboard.",
        url: "https://www.tldraw.com/",
        icon: Edit3,
        color: "text-green-600",
        tag: "Infinite Canvas",
        tagColor: "bg-green-50 text-green-700"
      },
      {
        name: "Wireframe.cc",
        description: "A minimalist web-based wireframing tool. Focus on functionality without distractions.",
        url: "https://wireframe.cc/",
        icon: Monitor,
        color: "text-orange-500",
        tag: "Minimalist",
        tagColor: "bg-orange-50 text-orange-700"
      },
       {
        name: "Eraser.io",
        description: "The whiteboard for engineering teams. Draw architecture diagrams and wireframes with code.",
        url: "https://eraser.io/",
        icon: Box,
        color: "text-pink-500",
        tag: "For Engineers",
        tagColor: "bg-pink-50 text-pink-700"
      }
    ]
  }
];

export default function WireframesPage() {
  return (
    <div className="min-h-screen bg-white pt-14 md:pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
            <Link href="/library" className="hover:text-black">Library</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">Wireframes</span>
        </div>

        <h1 className="text-5xl font-clash font-black mb-6">Wireframe Kits & Tools</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Jumpstart your design process with these high-quality, free wireframing kits and specialized tools.
        </p>

        {/* Feature: Create Wireframe */}
        <div className="bg-black text-white p-8 rounded-[32px] mb-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <PenTool className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-accent-yellow uppercase tracking-widest text-xs">New Feature</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Create your own <br/> wireframes instantly.</h2>
                <p className="text-gray-400 font-medium text-lg max-w-md mb-8">
                    Use our built-in infinite canvas editor to sketch, plan, and iterate on your ideas without leaving Designhunt..
                </p>
                <Link 
                    href="/library/wireframes/editor" 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-accent-yellow transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                    <PlusCircle className="w-5 h-5" />
                    Start Sketching
                </Link>
            </div>
            
            {/* Visual Decoration */}
            <div className="relative z-10 md:pr-12">
                 <div className="w-64 h-48 bg-white/10 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center rotate-3 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-3" />
                        <div className="h-2 w-24 bg-white/20 rounded-full mx-auto mb-2" />
                        <div className="h-2 w-16 bg-white/20 rounded-full mx-auto" />
                    </div>
                 </div>
                 <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 -z-10" />
                 <div className="absolute top-0 right-10 w-[1px] h-full bg-white/20 -z-10" />
            </div>

            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-50 pointer-events-none" />
        </div>

        <div className="space-y-20">
            {RESOURCES.map((section, idx) => (
                <div key={idx}>
                    <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                        {section.category === "UI Kits & Systems" ? <Figma className="w-8 h-8" /> : <PenTool className="w-8 h-8" />}
                        {section.category}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {section.items.map((item, i) => (
                            <a 
                                key={i} 
                                href={item.url} 
                                target="_blank" 
                                className="group block bg-gray-50 border-2 border-transparent hover:border-black rounded-3xl p-8 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-16 h-16 bg-white border-2 border-black/10 group-hover:border-black rounded-2xl flex items-center justify-center transition-colors">
                                        <item.icon className={`w-8 h-8 ${item.color}`} />
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${item.tagColor}`}>
                                        {item.tag}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black mb-2">{item.name}</h3>
                                <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                                    {item.description}
                                </p>
                                <div className="font-bold underline text-sm flex items-center gap-2">
                                    Open Resource <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}
