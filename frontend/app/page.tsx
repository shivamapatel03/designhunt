import { getCourses, Course } from "@/app/actions/courses"; // forced reload
import Link from "next/link";
import { ArrowRight, BookOpen, PenTool, Layout, Award, Briefcase, Zap } from "lucide-react";
import { ReactNode } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { Hero } from "@/components/layout/Hero";
import { DailyLawCard } from "@/components/theory/DailyLawCard";
import { MasterDesignSection } from "@/components/home/MasterDesignSection";
import { DailyDuel } from "@/components/home/DailyDuel";
import { DailyChallengeHero } from "@/components/challenges/DailyChallengeHero";

import { getExpertReviews } from "@/app/actions/reviews";
import { ExpertReviewsSection } from "@/components/home/ExpertReviewsSection";
import { FAQSection } from "@/components/home/FAQSection";

import { getUserStats } from "@/app/actions/users";
import { getSettings } from "@/app/actions/settings";
export default async function Home() {
  const userStats = await getUserStats();
  const settings = await getSettings() as { enable_challenges: number };
  const expertReviews = await getExpertReviews();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero userStats={userStats} />
      
      {/* Design Modules */}
      <div className="bg-[#fafafa] overflow-hidden">
        {/* Modules Overview */}
        <MasterDesignSection />
      </div>

      {/* Search & Filter Bar (New Segment) */}
      {/* Daily Inspiration & Featured */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
            
            {/* Daily Design Challenge (Submission based) - Super Admin Toggle */}
            {settings?.enable_challenges === 1 && (
                <div className="mb-12">
                     <DailyChallengeHero />
                </div>
            )}

            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-black mb-2 font-clash tracking-tight text-black">Daily Inspiration & Challenges</h2>
              <p className="text-xl text-muted-foreground font-medium font-clash">Test your skills and learn something new every day.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                {/* Daily Law */}
                <DailyLawCard className="h-full" />

                {/* Daily Duel (Vote) - Always Visible */}
                <DailyDuel />
            </div>
        </div>
      </section>

      {/* Expert Reviews */}
      {expertReviews && expertReviews.length > 0 && (
          <ExpertReviewsSection reviews={expertReviews} />
      )}

      {/* FAQs */}
      <FAQSection />
    </div>
  );
}
