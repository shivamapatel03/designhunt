import { getCourses, Course } from "@/app/actions/courses";
import Link from "next/link";
import { ArrowRight, BookOpen, PenTool, Layout, Award, Briefcase, Zap } from "lucide-react";
import { ReactNode } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { Hero } from "@/components/layout/Hero";
import { DailyLawCard } from "@/components/theory/DailyLawCard";
import { MasterDesignSection } from "@/components/home/MasterDesignSection";

import { getUserStats } from "@/app/actions/users";

export default async function Home() {
  const courses = await getCourses(); 
  const userStats = await getUserStats();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero userStats={userStats} />
      
      {/* Search & Filter Bar (New Segment) */}
      {/* Daily Inspiration & Featured */}
      <section className="py-12 bg-white border-b-2 border-black">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                {/* Daily Law */}
                <DailyLawCard className="h-full" />

                {/* Featured Tool/Resource */}
                <div className="bg-accent-pink text-white rounded-3xl border-2 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative overflow-hidden group">
                     {/* Decorative Elements */}
                     <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-bl-[120px] transition-all group-hover:scale-110" />
                     <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-accent-pink border border-black text-xs font-black uppercase tracking-wider mb-6">
                            Featured Resource
                        </div>
                        <h2 className="text-4xl font-black mb-4">The Ultimate Type Scale</h2>
                        <p className="text-lg font-medium opacity-90 mb-8 max-w-md">
                            Stop guessing font sizes. Use our interactive calculator to generate harmonious typography systems instantly.
                        </p>
                     </div>

                     <Link href="/theory/typography" className="relative z-10 inline-flex items-center gap-2 self-start bg-white text-black px-6 py-3 rounded-xl font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
                        Try Calculator <ArrowRight className="w-4 h-4" />
                     </Link>
                </div>
            </div>
        </div>
      </section>

      {/* Modules Overview */}
      <MasterDesignSection />
    </div>
  );
}
