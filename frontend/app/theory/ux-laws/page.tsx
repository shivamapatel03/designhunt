"use client";

import { ArrowLeft, Target, MousePointer, Brain, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function UXLawsPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Laws of UX</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Psychological principles that govern how users interact with interfaces. Designing against these laws creates friction.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="space-y-12">
                 {/* Hick's Law */}
                <section className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_#000]">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-accent-yellow text-black border-2 border-black">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Hick's Law</h2>
                            <p className="text-gray-600 text-lg">
                                The time it takes to make a decision increases with the number and complexity of choices.
                            </p>
                        </div>
                    </div>
                    
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-6 border border-gray-200">
                            <h4 className="font-bold mb-4 text-red-600">Bad (Too Many Choices)</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({length: 12}).map((_, i) => (
                                    <button key={i} className="text-xs p-2 bg-white border border-gray-300">Option {i+1}</button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 border border-gray-200">
                            <h4 className="font-bold mb-4 text-green-600">Good (Categorized)</h4>
                            <div className="space-y-4">
                                <div>
                                    <h5 className="text-xs font-bold mb-1">Category A</h5>
                                    <div className="flex gap-2">
                                         <button className="text-xs p-2 bg-white border border-gray-300 flex-1">Opt 1</button>
                                         <button className="text-xs p-2 bg-white border border-gray-300 flex-1">Opt 2</button>
                                    </div>
                                </div>
                                 <div>
                                    <h5 className="text-xs font-bold mb-1">Category B</h5>
                                    <div className="flex gap-2">
                                         <button className="text-xs p-2 bg-white border border-gray-300 flex-1">Opt 3</button>
                                         <button className="text-xs p-2 bg-white border border-gray-300 flex-1">Opt 4</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/ux-laws/path` : "/login"} 
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
                            <strong className="block text-black">Jakob's Law</strong> 
                            <span className="text-gray-500">Users spend most of their time on other sites, so they prefer yours to work the same way.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Hick's Law</strong> 
                            <span className="text-gray-500">The time it takes to make a decision increases with the number of choices.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Fitts's Law</strong> 
                            <span className="text-gray-500">The time to acquire a target is a function of the distance to and size of the target.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Miller's Law</strong> 
                            <span className="text-gray-500">The average person can only keep 7 (plus or minus 2) items in their working memory.</span>
                        </li>
                    </ul>
                </div>
            </aside>
         </div>
    </div>
  );
}

