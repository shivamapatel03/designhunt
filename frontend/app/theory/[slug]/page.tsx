"use client";

import { useParams } from "next/navigation";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { ArrowLeft, Check, X, BookOpen, Share2 } from "lucide-react";
import Link from "next/link";

export default function TheoryTopicPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // In a real app, fetch data based on slug. 
  // For prototype, we'll hardcode "Color Theory" content if matched, else generic.
  const isColorTheory = slug === 'color-theory';
  
  const title = isColorTheory ? "Color Theory & Contrast" : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="container mx-auto px-4 pt-32 pb-12">
      <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
      </Link>

      <div className="grid lg:grid-cols-[1fr_300px] gap-12">
        {/* Main Content */}
        <article className="space-y-12">
           <header className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-accent-blue uppercase tracking-wider">
                <BookOpen className="w-4 h-4" /> Foundation
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{title}</h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                {isColorTheory 
                  ? "Understanding how colors interact, contrast ratios, and psychological effects is crucial for accessible and impactful UI design."
                  : "Mastering this fundamental design principle is key to creating intuitive user interfaces."}
              </p>
           </header>

           <hr className="border-gray-200" />

           <section>
              <h2 className="text-2xl font-bold mb-6">Visual Demonstration</h2>
              <p className="mb-6 text-gray-600">Drag the slider to see the difference between poor and effective usage.</p>
              
              <BeforeAfterSlider 
                beforeLabel="Poor Contrast"
                afterLabel="Accessible"
                before={
                  <div className="w-full h-full flex items-center justify-center bg-[#e0e0e0] p-8 text-center">
                      <div className="max-w-md">
                        <h3 className="text-3xl font-bold text-[#a0a0a0] mb-4">Hello World</h3>
                        <p className="text-[#909090]">This text is hard to read because the contrast ratio is too low (approx 1.5:1). It strains the eyes and fails accessibility standards.</p>
                        <button className="mt-6 px-6 py-2 bg-[#d0d0d0] text-[#a0a0a0] rounded">Click Me</button>
                      </div>
                  </div>
                }
                after={
                   <div className="w-full h-full flex items-center justify-center bg-white p-8 text-center">
                      <div className="max-w-md">
                        <h3 className="text-3xl font-bold text-black mb-4">Hello World</h3>
                        <p className="text-gray-800">High contrast text (approx 18:1) is legible, professional, and accessible to everyone. Always aim for WCAG AA or AAA compliance.</p>
                        <button className="mt-6 px-6 py-2 bg-black text-white font-bold rounded hover:bg-gray-800">Click Me</button>
                      </div>
                  </div>
                }
              />
           </section>

           <section className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 border-2 border-red-100 p-6 rounded-xl">
                 <h3 className="flex items-center text-red-600 font-bold text-lg mb-4">
                    <X className="w-5 h-5 mr-2" /> Common Mistakes
                 </h3>
                 <ul className="space-y-3">
                    <li className="flex gap-2 text-sm text-gray-700">
                       <span>•</span> Relying on color alone to convey meaning (e.g., error states).
                    </li>
                    <li className="flex gap-2 text-sm text-gray-700">
                       <span>•</span> Using pure black (#000000) on white for long text blocks (causes eye strain).
                    </li>
                     <li className="flex gap-2 text-sm text-gray-700">
                       <span>•</span> Ignoring color blindness simulation during design.
                    </li>
                 </ul>
              </div>

               <div className="bg-green-50 border-2 border-green-100 p-6 rounded-xl">
                 <h3 className="flex items-center text-green-600 font-bold text-lg mb-4">
                    <Check className="w-5 h-5 mr-2" /> Best Practices
                 </h3>
                 <ul className="space-y-3">
                    <li className="flex gap-2 text-sm text-gray-700">
                       <span>•</span> Use the 60-30-10 rule for color balance.
                    </li>
                    <li className="flex gap-2 text-sm text-gray-700">
                       <span>•</span> Check contrast ratios using plugins like Stark.
                    </li>
                     <li className="flex gap-2 text-sm text-gray-700">
                       <span>•</span> Use established color palettes for consistency.
                    </li>
                 </ul>
              </div>
           </section>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
           <div className="p-6 border-2 border-black rounded-xl bg-accent-yellow shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-bold mb-2">Practice Challenge</h3>
              <p className="text-sm mb-4">Fix the contrast issues in this landing page mockup.</p>
              <button className="w-full py-2 bg-black text-white font-bold text-sm rounded hover:bg-gray-800">Start Activity</button>
           </div>

           <div className="p-6 border border-gray-200 rounded-xl">
              <h3 className="font-bold mb-4">Related Topics</h3>
              <ul className="space-y-2 text-sm">
                 <li><Link href="/theory/visual-hierarchy" className="hover:underline hover:text-accent-blue">Visual Hierarchy</Link></li>
                 <li><Link href="/theory/typography" className="hover:underline hover:text-accent-blue">Typography Scale</Link></li>
                 <li><Link href="/theory/accessibility" className="hover:underline hover:text-accent-blue">Accessibility 101</Link></li>
              </ul>
           </div>
        </aside>
      </div>
    </div>
  );
}
