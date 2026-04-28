"use client";

import { ArrowLeft, UserGroup, Zap, Lock, ArrowRight, CheckCircle, Smartphone, MousePointer2, Heart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function UXDesignPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">UX Design Principles</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Design for humans. UX is the intersection of user needs, business goals, and technical constraints.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">The UX Pillars</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-black transition-colors group">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <MousePointer2 className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-lg">Usability</h3>
                            <p className="text-sm text-gray-600">Can the user achieve their goal easily? Focus on efficiency, learnability, and error prevention.</p>
                        </div>
                        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-black transition-colors group">
                            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-lg">Desirability</h3>
                            <p className="text-sm text-gray-600">Does the product evoke positive emotions? Aesthetics, branding, and micro-interactions.</p>
                        </div>
                        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-black transition-colors group">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-lg">Usefulness</h3>
                            <p className="text-sm text-gray-600">Does the product solve a real problem for the user? Value proposition and relevance.</p>
                        </div>
                        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-black transition-colors group">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2 text-lg">Adoptability</h3>
                            <p className="text-sm text-gray-600">How easy is it for a user to start using the product? Onboarding and initial trust.</p>
                        </div>
                    </div>
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">Affordances & Signifiers</h2>
                     <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Don't make users think. Your interface should communicate its function through visual cues.
                     </p>
                     <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-8 bg-black text-white rounded-3xl">
                            <h4 className="text-xl font-bold mb-4">Affordance</h4>
                            <p className="text-sm opacity-80 leading-relaxed">The perceived properties of an object that determine how it could be used. A button "affords" clicking because it looks raised.</p>
                        </div>
                        <div className="p-8 bg-blue-600 text-white rounded-3xl">
                            <h4 className="text-xl font-bold mb-4">Signifier</h4>
                            <p className="text-sm opacity-80 leading-relaxed">The actual mark or sound that tells you where and how the action should happen. An "Add to Cart" text on a button is a signifier.</p>
                        </div>
                     </div>
                </section>
            </div>

             <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/ui-ux-design/path` : "/login"} 
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
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Key Heuristics</h3>
                    <ul className="space-y-3">
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">System Status</strong> 
                            <span className="text-gray-500">Always keep users informed about what is going on.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Real World Match</strong> 
                            <span className="text-gray-500">Use words and concepts familiar to the user.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">User Control</strong> 
                            <span className="text-gray-500">Provide an "emergency exit" to undo actions.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Consistency</strong> 
                            <span className="text-gray-500">Follow platform conventions and standards.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 border-2 border-black rounded-xl bg-[#FF6B4A] text-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">The Golden Rule</h3>
                    <p className="text-lg font-black leading-tight">
                        "If the user can't find it, it doesn't exist."
                    </p>
                    <p className="text-xs mt-4 opacity-80">— H.W. Krueger</p>
                </div>
            </aside>
         </div>
    </div>
  );
}
