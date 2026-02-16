import { ArrowLeft, Target, MousePointer, Brain } from "lucide-react";
import Link from "next/link";

export default function UXLawsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Laws of UX</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Psychological principles that govern how users interact with interfaces. Designing against these laws creates friction.
            </p>
        </header>

         <div className="grid gap-12">
            
            {/* Fitts's Law */}
            <section className="bg-white border-2 border-black rounded-xl p-8 shadow-[4px_4px_0px_0px_#000]">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-accent-blue text-white rounded-lg border-2 border-black">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Fitts's Law</h2>
                        <p className="text-gray-600 text-lg">
                            The time to acquire a target is a function of the distance to and size of the target.
                        </p>
                    </div>
                </div>
                <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center justify-center gap-8 h-64 border-2 border-dashed border-gray-300">
                    <div className="flex items-center gap-12 w-full justify-center">
                         <button className="w-8 h-8 rounded-full bg-red-400 border border-black hover:scale-110 transition-transform"></button>
                         <span className="text-sm text-gray-400">Hard to hit (Small + Far)</span>
                    </div>
                     <div className="flex items-center gap-12 w-full justify-center">
                         <button className="w-32 py-4 rounded-xl bg-green-500 border-2 border-black text-white font-bold hover:scale-105 transition-transform">Easy Target</button>
                         <span className="text-sm text-gray-400">Easy to hit (Large + Close)</span>
                    </div>
                </div>
            </section>

             {/* Hick's Law */}
            <section className="bg-white border-2 border-black rounded-xl p-8 shadow-[4px_4px_0px_0px_#000]">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-accent-yellow text-black rounded-lg border-2 border-black">
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
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h4 className="font-bold mb-4 text-red-600">Bad (Too Many Choices)</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({length: 12}).map((_, i) => (
                                <button key={i} className="text-xs p-2 bg-white border border-gray-300 rounded">Option {i+1}</button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h4 className="font-bold mb-4 text-green-600">Good (Categorized)</h4>
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-xs font-bold mb-1">Category A</h5>
                                <div className="flex gap-2">
                                     <button className="text-xs p-2 bg-white border border-gray-300 rounded flex-1">Opt 1</button>
                                     <button className="text-xs p-2 bg-white border border-gray-300 rounded flex-1">Opt 2</button>
                                </div>
                            </div>
                             <div>
                                <h5 className="text-xs font-bold mb-1">Category B</h5>
                                <div className="flex gap-2">
                                     <button className="text-xs p-2 bg-white border border-gray-300 rounded flex-1">Opt 3</button>
                                     <button className="text-xs p-2 bg-white border border-gray-300 rounded flex-1">Opt 4</button>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </section>

         </div>
    </div>
  );
}
