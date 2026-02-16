import { ContrastChecker } from "@/components/theory/ContrastChecker";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ColorTheoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Color Theory</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Color evokes emotion, directs attention, and ensures accessibility. Master the art and science of color.
            </p>
        </header>

         <div className="grid lg:grid-cols-[1fr_350px] gap-12">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">1. Contrast & Accessibility</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        The most critical aspect of color in UI/UX is contrast. Text must be legible against its background. 
                        Aim for a ratio of at least <strong className="bg-yellow-200 px-1">4.5:1</strong> for normal text.
                    </p>
                    <ContrastChecker />
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">2. Color Psychology</h2>
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

             <aside className="space-y-6">
                <div className="p-6 border-2 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-4">60-30-10 Rule</h3>
                    <p className="text-sm text-gray-600 mb-4">A timeless decoration rule to balance your color palette.</p>
                    
                    <div className="flex h-8 rounded-full overflow-hidden border border-black">
                        <div className="w-[60%] bg-gray-200 flex items-center justify-center text-[10px] font-bold">60% Primary</div>
                        <div className="w-[30%] bg-black text-white flex items-center justify-center text-[10px] font-bold">30% Sec.</div>
                        <div className="w-[10%] bg-accent-blue flex items-center justify-center text-[10px] font-bold">10%</div>
                    </div>
                </div>
            </aside>
         </div>
    </div>
  );
}
