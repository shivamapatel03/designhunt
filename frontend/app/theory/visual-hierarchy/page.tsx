"use client";

import { HeatmapSimulator } from "@/components/theory/HeatmapSimulator";
import { ArrowLeft, LayoutTemplate, ScanEye, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function VisualHierarchyPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Visual Hierarchy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Guide the user's eye. Hierarchy controls the order in which the human eye perceives what it sees.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">Scanning Patterns</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Users don't read; they scan. Understanding these patterns helps you place content where it will actually be seen.
                    </p>
                    <HeatmapSimulator />
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">Gestalt Principles</h2>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border border-gray-200">
                            <h3 className="font-bold mb-4">Proximity</h3>
                            <div className="flex gap-8 mb-4">
                                <div className="space-y-1">
                                    <div className="w-8 h-8 bg-black rounded"></div>
                                    <div className="w-8 h-8 bg-black rounded"></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="w-8 h-8 bg-black rounded"></div>
                                    <div className="w-8 h-8 bg-black rounded"></div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Objects close to each other are perceived as a group.</p>
                        </div>
                        
                         <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h3 className="font-bold mb-4">Similarity</h3>
                             <div className="flex gap-2 mb-4">
                                <div className="w-8 h-8 bg-black rounded-full"></div>
                                <div className="w-8 h-8 bg-black rounded-full"></div>
                                <div className="w-8 h-8 bg-[#2B7FFF] rounded-full"></div>
                            </div>
                            <p className="text-sm text-gray-600">Objects that look alike are perceived as related (or the anomaly stands out).</p>
                        </div>
                     </div>
                </section>
            </div>

             <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/visual-hierarchy/path` : "/login"} 
                    className={cn(
                        "group w-full relative inline-flex items-center justify-between gap-3 px-5 py-4 md:px-6 md:py-5 font-bold transition-all hover:translate-y-[-2px] active:scale-95 border border-black text-xs md:text-sm rounded-full",
                        user 
                            ? "bg-[#2B7FFF] text-white shadow-[4px_4px_0_0_#1556B8] hover:shadow-[6px_6px_0_0_#1556B8]" 
                            : "bg-gray-100 text-gray-400 border-gray-200 shadow-none hover:border-black hover:text-black"
                    )}
                >
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ) : (
                            <Lock className="w-5 h-5 opacity-40" />
                        )}
                        <span className="font-semibold">Advanced learning</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Key Terms</h3>
                    <ul className="space-y-3">
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Focal Point</strong> 
                            <span className="text-gray-500">The area that first attracts a user's attention.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Scanning Patterns</strong> 
                            <span className="text-gray-500">The way eyes move (F, Z, or Layer-cake patterns).</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Proximity</strong> 
                            <span className="text-gray-500">Placing related elements closer together to group them.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Emphasis</strong> 
                            <span className="text-gray-500">Making important elements stand out via size or color.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 border-2 border-black bg-accent-yellow shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-4">The Squint Test</h3>
                    <p className="text-sm text-gray-800 mb-4">
                        Step back and squint at your screen. What stands out first? If it's not the primary action/message, your hierarchy is broken.
                    </p>
                </div>
                 <div className="p-6 border border-gray-200 bg-white">
                    <h3 className="font-bold mb-4">Quick Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Size (Larger = More important)</li>
                        <li>• Color (Bold = Attention)</li>
                        <li>• White Space (Isolation = Focus)</li>
                    </ul>
                </div>
            </aside>
         </div>
    </div>
  );
}

