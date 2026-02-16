"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Copy, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Color Data ---
type ColorFormat = "hex" | "rgb" | "tailwind";

interface ColorSwatch {
  name: string;
  hex: string;
  tailwind: string;
}

interface ColorSection {
  title: string;
  description: string;
  colors: ColorSwatch[];
}

const COLOR_SYSTEM: ColorSection[] = [
  {
    title: "Brand Colors",
    description: "Primary brand identity colors used for key actions and highlights.",
    colors: [
      { name: "Black", hex: "#000000", tailwind: "bg-black" },
      { name: "White", hex: "#FFFFFF", tailwind: "bg-white" },
      { name: "Accent Yellow", hex: "#FFD700", tailwind: "bg-accent-yellow" }, // Replace with actual hex from globals.css if different
      { name: "Accent Blue", hex: "#4169E1", tailwind: "bg-accent-blue" },
      { name: "Accent Pink", hex: "#FF69B4", tailwind: "bg-accent-pink" },
      { name: "Accent Purple", hex: "#8A2BE2", tailwind: "bg-accent-purple" },
    ]
  },
  {
    title: "Neutrals",
    description: "Grayscale palette for text, backgrounds, and borders.",
    colors: [
        { name: "Gray 50", hex: "#F9FAFB", tailwind: "bg-gray-50" },
        { name: "Gray 100", hex: "#F3F4F6", tailwind: "bg-gray-100" },
        { name: "Gray 200", hex: "#E5E7EB", tailwind: "bg-gray-200" },
        { name: "Gray 300", hex: "#D1D5DB", tailwind: "bg-gray-300" },
        { name: "Gray 400", hex: "#9CA3AF", tailwind: "bg-gray-400" },
        { name: "Gray 500", hex: "#6B7280", tailwind: "bg-gray-500" },
        { name: "Gray 600", hex: "#4B5563", tailwind: "bg-gray-600" },
        { name: "Gray 700", hex: "#374151", tailwind: "bg-gray-700" },
        { name: "Gray 800", hex: "#1F2937", tailwind: "bg-gray-800" },
        { name: "Gray 900", hex: "#111827", tailwind: "bg-gray-900" },
    ]
  },
  {
    title: "Feedback",
    description: "Semantic colors for success, error, and warning states.",
    colors: [
        { name: "Success", hex: "#22c55e", tailwind: "bg-green-500" },
        { name: "Warning", hex: "#eab308", tailwind: "bg-yellow-500" },
        { name: "Error", hex: "#ef4444", tailwind: "bg-red-500" },
        { name: "Info", hex: "#3b82f6", tailwind: "bg-blue-500" },
    ]
  }
];

export default function ColorsPage() {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (value: string, id: string) => {
    navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getColorValue = (color: ColorSwatch) => {
    if (format === "tailwind") return color.tailwind.replace("bg-", "");
    if (format === "rgb") {
        // Simple hex to rgb conversion for demo
        const r = parseInt(color.hex.slice(1, 3), 16);
        const g = parseInt(color.hex.slice(3, 5), 16);
        const b = parseInt(color.hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }
    return color.hex;
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
                 <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
                    <Link href="/library" className="hover:text-black">Library</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-black">Colors</span>
                </div>
                <h1 className="text-5xl font-black mb-4">Color System</h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                    The core palette used across Design-Hunt. Click any swatch to copy its value.
                </p>
            </div>

            {/* Format Switcher */}
            <div className="flex p-1 bg-gray-100 rounded-lg self-start">
                {(["hex", "rgb", "tailwind"] as ColorFormat[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-bold uppercase transition-all",
                            format === f 
                                ? "bg-white text-black shadow-sm" 
                                : "text-gray-500 hover:text-black"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>

        {/* Color Sections */}
        <div className="space-y-16">
            {COLOR_SYSTEM.map((section, idx) => (
                <section key={idx}>
                    <div className="mb-6">
                        <h2 className="text-2xl font-black mb-2">{section.title}</h2>
                        <p className="text-gray-500">{section.description}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {section.colors.map((color, i) => {
                            const valueToCopy = getColorValue(color);
                            const isCopied = copied === color.name;
                            const isWhite = color.hex.toLowerCase() === "#ffffff";

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleCopy(valueToCopy, color.name)}
                                    className="group text-left"
                                >
                                    <div className={cn(
                                        "h-32 rounded-2xl shadow-sm border-2 border-transparent transition-all group-hover:scale-105 group-hover:shadow-[4px_4px_0px_0px_#000]",
                                        color.tailwind,
                                        isWhite ? "border-gray-200" : "border-transparent"
                                    )}>
                                        <div className={cn(
                                            "w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                                            isWhite ? "text-black" : "text-white"
                                        )}>
                                            {isCopied ? <Check className="w-8 h-8" /> : <Copy className="w-8 h-8" />}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 px-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-gray-900">{color.name}</span>
                                            {isCopied && <span className="text-xs text-green-600 font-bold">Copied!</span>}
                                        </div>
                                        <div className="text-xs font-mono text-gray-500 uppercase">
                                            {valueToCopy}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>

      </div>
    </div>
  );
}
