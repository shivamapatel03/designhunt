"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, Check, Copy, Box, Layers, Code, Command, Flag, ShieldCheck, CircleDashed, Settings, Grid, Hash } from "lucide-react";
// ... (imports remain)


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
  },
  {
    id: "fontawesome",
    name: "Font Awesome",
    description: "The internet's icon library and toolkit, used by millions of designers, developers, and content creators.",
    website: "https://fontawesome.com",
    icon: <div className="font-black text-lg">FA</div>,
    features: ["Standard for web", "6,000+ icons", "Solid, Regular, Brands", "SVG & Webfont"],
    frameworks: {
      react: {
        install: "npm install @fortawesome/react-fontawesome",
        usage: `import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'\nimport { faCoffee } from '@fortawesome/free-solid-svg-icons'\n\nconst element = <FontAwesomeIcon icon={faCoffee} />`
      },
      vue: {
        install: "npm install @fortawesome/vue-fontawesome",
        usage: `<font-awesome-icon icon="coffee" />`
      },
      angular: {
        install: "npm install @fortawesome/angular-fontawesome",
        usage: `<fa-icon [icon]="faCoffee"></fa-icon>`
      },
      html: {
        install: '<script src="https://kit.fontawesome.com/YOUR_KIT_CODE.js"></script>',
        usage: `<i class="fas fa-coffee"></i>`
      }
    }
  },
  {
    id: "heroicons",
    name: "Heroicons",
    description: "Beautiful hand-crafted SVG icons, by the makers of Tailwind CSS.",
    website: "https://heroicons.com",
    icon: <div className="font-bold text-lg">Hi</div>,
    features: ["Made for Tailwind", "Outline & Solid", "MIT License", "Simple SVG"],
    frameworks: {
      react: {
        install: "npm install @heroicons/react",
        usage: `import { BeakerIcon } from '@heroicons/react/24/solid'\n\nfunction MyComponent() {\n  return (\n    <div>\n      <BeakerIcon className="h-6 w-6 text-blue-500" />\n    </div>\n  )\n}`
      },
      vue: {
        install: "npm install @heroicons/vue",
        usage: `<script setup>\nimport { BeakerIcon } from '@heroicons/vue/24/solid'\n</script>\n<template>\n  <BeakerIcon class="h-6 w-6 text-blue-500" />\n</template>`
      },
      angular: {install: "N/A", usage: "N/A"}, // No official
      html: {
        install: "// Copy SVG from website",
        usage: `<svg>...</svg>`
      }
    }
  },
  {
    id: "phosphor",
    name: "Phosphor Icons",
    description: "A flexible icon family for interfaces, diagrams, presentations — whatever, really.",
    website: "https://phosphoricons.com",
    icon: <div className="font-bold text-lg">Ph</div>,
    features: ["6 Weights", "Consistent Design", "Duo-tone support", "Clean aesthetic"],
    frameworks: {
      react: {
        install: "npm install @phosphor-icons/react",
        usage: `import { Heart } from "@phosphor-icons/react";\n\n<Heart size={32} weight="fill" />`
      },
      vue: {
        install: "npm install @phosphor-icons/vue",
        usage: `<script setup>\nimport { PhHeart } from "@phosphor-icons/vue";\n</script>\n<template>\n  <PhHeart :size="32" weight="fill" />\n</template>`
      },
      angular: {install: "N/A", usage: "N/A"},
      html: {
        install: '<script src="https://unpkg.com/@phosphor-icons/web"></script>',
        usage: `<i class="ph-fill ph-heart"></i>`
      }
    }
  },
  {
    id: "material",
    name: "Material Symbols",
    description: "The latest icons from Google. Consolidated 2,500+ glyphs in a single font file with a wide range of design variants.",
    website: "https://fonts.google.com/icons",
    icon: <div className="font-bold text-lg">Md</div>,
    features: ["Variable Font", "Google Standard", "Fill/Weight/Grade", "Optical Sizing"],
    frameworks: {
      react: {
        install: "npm install @mui/icons-material",
        usage: `import DeleteIcon from '@mui/icons-material/Delete';\n\n<DeleteIcon />`
      },
      vue: {install: "N/A", usage: "Use HTML/Webfomnt"},
      angular: {
        install: "npm install @angular/material",
        usage: `<mat-icon>delete</mat-icon>`
      },
      html: {
        install: '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">',
        usage: `<span class="material-icons">face</span>`
      }
    }
  },
  {
    id: "tabler",
    name: "Tabler Icons",
    description: "Over 5200 pixel-perfect icons for web design. Free and open source.",
    website: "https://tabler.io/icons",
    icon: <div className="font-bold text-lg">Tb</div>,
    features: ["5200+ Icons", "Pixel Perfect", "Stroke adjustable", "MIT License"],
    frameworks: {
      react: {
        install: "npm install @tabler/icons-react",
        usage: `import { IconHeart } from '@tabler/icons-react';\n\n<IconHeart size={24} color="red" />`
      },
      vue: {
        install: "npm install @tabler/icons-vue",
        usage: `<script setup>\nimport { IconHeart } from '@tabler/icons-vue';\n</script>`
      },
      angular: {install: "N/A", usage: "N/A"},
      html: {
        install: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">',
        usage: `<i class="ti ti-brand-github"></i>`
      }
    }
  },
  {
    id: "simpleicons",
    name: "Simple Icons",
    description: "3000+ Free SVG icons for popular brands.",
    website: "https://simpleicons.org",
    icon: <div className="font-bold text-lg">Si</div>,
    features: ["Brand Logos", "SVG", "Monochrome", "CDN available"],
    frameworks: {
      react: {install: "N/A", usage: "Download SVG"},
      vue: {install: "N/A", usage: "Download SVG"},
      angular: {install: "N/A", usage: "Download SVG"},
      html: {
        install: "CDN / SVG",
        usage: `<img src="https://cdn.simpleicons.org/nvidia" />`
      }
    }
  }
];

export default function IconsPage() {
  const [activeLibId, setActiveLibId] = useState("lucide");
  const [activeFramework, setActiveFramework] = useState<Framework>("react");

  const activeLib = LIBRARIES.find(l => l.id === activeLibId) || LIBRARIES[0];

  return (
    <div className="min-h-screen bg-gray-50 pt-14 md:pt-16">
      
      {/* Container */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 overflow-y-auto">
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
                                            {activeLibId === 'fontawesome' && (
                                                <div className="flex gap-4 text-blue-600">
                                                     <Flag className="w-8 h-8" />
                                                     <Flag className="w-8 h-8 opacity-50" />
                                                </div>
                                            )}
                                            {activeLibId === 'heroicons' && (
                                                <div className="flex gap-4 text-purple-600">
                                                     <ShieldCheck className="w-8 h-8" />
                                                     <ShieldCheck className="w-8 h-8" strokeWidth={1} />
                                                </div>
                                            )}
                                            {activeLibId === 'phosphor' && (
                                                <div className="flex gap-4 text-teal-600">
                                                     <CircleDashed className="w-8 h-8" />
                                                     <CircleDashed className="w-8 h-8" strokeWidth={3} />
                                                </div>
                                            )}
                                            {activeLibId === 'material' && (
                                                <div className="flex gap-4 text-gray-700">
                                                     <Settings className="w-8 h-8" />
                                                     <Settings className="w-8 h-8" fill="currentColor" />
                                                </div>
                                            )}
                                            {activeLibId === 'tabler' && (
                                                <div className="flex gap-4 text-pink-600">
                                                     <Grid className="w-8 h-8" />
                                                </div>
                                            )}
                                            {activeLibId === 'simpleicons' && (
                                                <div className="flex gap-4 text-black">
                                                     <Hash className="w-8 h-8" />
                                                     <Hash className="w-8 h-8 opacity-50" />
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


