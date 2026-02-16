import { HeatmapSimulator } from "@/components/theory/HeatmapSimulator";
import { ArrowLeft, LayoutTemplate, ScanEye } from "lucide-react";
import Link from "next/link";

export default function VisualHierarchyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Visual Hierarchy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Guide the user's eye. Hierarchy controls the order in which the human eye perceives what it sees.
            </p>
        </header>

         <div className="grid lg:grid-cols-[1fr_300px] gap-12">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">Scanning Patterns</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Users don't read; they scan. Understanding these patterns helps you place content where it will actually be seen.
                    </p>
                    <HeatmapSimulator />
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">Gestalt Principles</h2>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h3 className="font-bold mb-4">Proximity</h3>
                            <div className="flex gap-8 mb-4">
                                <div className="space-y-1">
                                    <div className="w-8 h-8 bg-black rounded"></div>
                                    <div className="w-8 h-8 bg-black rounded"></div>
                                </div>
                                <div className="space-y-1">
                                    <div className="w-8 h-8 bg-black rounded"></div>
                                    <div className="w-8 h-8 bg-black rounded"></div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Objects close to each other are perceived as a group.</p>
                        </div>
                        
                         <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h3 className="font-bold mb-4">Similarity</h3>
                             <div className="flex gap-2 mb-4">
                                <div className="w-8 h-8 bg-black rounded-full"></div>
                                <div className="w-8 h-8 bg-black rounded-full"></div>
                                <div className="w-8 h-8 bg-accent-blue rounded-full"></div>
                            </div>
                            <p className="text-sm text-gray-600">Objects that look alike are perceived as related (or the anomaly stands out).</p>
                        </div>
                     </div>
                </section>
            </div>

             <aside className="space-y-6">
                <div className="p-6 border-2 border-black rounded-xl bg-accent-yellow">
                    <h3 className="font-bold mb-4">The Squint Test</h3>
                    <p className="text-sm text-gray-800 mb-4">
                        Step back and squint at your screen. What stands out first? If it's not the primary action/message, your hierarchy is broken.
                    </p>
                </div>
                 <div className="p-6 border border-gray-200 rounded-xl">
                    <h3 className="font-bold mb-4">Tools</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Size (Larger = More important)</li>
                        <li>• Color (Bold = Attention)</li>
                        <li>• White Space (Isolation = Focus)</li>
                    </ul>
                </div>
            </aside>
         </div>
    </div>
  );
}
