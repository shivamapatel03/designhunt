"use client";

import { ArrowLeft, Target, Zap, Lock, ArrowRight, CheckCircle, TrendingUp, BarChart3, Rocket } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function ProductStrategyPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Product Strategy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Think like a product owner. Align your design decisions with business goals and market needs.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">Strategic Frameworks</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 bg-white border border-gray-200 shadow-sm">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-3 text-xl">The Product Vision</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">The "True North." A long-term, inspirational goal that describes the impact your product will have on the world.</p>
                        </div>
                        <div className="p-8 bg-white border border-gray-200 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-3 text-xl">Value Proposition</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">The core benefit of your product. Why should a user choose you over every other option in the market?</p>
                        </div>
                        <div className="p-8 bg-white border border-gray-200 shadow-sm">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-3 text-xl">OKRs & KPIs</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">Objectives and Key Results. How you measure success and ensure the team is moving in the right direction.</p>
                        </div>
                         <div className="p-8 bg-white border border-gray-200 shadow-sm">
                            <div className="w-12 h-12 bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-3 text-xl">The MVP</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">Minimum Viable Product. The smallest version of a product that allows you to collect validated learning with minimal effort.</p>
                        </div>
                    </div>
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">Market Positioning</h2>
                     <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Where does your product sit in the landscape of your competitors? Understanding your unique angle is key to success.
                     </p>
                     <div className="p-10 bg-black text-white rounded-[40px] relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-2xl font-bold mb-4">Product-Market Fit</h4>
                            <p className="text-lg opacity-80 leading-relaxed max-w-xl">
                                PMF is when you are in a good market with a product that can satisfy that market. When you have it, growth feels effortless. When you don't, everything is a struggle.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] group-hover:bg-indigo-500/40 transition-colors"></div>
                     </div>
                </section>
            </div>

             <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/strategy/path` : "/login"} 
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
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Business Terms</h3>
                    <ul className="space-y-3">
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">B2B / B2C</strong> 
                            <span className="text-gray-500">Business-to-Business vs. Business-to-Consumer.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">CAC</strong> 
                            <span className="text-gray-500">Customer Acquisition Cost. How much it costs to get a user.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">LTV</strong> 
                            <span className="text-gray-500">Lifetime Value. How much revenue a user generates over time.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Churn</strong> 
                            <span className="text-gray-500">The rate at which users stop using your product.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 border-2 border-black bg-[#808000] text-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">Strategy Quote</h3>
                    <p className="text-lg font-black leading-tight italic">
                        "Strategy is about making choices, trade-offs; it's about deliberately choosing to be different."
                    </p>
                    <p className="text-xs mt-4 opacity-80">— Michael Porter</p>
                </div>
            </aside>
         </div>
    </div>
  );
}
