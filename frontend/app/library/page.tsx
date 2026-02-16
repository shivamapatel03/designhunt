import Link from "next/link";
import { Library, Type, FileBox, Palette, PenTool, ArrowRight } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-black uppercase tracking-wider mb-4 border border-accent-purple/20">
                <Library className="w-4 h-4" /> Resource Hub
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-blue">Library</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
                Curated assets, documentation, and tools to speed up your workflow. Everything you need to build better, faster.
            </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Icons */}
            <Link href="/library/icons" className="group bg-white p-8 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-transform relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-accent-blue/5 rounded-full blur-3xl -mr-16 -mt-16 transition-colors group-hover:bg-accent-blue/10" />
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                        <PenTool className="w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-black mb-3">Icons</h2>
                    <p className="text-gray-600 mb-8 font-medium">Lucide, Radix, and classic sets with installation guides for React.</p>
                    <div className="flex items-center gap-2 font-bold text-sm">
                        View Resources <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>

            {/* Typography */}
            <Link href="/library/typography" className="group bg-white p-8 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-transform relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-accent-yellow/5 rounded-full blur-3xl -mr-16 -mt-16 transition-colors group-hover:bg-accent-yellow/10" />
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-accent-yellow text-black rounded-2xl flex items-center justify-center mb-6 shadow-md border-2 border-black">
                        <Type className="w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-black mb-3">Typography</h2>
                    <p className="text-gray-600 mb-8 font-medium">Font pairings, Google Fonts setup, and type scale calculators.</p>
                    <div className="flex items-center gap-2 font-bold text-sm">
                        View Guide <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>

            {/* Wireframes */}
            <Link href="/library/wireframes" className="group bg-white p-8 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-transform relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-accent-pink/5 rounded-full blur-3xl -mr-16 -mt-16 transition-colors group-hover:bg-accent-pink/10" />
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-accent-pink text-black rounded-2xl flex items-center justify-center mb-6 shadow-md border-2 border-black">
                        <FileBox className="w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-black mb-3">Wireframes</h2>
                    <p className="text-gray-600 mb-8 font-medium">Lo-fi kits, Figma templates, and prototyping tools.</p>
                    <div className="flex items-center gap-2 font-bold text-sm">
                        Download Kits <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>

            {/* Colors */}
            <Link href="/library/colors" className="group bg-white p-8 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-transform relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-gray-100 rounded-full blur-3xl -mr-16 -mt-16 transition-colors group-hover:bg-gray-200" />
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-gray-100 text-black border-2 border-black rounded-2xl flex items-center justify-center mb-6">
                        <Palette className="w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-black mb-3">Colors</h2>
                    <p className="text-gray-600 mb-8 font-medium">Interactive palettes, contrast checkers, and Tailwind mappings.</p>
                    <div className="flex items-center gap-2 font-bold text-sm">
                        View Palettes <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>

            {/* Illustrations (Coming Soon) */}
            <Link href="/library/illustrations" className="group bg-white p-8 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-transform relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="w-14 h-14 bg-gray-100 text-black border-2 border-black rounded-2xl flex items-center justify-center mb-6">
                        <PenTool className="w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-black mb-3">Illustrations</h2>
                    <p className="text-gray-600 mb-8 font-medium">Hand-picked vector resources for your next project.</p>
                    <div className="flex items-center gap-2 font-bold text-sm">
                        Browse Collection <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>

        </div>
      </div>
    </div>
  );
}
