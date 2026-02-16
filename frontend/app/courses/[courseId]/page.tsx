import { getCourseById } from "@/app/actions/courses";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { TextLesson } from "@/components/courses/TextLesson";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface Props {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

import { Metadata } from "next";

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const { lessonId } = await searchParams;
  const course = await getCourseById(courseId);

  if (!course) {
      return {
          title: "Course Not Found",
      };
  }

  let title = course.title;
  let description = course.description;

  if (typeof lessonId === 'string') {
      for (const module of course.modules) {
          const lesson = module.lessons.find((l: any) => l.id === lessonId);
          if (lesson) {
              title = `${lesson.title} - ${course.title}`;
              // If it's a theory lesson, we could use a snippet of content, but for now course description is safer
              break;
          }
      }
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [course.thumbnail || '/og-default.jpg'],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [course.thumbnail || '/og-default.jpg'],
    }
  };
}

import { getLabForLesson } from "@/lib/labs";
import { getConcepts } from "@/app/actions/concepts";

export default async function CoursePlayerPage({ params, searchParams }: Props) {
  const { courseId } = await params;
  const { lessonId } = await searchParams;
  
  const course = await getCourseById(courseId);
  const concepts = await getConcepts(); // Fetch global concepts

  if (!course) {
    notFound();
  }

  // Check Authorization
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let isAuthorized = false;

  if (token) {
      try {
          await jwtVerify(token, JWT_SECRET);
          isAuthorized = true;
      } catch (err) {
          isAuthorized = false;
      }
  }

  // Process Modules to set Locked Status for Sidebar
  const processedModules = course.modules.map((mod: any) => ({
      ...mod,
      lessons: mod.lessons.map((lesson: any) => ({
          ...lesson,
          isLocked: !isAuthorized && !lesson.is_free
      }))
  }));

  // Find active lesson if lessonId is provided
  let activeVideoUrl: string | null | undefined = course.video_url;
  let activeTitle = course.title;
  let activeLessonId = undefined;
  let activeLessonType = 'VIDEO';
  let activeContent = '';
  let isCurrentLessonLocked = false;
  let activeLabId: string | undefined = undefined;

  if (typeof lessonId === 'string') {
      for (const module of processedModules) {
          const lesson = module.lessons.find((l: any) => l.id === lessonId);
          if (lesson) {
              activeTitle = lesson.title;
              activeLessonId = lesson.id;
              activeLessonType = lesson.type || 'VIDEO';
              isCurrentLessonLocked = lesson.isLocked;
              activeLabId = getLabForLesson(lesson.id);

              // Only expose content if NOT locked
              if (!isCurrentLessonLocked) {
                  activeVideoUrl = lesson.video_url || activeVideoUrl; 
                  activeContent = lesson.content || '';
              } else {
                  activeVideoUrl = undefined;
                  activeContent = '';
                  activeLabId = undefined; // Hide lab if locked
              }
              break;
          }
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 md:pt-28">
       {/* Top Navigation Bar */}
       {/* Top Navigation Bar */}
       <div className="py-4 mt-4">
          <div className="container mx-auto px-4">
             <Link href="/learning-paths" className="inline-flex w-12 h-12 items-center justify-center bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                <ArrowLeft className="w-6 h-6" />
             </Link>
          </div>
       </div>

       <div className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          {/* Main Content Info */}
          <div className="flex-1">
             {activeLessonType === 'TEXT' ? (
                 <TextLesson 
                    title={activeTitle} 
                    content={activeContent} 
                    isLocked={isCurrentLessonLocked}
                    concepts={concepts}
                    labId={activeLabId}
                 />
             ) : (
                 <VideoPlayer 
                    videoUrl={activeVideoUrl} 
                    thumbnail={course.thumbnail} 
                    isLocked={isCurrentLessonLocked}
                 />
             )}

             <div className="mt-8 bg-white border-2 border-black rounded-2xl p-8 shadow-[4px_4px_0px_0px_#000]">
                <h2 className="text-2xl font-bold mb-4">About this lesson</h2>
                <div className="prose max-w-none text-gray-600">
                    <p>{course.description}</p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4">
                    <div className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-xs font-bold text-blue-500 uppercase mb-1">Duration</p>
                        <p className="font-bold text-lg">{course.duration}</p>
                    </div>
                    <div className="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
                        <p className="text-xs font-bold text-green-500 uppercase mb-1">Level</p>
                        <p className="font-bold text-lg">{course.difficulty}</p>
                    </div>
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 shrink-0">
             <CourseSidebar 
                modules={processedModules} 
                courseId={course.id}
                currentLessonId={activeLessonId}
             />
          </div>
       </div>
    </div>
  );
}
