"use client";

import { AtomicAssembler } from "@/components/theory/AtomicAssembler";
import { ArrowLeft, Layers, Component, Box, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function DesignSystemsPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Design Systems</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Stop designing pages. Start designing systems. Learn how to build scalable UIs using the Atomic Design methodology.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">Interactive Atomic Assembler</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        See how changing a single "Atom" (like a primary color or border radius) propagates through Molecules and Organisms.
                    </p>
                    <AtomicAssembler />
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">The Methodology</h2>
                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <Box className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2">Atoms</h3>
                            <p className="text-sm text-gray-600">The smallest building blocks. Buttons, inputs, labels, icons, colors.</p>
                        </div>
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <Component className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2">Molecules</h3>
                            <p className="text-sm text-gray-600">Groups of atoms working together. A Search Bar (Input + Button).</p>
                        </div>
                         <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2">Organisms</h3>
                            <p className="text-sm text-gray-600">Complex sections of an interface. A Header, Footer, or Product Card.</p>
                        </div>
                     </div>
                </section>
            </div>

             <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/design-systems/path` : "/login"} 
                    className={cn(
                        "group w-full relative inline-flex items-center justify-between gap-3 px-5 py-4 md:px-6 md:py-5 rounded-2xl font-bold transition-all hover:translate-y-[-2px] active:scale-95 border border-black text-xs md:text-sm shadow-[4px_4px_0_0_#000]",
                        user 
                            ? "bg-black text-white hover:shadow-[6px_6px_0_0_#000]" 
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

                <div className="p-6 border-2 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Key Terms</h3>
                    <ul className="space-y-3">
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Atomic Design</strong> 
                            <span className="text-gray-500">Methodology involving Atoms, Molecules, Organisms, Templates, and Pages.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Design Tokens</strong> 
                            <span className="text-gray-500">The visual atoms of the design system (colors, spacing, typography).</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Component</strong> 
                            <span className="text-gray-500">A reusable UI element (like a button) with its own logic and style.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Pattern</strong> 
                            <span className="text-gray-500">A recurring solution to a common design problem.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 border-2 border-black rounded-xl bg-gray-50 shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-4">Why use a system?</h3>
                    <ul className="space-y-4">
                         <li>
                            <h4 className="font-bold text-sm">Efficiency</h4>
                            <p className="text-xs text-gray-600">Don't reinvent the wheel. Reuse components.</p>
                        </li>
                        <li>
                            <h4 className="font-bold text-sm">Consistency</h4>
                            <p className="text-xs text-gray-600">Every button looks and behaves the same.</p>
                        </li>
                        <li>
                            <h4 className="font-bold text-sm">Scalability</h4>
                            <p className="text-xs text-gray-600">Update a color in one place, update it everywhere.</p>
                        </li>
                    </ul>
                </div>
            </aside>
         </div>
    </div>
  );
}

