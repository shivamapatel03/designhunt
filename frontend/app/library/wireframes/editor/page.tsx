"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WireframeEditorPage() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-50 overflow-hidden">
      
      {/* Navigation Overlay */}
      <div className="absolute top-6 left-6 z-[9999]">
        <Link 
            href="/library/wireframes" 
            className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-y-[4px] active:translate-x-[4px]"
        >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
        </Link>
      </div>

      {/* Editor - Full Screen */}
      <div className="w-full h-full tldraw-editor">
         <Tldraw components={{ 
            MainMenu: () => null,
            PageMenu: () => null
         }} />
      </div>

    </div>
  );
}
