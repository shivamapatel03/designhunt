"use client";

import { GridGenerator } from "@/components/tools/GridGenerator";
import { ArrowLeft, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function LayoutPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Layout & Grids</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Invisible lines that hold your design together. Grids establish structure, alignment, and consistency.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4">1. The 12-Column Grid</h2>
                     <p className="text-lg text-gray-700 mb-4">
                        The standard for web design. It divides the screen into 12 vertical columns, allowing for flexible layouts (halves, thirds, quarters).
                    </p>
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-4">2. Interactive Tool: Grid Generator</h2>
                     <p className="mb-6 text-gray-600">
                        Visualize CSS Grid layouts and play with gaps and columns.
                     </p>
                     <GridGenerator />
                </section>
            </div>
             
             <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/layout-grid/path` : "/login"} 
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
                            <strong className="block text-black">Grid System</strong> 
                            <span className="text-gray-500">Structural framework of intersecting vertical/horizontal lines.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">White Space</strong> 
                            <span className="text-gray-500">The negative space between elements.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Padding</strong> 
                            <span className="text-gray-500">The space between an element's content and its border.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Margin</strong> 
                            <span className="text-gray-500">The space outside an element's border.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 border-2 border-black bg-accent-blue/10 border-accent-blue shadow-[4px_4px_0px_0px_#007bff]">
                    <h3 className="font-bold mb-2">CSS Snippet</h3>
                    <code className="text-xs font-mono block bg-white p-2 border border-gray-200">
                        display: grid;<br/>
                        grid-template-columns: repeat(12, 1fr);<br/>
                        gap: 16px;
                    </code>
                </div>
            </aside>
        </div>
    </div>
  );
}

