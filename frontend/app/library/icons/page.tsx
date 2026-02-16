"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, Check, Copy, Box, Layers, Code, Command } from "lucide-react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/utils";

// --- Data Structure ---
type Framework = "react" | "vue" | "angular" | "html";

interface IconLibrary {
  id: string;
  name: string;
  description: string;
  website: string;
  icon: React.ReactNode;
  features: string[];
  frameworks: Record<Framework, {
    install: string;
    usage: string;
  }>;
}

const LIBRARIES: IconLibrary[] = [
  {
    id: "lucide",
    name: "Lucide",
    description: "Beautiful & consistent icon toolkit made by the community. Lightweight, tree-shakable, and standard for modern web development.",
    website: "https://lucide.dev",
    icon: <Box className="w-6 h-6" />,
    features: ["Consistent stroke weights", "Clean rounded corners", "Tree-shakable", "Zero dependencies"],
    frameworks: {
      react: {
        install: "npm install lucide-react",
        usage: `import { Camera } from 'lucide-react';\n\nconst App = () => {\n  return <Camera color="red" size={48} />;\n};`
      },
      vue: {
        install: "npm install lucide-vue-next",
        usage: `<script setup>\nimport { Camera } from 'lucide-vue-next';\n</script>\n\n<template>\n  <Camera color="red" :size="48" />\n</template>`
      },
      angular: {
        install: "npm install lucide-angular",
        usage: `import { LucideAngularModule, Camera } from 'lucide-angular';\n\n@NgModule({\n  imports: [LucideAngularModule.pick({ Camera })]\n})`
      },
      html: {
        install: '<script src="https://unpkg.com/lucide@latest"></script>',
        usage: `<i data-lucide="camera"></i>\n<script>\n  lucide.createIcons();\n</script>`
      }
    }
  },
  {
    id: "radix",
    name: "Radix Icons",
    description: "A crisp set of 15x15 icons designed by the Modulz team. Perfect for dense UI interfaces and control panels.",
    website: "https://icons.radix-ui.com",
    icon: <Layers className="w-6 h-6" />,
    features: ["Optimized for 15px grid", "Sharp and crisp", "SVG Component based", "Perfect for admin dashboards"],
    frameworks: {
      react: {
        install: "npm install @radix-ui/react-icons",
        usage: `import { FaceIcon, SunIcon } from '@radix-ui/react-icons';\n\nexport default function MyComponent() {\n  return (\n    <div className="flex gap-4">\n      <FaceIcon />\n      <SunIcon />\n    </div>\n  );\n}`
      },
      vue: {
        install: "npm install rad-icons-vue",
        usage: `<script setup>\nimport { FaceIcon } from 'rad-icons-vue';\n</script>\n\n<template>\n  <FaceIcon />\n</template>`
      },
      angular: {
        install: "Coming soon",
        usage: "// No official package yet"
      },
      html: {
        install: "// Copy SVG directly from website",
        usage: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>`
      }
    }
  },
   {
    id: "react-icons",
    name: "React Icons",
    description: "Include popular icons in your React projects easily with react-icons, which utilizes ES6 imports that allows you to include only the icons that your project is using.",
    website: "https://react-icons.github.io/react-icons/",
    icon: <Command className="w-6 h-6" />,
    features: ["Includes FontAwesome, Material, etc.", "Huge collection", "Easy imports", "SVG based"],
    frameworks: {
      react: {
        install: "npm install react-icons",
        usage: `import { FaBeer } from 'react-icons/fa';\n\nclass Question extends React.Component {\n  render() {\n    return <h3> Lets go for a <FaBeer />? </h3>\n  }\n}`
      },
      vue: {install: "N/A", usage: "N/A"},
      angular: {install: "N/A", usage: "N/A"},
      html: {install: "N/A", usage: "N/A"}
    }
  }
];

export default function IconsPage() {
  const [activeLibId, setActiveLibId] = useState("lucide");
  const [activeFramework, setActiveFramework] = useState<Framework>("react");

  const activeLib = LIBRARIES.find(l => l.id === activeLibId) || LIBRARIES[0];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      
      {/* Container */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-y-auto">
             <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
                    <Link href="/library" className="hover:text-black">Library</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-black">Icons</span>
                </div>
                <h1 className="text-2xl font-black mb-2">Icon Sets</h1>
                <p className="text-sm text-gray-500 mb-6">Select a library to view documentation.</p>
                
                <div className="space-y-2">
                    {LIBRARIES.map((lib) => (
                        <button
                            key={lib.id}
                            onClick={() => setActiveLibId(lib.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border-2",
                                activeLibId === lib.id 
                                    ? "bg-black text-white border-black shadow-md" 
                                    : "bg-white text-gray-700 border-transparent hover:bg-gray-100"
                            )}
                        >
                            <div className={cn("p-2 rounded-lg", activeLibId === lib.id ? "bg-white/20" : "bg-gray-200")}>
                                {lib.icon}
                            </div>
                            <span className="font-bold">{lib.name}</span>
                        </button>
                    ))}
                </div>
             </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-4xl font-black mb-2">{activeLib.name}</h2>
                        <p className="text-xl text-gray-600 max-w-2xl">{activeLib.description}</p>
                    </div>
                    <a 
                        href={activeLib.website} 
                        target="_blank" 
                        className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
                    >
                        Official Docs <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {activeLib.features.map((feat, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            {feat}
                        </span>
                    ))}
                </div>

                {/* Interactive Documentation Card */}
                <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_#000]">
                    
                    {/* Toolbar */}
                    <div className="border-b-2 border-black bg-gray-50 p-4 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-400 border border-black/20" />
                             <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black/20" />
                             <div className="w-3 h-3 rounded-full bg-green-400 border border-black/20" />
                        </div>
                        
                        {/* Framework Switcher */}
                        <div className="flex p-1 bg-gray-200 rounded-lg">
                            {(["react", "vue", "angular", "html"] as Framework[]).map((fw) => (
                                <button
                                    key={fw}
                                    onClick={() => setActiveFramework(fw)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-md text-sm font-bold capitalize transition-all",
                                        activeFramework === fw 
                                            ? "bg-white text-black shadow-sm" 
                                            : "text-gray-500 hover:text-black"
                                    )}
                                >
                                    {fw}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8">
                        {activeLib.frameworks[activeFramework].install === "N/A" ? (
                            <div className="text-center py-12 text-gray-400">
                                <p className="font-bold text-lg mb-2">Not Supported</p>
                                <p>{activeLib.name} does not have a dedicated package for {activeFramework}.</p>
                            </div>
                        ) : (
                            <>
                                {/* Installation */}
                                <div className="mb-10">
                                    <h3 className="flex items-center gap-2 font-black text-lg mb-4">
                                        <div className="w-6 h-6 rounded bg-black text-white flex items-center justify-center text-xs">1</div>
                                        Installation
                                    </h3>
                                    <CodeBlock code={activeLib.frameworks[activeFramework].install} />
                                </div>

                                {/* Usage */}
                                <div>
                                    <h3 className="flex items-center gap-2 font-black text-lg mb-4">
                                        <div className="w-6 h-6 rounded bg-black text-white flex items-center justify-center text-xs">2</div>
                                        Usage
                                    </h3>
                                    <div className="grid lg:grid-cols-2 gap-6">
                                        <CodeBlock language="tsx" code={activeLib.frameworks[activeFramework].usage} />
                                        
                                        {/* Visual Preview (Mockup) */}
                                        <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[200px] p-6">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Live Preview (Mock)</p>
                                            
                                            {activeLibId === 'lucide' && (
                                                <div className="flex gap-4">
                                                    <Box className="w-12 h-12 text-black" />
                                                    <Box className="w-12 h-12 text-red-500" />
                                                    <Box className="w-12 h-12 text-blue-500 opacity-50" />
                                                </div>
                                            )}
                                            {activeLibId === 'radix' && (
                                                 <div className="flex gap-4">
                                                    <Layers className="w-4 h-4 text-black" />
                                                    <Layers className="w-8 h-8 text-black" /> {/* Radix is usually small, mocking scaling */}
                                                 </div>
                                            )}
                                            {activeLibId === 'react-icons' && (
                                                <div className="flex gap-4">
                                                     <Command className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>

            </div>
        </div>

      </div>
    </div>
  );
}


