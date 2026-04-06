"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white relative pt-20 pb-0 overflow-hidden border-t-8 border-accent-blue">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 relative z-10 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="text-xl font-black border-4 border-white px-3 py-1 bg-white text-black tracking-tighter">
                DH
              </span>
              <span className="text-2xl font-black uppercase italic tracking-tighter">Design-Hunt</span>
            </Link>
            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-xs">
              The structured learning platform for designers. Master your craft with theory, tools, and practice.
            </p>
          </div>
          
          <div>
            <h3 className="font-black uppercase tracking-widest text-gray-500 mb-6 text-sm">Explore</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/theory" className="hover:text-accent-blue transition-colors">Theory Library</Link></li>
              <li><Link href="/tools" className="hover:text-accent-pink transition-colors">Tool Mastery</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-black uppercase tracking-widest text-gray-500 mb-6 text-sm">Resources</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/theory/color" className="hover:text-[#FFD700] transition-colors">Color Wheel</Link></li>
              <li><Link href="/theory/typography" className="hover:text-accent-blue transition-colors">Type Scale</Link></li>
              <li><Link href="/library/illustrations" className="hover:text-accent-pink transition-colors">Illustrations</Link></li>
              <li><Link href="/theory/layout" className="hover:text-[#FFD700] transition-colors">Grid Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-black uppercase tracking-widest text-gray-500 mb-6 text-sm">Company</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/about" className="hover:text-white transition-colors">About Story</Link></li>
              <li><Link href="/critique" className="hover:text-[#FFD700] transition-colors">Execution Lab</Link></li>
              <li><Link href="/theory" className="hover:text-white transition-colors">Feedback</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t-2 border-white/10 text-center md:text-left text-xs font-bold text-gray-500 uppercase flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} DESIGN-HUNT. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
      
      {/* Decorative Bottom Edge Shapes */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none flex justify-between items-end overflow-hidden opacity-90">
         {/* Purple Shape */}
         <div className="w-32 h-20 bg-[#C084FC] rounded-t-full translate-y-8 -translate-x-4 mix-blend-screen"></div>
         {/* Pink Starburst Shape */}
         <div className="w-24 h-24 bg-[#F472B6] rotate-45 translate-y-12 mix-blend-screen transform origin-bottom border-4 border-black"></div>
         {/* Blue Abstract */}
         <div className="w-40 h-24 bg-[#3B82F6] rounded-tl-[100px] translate-y-10 mix-blend-screen"></div>
         {/* Green Circle */}
         <div className="w-28 h-28 bg-[#4ADE80] rounded-full translate-y-16 translate-x-8 mix-blend-screen"></div>
      </div>
    </footer>
  );
}
