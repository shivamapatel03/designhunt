import { TypeScaleCalculator } from "@/components/tools/TypeScaleCalculator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TypographyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>

        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Typography</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Typography is the voice of your design. It manages attention, establishes hierarchy, and creates rhythm.
            </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4">1. Hierarchy & Scale</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        A clear typographic hierarchy guides the user's eye across the page. The most important elements should be the most prominent.
                    </p>
                    <div className="bg-gray-50 border-l-4 border-black p-6 rounded-r-lg">
                        <h3 className="font-bold mb-2">Best Practice</h3>
                        <p className="text-sm text-gray-600">
                             Limit your type sizes to a pre-defined scale (like the one below). Random sizes create chaos; ratio-based sizes create harmony.
                        </p>
                    </div>
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-4">2. Interactive Tool: Type Scale</h2>
                     <p className="mb-6 text-gray-600">
                        Use this calculator to generate a harmonious type system for your next project.
                     </p>
                     <TypeScaleCalculator />
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">3. Line Height & Readability</h2>
                    <p className="text-lg text-gray-700">
                        For optimal readability, aim for a line-height (leading) of <strong>1.5</strong> for body text. Headings can be tighter (1.1 - 1.2).
                    </p>
                </section>
            </div>

            <aside className="space-y-6">
                <div className="p-6 border-2 border-black rounded-xl bg-accent-yellow shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-2">Key Terms</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li><strong>Kerning</strong>: Space between characters.</li>
                        <li><strong>Leading</strong>: Space between lines.</li>
                        <li><strong>Tracking</strong>: Space between words/groups.</li>
                        <li><strong>Serif vs Sans</strong>: Feet vs No Feet.</li>
                    </ul>
                </div>
            </aside>
        </div>
    </div>
  );
}
