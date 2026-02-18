import { getCourses, Course } from "@/app/actions/courses";
import Link from "next/link";
import { ArrowRight, BookOpen, PenTool, Layout, Award, Briefcase, Zap } from "lucide-react";
import { ReactNode } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { Hero } from "@/components/layout/Hero";
import { DailyLawCard } from "@/components/theory/DailyLawCard";
import { MasterDesignSection } from "@/components/home/MasterDesignSection";
import { DailyDuel } from "@/components/home/DailyDuel";

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

                {/* Daily Duel (New Feature) */}
                <DailyDuel />
            </div>
        </div>
      </section>

      {/* Modules Overview */}
      <MasterDesignSection />
    </div>
  );
}
