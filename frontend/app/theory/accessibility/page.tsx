"use client";

import { ColorBlindnessSimulator } from "@/components/theory/ColorBlindnessSimulator";
import { ArrowLeft, CheckCircle, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function AccessibilityPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Accessibility (a11y)</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Design for everyone. Accessibility ensures people with disabilities can perceive, understand, navigate, and interact with your product.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">1. Designing for Color Blindness</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Approximately 1 in 12 men are color blind. Never rely on color alone to convey effective status states (like error or success).
                    </p>
                    <ColorBlindnessSimulator />
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">2. The WCAG Principles (POUR)</h2>
                     <div className="grid sm:grid-cols-2 gap-4">
                        <Card title="Perceivable" body="Information and UI components must be presentable to users in ways they can perceive (e.g. alt text, captions)." />
                        <Card title="Operable" body="UI components and navigation must be operable (e.g. keyboard accessible, no trapped focus)." />
                        <Card title="Understandable" body="Information and the operation of UI must be understandable (consistent navigation, readable text)." />
                        <Card title="Robust" body="Content must be robust enough to be interpreted reliably by a wide variety of user agents (clean HTML)." />
                     </div>
                </section>
            </div>

             <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/accessibility/path` : "/login"} 
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
                            <strong className="block text-black">WCAG</strong> 
                            <span className="text-gray-500">Web Content Accessibility Guidelines.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Alt Text</strong> 
                            <span className="text-gray-500">Text descriptions for non-text content.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Contrast Ratio</strong> 
                            <span className="text-gray-500">Legibility measurement between text and background.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">ARIA</strong> 
                            <span className="text-gray-500">Roles that make web content more accessible.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-4">Quick A11y Checklist</h3>
                    <ul className="space-y-3">
                        {["Alt text on images", "Headings in order (h1-h6)", "Contrast ratio > 4.5:1", "Large touch targets (44px+)", "Keyboard navigability"].map((item, i) => (
                           <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <span>{item}</span>
                           </li> 
                        ))}
                    </ul>
                </div>
            </aside>
         </div>
    </div>
  );
}

function Card({title, body}: {title: string, body: string}) {
    return (
        <div className="p-6 bg-gray-50 border border-gray-200">
             <h3 className="font-bold mb-2">{title}</h3>
             <p className="text-sm text-gray-600">{body}</p>
        </div>
    )
}

