import { GridGenerator } from "@/components/tools/GridGenerator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LayoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>

        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Layout & Grids</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Invisible lines that hold your design together. Grids establish structure, alignment, and consistency.
            </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4">1. The 12-Column Grid</h2>
                     <p className="text-lg text-gray-700 mb-4">
                        The standard for web design. It divides the screen into 12 vertical columns, allowing for flexible layouts (halves, thirds, quarters).
                    </p>
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-4">2. Interactive Tool: Grid Generator</h2>
                     <p className="mb-6 text-gray-600">
                        Visualize CSS Grid layouts and play with gaps and columns.
                     </p>
                     <GridGenerator />
                </section>
            </div>
             
             <aside className="space-y-6">
                <div className="p-6 border-2 border-black rounded-xl bg-accent-blue/10 border-accent-blue shadow-[4px_4px_0px_0px_#007bff]">
                    <h3 className="font-bold mb-2">CSS Snippet</h3>
                    <code className="text-xs font-mono block bg-white p-2 rounded border border-gray-200">
                        display: grid;<br/>
                        grid-template-columns: repeat(12, 1fr);<br/>
                        gap: 16px;
                    </code>
                </div>
            </aside>
        </div>
    </div>
  );
}
