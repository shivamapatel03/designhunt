"use client";

import { BezierPlayground } from "@/components/theory/BezierPlayground";
import { ArrowLeft, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function MotionPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Motion & Animation</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Motion isn't just decoration. It provides feedback, guides focus, and breathes life into your interface.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">1. Easing Functions (Cubic Bezier)</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Objects in the real world don't start and stop instantly. They speed up (ease-in) and slow down (ease-out). 
                        Use the playground to create custom timing functions.
                    </p>
                    <BezierPlayground />
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">2. Core Principles</h2>
                     <div className="grid sm:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border-2 border-black rounded-xl">
                            <h3 className="font-bold mb-2">Squash & Stretch</h3>
                            <p className="text-sm text-gray-600">Gives sense of weight and flexibility. Button presses often scale down slightly (95%).</p>
                        </div>
                        <div className="p-6 bg-white border-2 border-black rounded-xl">
                            <h3 className="font-bold mb-2">Anticipation</h3>
                            <p className="text-sm text-gray-600">Prepares the user for an action. A hover effect anticipates a click.</p>
                        </div>
                     </div>
                </section>
            </div>

             <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/motion-animation/path` : "/login"} 
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
                            <strong className="block text-black">Easing</strong> 
                            <span className="text-gray-500">The acceleration or deceleration of an animation.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Duration</strong> 
                            <span className="text-gray-500">The amount of time an animation takes to complete.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Staggering</strong> 
                            <span className="text-gray-500">Applying incremental delays to a group of elements.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Choreography</strong> 
                            <span className="text-gray-500">The coordinated motion of multiple elements.</span>
                        </li>
                    </ul>
                </div>

                 <div className="p-6 border-2 border-black rounded-xl bg-accent-pink shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-4">Duration Guidelines</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between border-b border-black/10 pb-2 font-medium">
                           <span>Hover / Micro</span>
                           <strong>100ms - 200ms</strong>
                        </li>
                         <li className="flex justify-between border-b border-black/10 pb-2 font-medium">
                           <span>Large Transition</span>
                           <strong>300ms - 500ms</strong>
                        </li>
                         <li className="flex justify-between font-medium">
                           <span>Enter / Exit</span>
                           <strong>200ms - 300ms</strong>
                        </li>
                    </ul>
                </div>
            </aside>
         </div>
    </div>
  );
}

