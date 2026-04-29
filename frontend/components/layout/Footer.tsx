"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Instagram, 
  Linkedin,
  Loader2,
  CheckCircle2
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white text-black py-12 md:py-20 border-t border-gray-100 font-plus-jakarta">
      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Brand/Hero Section */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start lg:w-2/5">
            <div className="w-40 h-40 md:w-48 md:h-48 shrink-0">
               <img 
                 src="/onboardingavatars/navbar.png" 
                 alt="Designhunt Character" 
                 className="w-full h-full object-contain"
               />
            </div>
            <div className="flex flex-col gap-3 text-center md:text-left">
               <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight max-w-[200px] md:max-w-none mx-auto md:mx-0">
                  Keep learning, <br/> one principle at a time.
               </h3>
               <p className="text-gray-400 text-xs md:text-[13px] font-medium leading-relaxed max-w-[280px]">
                  Explore typography, layout, color, and design systems with playful lessons.
               </p>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 w-full">
            {/* Product/Theory Section */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[11px] font-black text-black uppercase tracking-widest">Theory</h4>
              <ul className="flex flex-col gap-3.5">
                <li><Link href="/theory/color" className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">Colour Theory</Link></li>
                <li><Link href="/theory/typography" className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">Typography</Link></li>
                <li><Link href="/theory/layout" className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">Layout & Grids</Link></li>
                <li><Link href="/theory/design-systems" className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">Design Systems</Link></li>
              </ul>
            </div>

            {/* Library Section */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[11px] font-black text-black uppercase tracking-widest">Library</h4>
              <ul className="flex flex-col gap-3.5">
                <li><Link href="/library/icons" className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">Icons</Link></li>
                <li><Link href="/library/colors" className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">Colors</Link></li>
                <li><Link href="/library/illustrations" className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">Illustrations</Link></li>
                <li><Link href="/library/ui-kits" className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">UI Kits</Link></li>
              </ul>
            </div>

            {/* Social & Legal (Stacked on far right) */}
            <div className="flex flex-col gap-8 col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-10 items-center md:items-start">
              <div className="flex items-center gap-4">
                 <Link href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100 group">
                    <Instagram className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                 </Link>
                 <Link href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100 group">
                    <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                 </Link>
              </div>
              
              <div className="flex flex-col gap-1.5 text-center md:text-left">
                 <p className="text-[10px] font-black text-gray-300">
                    © {new Date().getFullYear()} DESIGNHUNT.
                 </p>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">
                    All rights reserved.
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Footer Links */}
        <div className="mt-16 pt-8 border-t border-gray-50 flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4">
           <Link href="/privacy" className="text-[10px] font-black text-gray-300 hover:text-black transition-colors uppercase tracking-widest">Privacy Policy</Link>
           <Link href="/terms" className="text-[10px] font-black text-gray-300 hover:text-black transition-colors uppercase tracking-widest">Terms of Service</Link>
           <Link href="/cookies" className="text-[10px] font-black text-gray-300 hover:text-black transition-colors uppercase tracking-widest">Cookies Settings</Link>
        </div>
      </div>
    </footer>
  );
}
