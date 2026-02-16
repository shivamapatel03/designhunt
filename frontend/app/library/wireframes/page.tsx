import Link from "next/link";
import { ChevronRight, Figma, PenTool } from "lucide-react";

export default function WireframesPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
            <Link href="/library" className="hover:text-black">Library</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">Wireframes</span>
        </div>

        <h1 className="text-5xl font-black mb-6">Wireframe Kits</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Jumpstart your design process with these high-quality, free wireframing kits and tools.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
            
            {/* Untitled UI (Free) */}
            <a href="https://www.untitledui.com/free" target="_blank" className="group block bg-gray-50 border-2 border-black rounded-3xl p-8 hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 bg-white border-2 border-black rounded-2xl flex items-center justify-center">
                        <Figma className="w-8 h-8 text-[#F24E1E]" />
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full">Free Version</span>
                </div>
                <h3 className="text-2xl font-black mb-2">Untitled UI (Free)</h3>
                <p className="text-gray-600 mb-6 font-medium">
                    The ultimate UI kit and design system for Figma. The free version includes thousands of components and styles.
                </p>
                <div className="font-bold underline text-sm">Open in Figma</div>
            </a>

            {/* Excalidraw */}
            <a href="https://excalidraw.com/" target="_blank" className="group block bg-[#e0e0ff] border-2 border-black rounded-3xl p-8 hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-8">
                     <div className="w-16 h-16 bg-white border-2 border-black rounded-2xl flex items-center justify-center">
                        <PenTool className="w-8 h-8 text-black" />
                    </div>
                    <span className="px-3 py-1 bg-white text-black text-xs font-bold uppercase rounded-full">Web Tool</span>
                </div>
                <h3 className="text-2xl font-black mb-2">Excalidraw</h3>
                <p className="text-gray-700 mb-6 font-medium">
                    Virtual whiteboard for sketching hand-drawn like diagrams. Perfect for quick ideation and logic flows.
                </p>
                <div className="font-bold underline text-sm">Start Sketching</div>
            </a>

        </div>

      </div>
    </div>
  );
}
