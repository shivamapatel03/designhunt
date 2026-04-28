"use client";

import { ArrowLeft, Globe, Zap, Lock, ArrowRight, CheckCircle, Network, Layers, Layout } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function InformationArchitecturePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 pt-16 sm:pt-20 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Information Architecture</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Design the skeleton of your product. IA is about organizing and labeling content so users can find what they need reliably.
            </p>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">Core Components</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <Network className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold mb-2">Organization Schemes</h3>
                            <p className="text-sm text-gray-600">How you categorize information (Alphabetical, Chronological, Topic-based).</p>
                        </div>
                        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                                <Layers className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold mb-2">Labeling Systems</h3>
                            <p className="text-sm text-gray-600">How you represent information (terminology that users understand).</p>
                        </div>
                        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                                <Layout className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold mb-2">Navigation Systems</h3>
                            <p className="text-sm text-gray-600">How users move through information (Menus, Breadcrumbs, Search).</p>
                        </div>
                         <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold mb-2">Search Systems</h3>
                            <p className="text-sm text-gray-600">How users look for information (Keywords, Filters, Facets).</p>
                        </div>
                    </div>
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">Hierarchy vs Flat Structure</h2>
                     <p className="text-lg text-gray-700 mb-8">
                        The way you structure your content affects how easily users can browse and find what they need.
                     </p>
                     <div className="p-8 bg-gray-50 border border-gray-200 rounded-3xl">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Hierarchical (Tree)
                                </h4>
                                <p className="text-sm text-gray-600">Good for complex sites with many categories. Users drill down from broad to specific.</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Flat (Linear)
                                </h4>
                                <p className="text-sm text-gray-600">Best for storytelling, onboarding, or simple apps with few features.</p>
                            </div>
                        </div>
                     </div>
                </section>
            </div>

             <aside className="space-y-6 lg:sticky lg:top-24">
                <Link 
                    href={user ? `/theory/learning/information-ia/path` : "/login"} 
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
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">IA Principles</h3>
                    <ul className="space-y-3">
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Objects</strong> 
                            <span className="text-gray-500">Treat content as living things with behaviors and lifecycles.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Choices</strong> 
                            <span className="text-gray-500">Offer a focused set of choices (Hick's Law).</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Disclosure</strong> 
                            <span className="text-gray-500">Show only what is necessary at any given moment.</span>
                        </li>
                        <li className="text-[13px] leading-tight">
                            <strong className="block text-black">Exemplars</strong> 
                            <span className="text-gray-500">Show examples of content when describing categories.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 border-2 border-black rounded-xl bg-[#2B7FFF] text-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">Quick Audit</h3>
                    <p className="text-xs opacity-90 mb-4">
                        Can your user answer these 3 questions on any page?
                    </p>
                    <ul className="space-y-3 text-[13px] font-bold">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>Where am I?</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>What is here?</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>Where can I go from here?</span>
                        </li>
                    </ul>
                </div>
            </aside>
         </div>
    </div>
  );
}
