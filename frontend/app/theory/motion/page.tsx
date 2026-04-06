import { BezierPlayground } from "@/components/theory/BezierPlayground";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MotionPage() {
  return (
    <div className="container mx-auto px-4 pt-14 md:pt-16 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Motion & Animation</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Motion isn't just decoration. It provides feedback, guides focus, and breathes life into your interface.
            </p>
        </header>

         <div className="grid lg:grid-cols-[1fr_350px] gap-12">
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

             <aside className="space-y-6">
                 <div className="p-6 border-2 border-black rounded-xl bg-accent-pink shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-4">Duration Guidelines</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between border-b border-black/10 pb-2">
                           <span>Hover / Micro</span>
                           <strong>100ms - 200ms</strong>
                        </li>
                         <li className="flex justify-between border-b border-black/10 pb-2">
                           <span>Large Transition</span>
                           <strong>300ms - 500ms</strong>
                        </li>
                         <li className="flex justify-between">
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
