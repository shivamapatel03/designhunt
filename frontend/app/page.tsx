import { getCourses, Course } from "@/app/actions/courses";
import Link from "next/link";
import { ArrowRight, BookOpen, PenTool, Layout, Award, Briefcase, Zap } from "lucide-react";
import { ReactNode } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { Hero } from "@/components/layout/Hero";
import { DailyLawCard } from "@/components/theory/DailyLawCard";
import { MasterDesignSection } from "@/components/home/MasterDesignSection";
import { DailyDuel } from "@/components/home/DailyDuel";
import { DailyChallengeHero } from "@/components/challenges/DailyChallengeHero";

import { getUserStats } from "@/app/actions/users";
import { getSettings } from "@/app/actions/settings";

export default async function Home() {
  const courses = await getCourses(); 
  const userStats = await getUserStats();
  const settings = await getSettings() as { enable_challenges: number };

  return (
    <div className="flex flex-col min-h-screen">
      <Hero userStats={userStats} />
      
      {/* Modules Overview */}
      <MasterDesignSection />

      {/* Search & Filter Bar (New Segment) */}
      {/* Daily Inspiration & Featured */}
      <section className="py-12 bg-white border-b-2 border-black">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
            
            {/* Daily Design Challenge (Submission based) - Super Admin Toggle */}
            {settings?.enable_challenges === 1 && (
                <div className="mb-12">
                     <DailyChallengeHero />
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                {/* Daily Law */}
                <DailyLawCard className="h-full" />

                {/* Daily Duel (Vote) - Always Visible */}
                <DailyDuel />
            </div>
        </div>
      </section>
    </div>
  );
}
