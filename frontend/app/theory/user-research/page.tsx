"use client";

import { PersonaGenerator } from "@/components/theory/PersonaGenerator";
import { ArrowLeft, Search, Heart, Users, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function UserResearchPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">User Research</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                You are not your user. Research bridges the gap between assumptions and reality.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">Persona Builder</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Personas are fictional characters that represent the different user types within your targeted demographic.
                    </p>
                    <PersonaGenerator />
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">Methods</h2>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border border-gray-200">
                            <h3 className="font-bold mb-2">Qualitative</h3>
                            <p className="text-sm text-gray-600 mb-4">"Why" actions happen. Interviews, observations.</p>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Small Sample Size</span>
                        </div>
                         <div className="p-6 bg-white border border-gray-200">
                            <h3 className="font-bold mb-2">Quantitative</h3>
                            <p className="text-sm text-gray-600 mb-4">"What" actions happen. Surveys, analytics.</p>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Large Sample Size</span>
                        </div>
                     </div>
                </section>
            </div>

             <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/user-research/path` : "/login"} 
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
                            <strong className="block text-black">Persona</strong> 
                            <span className="text-gray-500">A fictional representation of a target user group.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Qualitative</strong> 
                            <span className="text-gray-500">Research focused on the "Why" (interviews).</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Quantitative</strong> 
                            <span className="text-gray-500">Research focused on the "What" (analytics).</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Usability</strong> 
                            <span className="text-gray-500">Measure of how easily a user interacts with a product.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 border-2 border-black bg-accent-blue text-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Heart className="w-5 h-5 flex-shrink-0" /> Empathy Map</h3>
                    <p className="text-sm opacity-90 mb-4 font-medium">
                        Always ask from the user's perspective:
                    </p>
                    <ul className="space-y-2 text-sm font-bold">
                        <li className="flex items-center gap-2"><span>•</span> What do they SEE?</li>
                        <li className="flex items-center gap-2"><span>•</span> What do they HEAR?</li>
                        <li className="flex items-center gap-2"><span>•</span> What do they DO?</li>
                        <li className="flex items-center gap-2"><span>•</span> What do they FEEL?</li>
                    </ul>
                </div>
            </aside>
         </div>
    </div>
  );
}

