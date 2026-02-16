"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import Link from "next/link";
import { type Concept } from "@/app/actions/concepts";

interface ConceptTooltipProps {
    concept: Concept;
    children: React.ReactNode;
}

export function ConceptTooltip({ concept, children }: ConceptTooltipProps) {
    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help border-b-2 border-dashed border-accent-yellow bg-yellow-50 hover:bg-accent-yellow/20 transition-colors inline-block leading-tight px-0.5 rounded">
                        {children}
                    </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] p-0 overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-xl">
                    <div className="bg-black text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
                        <span>{concept.term}</span>
                        <Info className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="p-4 bg-white text-gray-700 text-sm">
                        <p className="mb-3 leading-relaxed">{concept.definition}</p>
                        {concept.visual_example && (
                            <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
                                <img src={concept.visual_example} alt={concept.term} className="w-full h-auto object-cover" />
                            </div>
                        )}
                        {concept.related_lesson_id && (
                             <Link href={`/courses/basics?lessonId=${concept.related_lesson_id}`} className="text-xs font-bold text-blue-600 hover:underline block text-right">
                                Learn more →
                             </Link>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
