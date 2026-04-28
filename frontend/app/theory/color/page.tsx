"use client";

import { ContrastChecker } from "@/components/theory/ContrastChecker";
import { ColorWheel } from "@/components/theory/ColorWheel";
import { VisualGlossary } from "@/components/theory/VisualGlossary";
import { ArrowLeft, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function ColorTheoryPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-xs sm:text-sm font-medium text-muted-foreground hover:text-black mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-balance">Color Theory</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Color evokes emotion, directs attention, and ensures accessibility. Master the art and science of color.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 md:gap-12 items-start">
            <div className="space-y-12 md:space-y-16">
                 <section>
                    <div className="text-2xl font-bold mb-6">1. Contrast & Accessibility</div>
                    <div className="text-lg text-gray-700 mb-6 font-medium">
                        The most critical aspect of color in UI/UX is <VisualGlossary term="Contrast" />. Text must be legible against its background. 
                        Aim for a ratio of at least <strong className="bg-yellow-200 px-1">4.5:1</strong> for normal text.
                    </div>
                    <ContrastChecker />
                </section>


                <section>
                    <h2 className="text-2xl font-bold mb-6">2. Color Harmonies</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Colors don't exist in isolation. Use the color wheel to find harmonious combinations based on geometric relationships.
                    </p>
                    <ColorWheel />
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-6">3. Color Psychology</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                            <div className="w-8 h-8 bg-red-500 rounded-full mb-3"></div>
                            <h3 className="font-bold mb-2">Red</h3>
                            <p className="text-sm text-gray-600">Passion, Danger, Urgency. Good for errors or CTA buttons.</p>
                        </div>
                        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="w-8 h-8 bg-blue-500 rounded-full mb-3"></div>
                            <h3 className="font-bold mb-2">Blue</h3>
                            <p className="text-sm text-gray-600">Trust, Calm, Stability. Standard for tech and finance.</p>
                        </div>
                         <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <div className="w-8 h-8 bg-yellow-400 rounded-full mb-3"></div>
                            <h3 className="font-bold mb-2">Yellow</h3>
                            <p className="text-sm text-gray-600">Happiness, Warning, Attention. Use for highlights.</p>
                        </div>
                         <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                            <div className="w-8 h-8 bg-green-500 rounded-full mb-3"></div>
                            <h3 className="font-bold mb-2">Green</h3>
                            <p className="text-sm text-gray-600">Success, Nature, Growth. Perfect for confirmation messages.</p>
                        </div>
                    </div>
                </section>
            </div>

             <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/colour-theory/path` : "/login"} 
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
                            <strong className="block text-black">Hue</strong> 
                            <span className="text-gray-500">The actual color or pigment (e.g., Red, Blue).</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Saturation</strong> 
                            <span className="text-gray-500">The intensity or purity of a color.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Contrast</strong> 
                            <span className="text-gray-500">The difference in brightness between elements.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Palette</strong> 
                            <span className="text-gray-500">The set of colors chosen for a design.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 border-2 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-4">60-30-10 Rule</h3>
                    <p className="text-sm text-gray-600 mb-4">A timeless decoration rule to balance your color palette.</p>
                    
                    <div className="flex h-8 rounded-full overflow-hidden border border-black">
                        <div className="w-[60%] bg-gray-200 flex items-center justify-center text-[10px] font-bold">60% Primary</div>
                        <div className="w-[30%] bg-black text-white flex items-center justify-center text-[10px] font-bold">30% Sec.</div>
                        <div className="w-[10%] bg-[#6366f1] flex items-center justify-center text-[10px] font-bold text-white">10%</div>
                    </div>
                </div>
            </aside>
         </div>
    </div>
  );
}

