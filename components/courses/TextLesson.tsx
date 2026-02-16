"use client";

import { cn } from "@/lib/utils";
import { Copy, Share2, Twitter, Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ConceptTooltip } from "./ConceptTooltip";
import { type Concept } from "@/app/actions/concepts";
import { ButtonFeedbackLab } from "@/components/labs/ButtonFeedbackLab";

interface TextLessonProps {
    title: string;
    content: string; // HTML content
    isLocked?: boolean;
    concepts?: Concept[];
    labId?: string;
}

export function TextLesson({ title, content, isLocked = false, concepts = [], labId }: TextLessonProps) {
    
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    // Helper to process content and inject tooltips (naive implementation for demo)
    // ... (renderContent function remains same, omitted for brevity if unchanged)

    if (isLocked) {
        return (
            <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden p-12 text-center h-[400px] flex flex-col items-center justify-center">
                <div className="bg-gray-100 p-6 rounded-full border-2 border-black mb-6">
                    <Lock className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">This theory lesson is locked</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Sign up or enroll in this course to access the full article and all resources.
                </p>
                <Link href="/login" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all">
                    Login to Unlock
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            {/* Hero Header for Theory */}
            <div className="bg-accent-pink/10 border-b-2 border-black p-8 md:p-12 relative overflow-hidden">
                <div className="relative z-10">
                    <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 inline-block transform -rotate-2">
                        Theory Lesson
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 font-serif">
                        {title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
                        <button onClick={copyLink} className="flex items-center gap-2 hover:text-black transition-colors">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        <button className="flex items-center gap-2 hover:text-[#1DA1F2] transition-colors">
                            <Twitter className="w-4 h-4" /> Tweet
                        </button>
                    </div>
                </div>
                
                {/* Decorative background pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-pink rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
            </div>

            {/* Content Body */}
            <div className="p-8 md:p-12 max-w-3xl mx-auto">
                {/* Key Concepts Panel */}
                {concepts.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2 justify-center">
                        {concepts
                            .filter(c => content.toLowerCase().includes(c.term.toLowerCase()))
                            .map(c => (
                            <ConceptTooltip key={c.id} concept={c}>
                                <span className="text-sm font-bold bg-yellow-100 border-b-2 border-accent-yellow px-2 py-1 rounded cursor-help">
                                    {c.term}
                                </span>
                            </ConceptTooltip>
                        ))}
                    </div>
                )}

                <div 
                    className="prose prose-lg prose-slate max-w-none 
                    prose-headings:font-bold prose-headings:text-black
                    prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                    prose-p:text-gray-600 prose-p:leading-relaxed
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-accent-yellow prose-blockquote:bg-yellow-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                    prose-img:rounded-xl prose-img:border-2 prose-img:border-black prose-img:shadow-[4px_4px_0px_0px_#000]
                    "
                    dangerouslySetInnerHTML={{ __html: content }}
                    suppressHydrationWarning
                />

                {/* Interaction Lab Sandbox */}
                {labId === 'button-feedback' && (
                    <div className="mt-12">
                        <ButtonFeedbackLab />
                    </div>
                )}

                {/* Engagement Footer */}
                <div className="mt-16 pt-8 border-t-2 border-dashed border-gray-200 text-center">
                    <p className="font-bold text-lg mb-4">Did this spark an idea? ✨</p>
                    <button onClick={copyLink} className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all">
                        Share this Lesson
                    </button>
                </div>
            </div>
        </div>
    );
}
