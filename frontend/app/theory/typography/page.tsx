"use client";

import { TypeScaleCalculator } from "@/components/tools/TypeScaleCalculator";
import { ArrowLeft, Zap, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function TypographyPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">Typography</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Typography is the voice of your design. It manages attention, establishes hierarchy, and creates rhythm.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 md:gap-12 items-start">
            <div className="space-y-10 md:space-y-12 overflow-hidden">
                <section>
                    <h2 className="text-xl md:text-2xl font-black mb-4">1. Hierarchy & Scale</h2>
                    <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                        A clear typographic hierarchy guides the user's eye across the page. The most important elements should be the most prominent.
                    </p>
                    <div className="bg-gray-50 border-l-4 border-black p-5 md:p-6">
                        <h3 className="font-bold mb-2 text-sm uppercase tracking-wider">Best Practice</h3>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                             Limit your type sizes to a pre-defined scale (like the one below). Random sizes create chaos; ratio-based sizes create harmony.
                        </p>
                    </div>
                </section>

                <section>
                     <h2 className="text-xl md:text-2xl font-black mb-4">2. Interactive Tool: Type Scale</h2>
                     <p className="mb-6 text-sm md:text-base text-gray-600 leading-relaxed">
                        Use this calculator to generate a harmonious type system for your next project.
                     </p>
                     <div className="overflow-x-hidden">
                        <TypeScaleCalculator />
                     </div>
                </section>

                <section>
                    <h2 className="text-xl md:text-2xl font-black mb-4">3. Line Height & Readability</h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                        For optimal readability, aim for a line-height (leading) of <strong>1.5</strong> for body text. Headings can be tighter (1.1 - 1.2).
                    </p>
                </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/typography/path` : "/login"} 
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

                <div className="p-5 md:p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Key Terms</h3>
                    <ul className="space-y-3">
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Kerning</strong> 
                            <span className="text-gray-500">Space between characters.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Leading</strong> 
                            <span className="text-gray-500">Space between lines.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Tracking</strong> 
                            <span className="text-gray-500">Space between words/groups.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Serif vs Sans</strong> 
                            <span className="text-gray-500">Feet vs No Feet.</span>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    </div>
  );
}
