"use client";

import { CheckCircle, Circle, PlayCircle, Lock, FileText, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Lesson {
    id: string;
    title: string;
    duration: string;
    type?: string; // VIDEO or TEXT
    isCompleted?: boolean;
    isLocked?: boolean;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface CourseSidebarProps {
    modules: Module[];
    currentLessonId?: string;
    courseId: string;
}

export function CourseSidebar({ modules, currentLessonId, courseId }: CourseSidebarProps) {
    return (
        <div className="w-full lg:w-80 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000] overflow-hidden h-fit sticky top-24 md:top-28">
             <div className="p-4 bg-black text-white border-b-2 border-black">
                <h3 className="font-bold text-lg">Course Content</h3>
                <p className="text-xs text-gray-400 mt-1">12% Completed</p>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-accent-yellow w-[12%]"></div>
                </div>
             </div>

             <div className="overflow-y-auto max-h-[70vh]">
                {modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border-b border-gray-100 last:border-0">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 font-bold text-sm flex items-center justify-between">
                            <span>Module {moduleIndex + 1}: {module.title}</span>
                        </div>
                        <div>
                            {module.lessons.map((lesson, index) => {
                                const isActive = lesson.id === currentLessonId;
                                let Icon = Circle;
                                
                                if (lesson.isCompleted) {
                                    Icon = CheckCircle;
                                } else if (lesson.type === 'TEXT') {
                                    Icon = FileText;
                                } else {
                                    Icon = isActive ? PlayCircle : Play;
                                }

                                return (
                                    <Link
                                        key={lesson.id}
                                        href={`/courses/${courseId}?lessonId=${lesson.id}`}
                                        className={cn(
                                            "w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-l-4 border-transparent block",
                                            isActive && "bg-blue-50 border-accent-blue hover:bg-blue-50"
                                        )}
                                    >
                                        <Icon className={cn(
                                            "w-5 h-5 mt-0.5 shrink-0",
                                            lesson.isCompleted ? "text-green-500" : (isActive ? "text-accent-blue" : "text-gray-300")
                                        )} />
                                        <div>
                                            <p className={cn(
                                                "text-sm font-medium leading-tight mb-1",
                                                isActive ? "text-black" : "text-gray-600"
                                            )}>
                                                {index + 1}. {lesson.title}
                                            </p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                                {lesson.duration}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
