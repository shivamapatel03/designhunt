import { getCourses, Course } from "@/app/actions/courses";
import Link from "next/link";
import { ArrowRight, BookOpen, PenTool, Layout, Award, Briefcase, Zap } from "lucide-react";
import { ReactNode } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { Hero } from "@/components/layout/Hero";

export default async function Home() {
  const courses = await getCourses(); 

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Search & Filter Bar (New Segment) */}
      <section className="py-12 bg-white border-b-2 border-black">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="w-full md:max-w-2xl relative">
                    <input 
                      type="text" 
                      placeholder="What do you want to learn today?" 
                      className="w-full px-8 py-4 bg-gray-50 border-4 border-black rounded-[24px] font-black text-xl italic shadow-[8px_8px_0px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0px_0px_#000] transition-all outline-none"
                    />
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-4 bg-accent-yellow border-2 border-black rounded-xl font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000]">Filters</button>
                    <button className="px-6 py-4 bg-black text-white border-2 border-black rounded-xl font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000]">Search</button>
                </div>
            </div>
        </div>
      </section>

      {/* Modules Overview */}
      <section className="py-20 bg-[#fafafa]">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Master Design</h2>
            <p className="text-xl text-muted-foreground">Structured modules designed to take you from beginner to expert.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8" />}
              title="Structured Learning Paths"
              description="Step-by-step roadmap from foundations to advanced specializations."
              color="bg-accent-yellow"
              href="/learning-paths"
            />
            <FeatureCard 
              icon={<PenTool className="w-8 h-8" />}
              title="Theory Library"
              description="Interactive design encyclopedia. Color, Typography, Grid, and more."
              color="bg-accent-blue"
              href="/theory"
              textColor="text-white"
            />
             <FeatureCard 
              icon={<Layout className="w-8 h-8" />}
              title="Tool Mastery"
              description="Master Figma, Webflow, Rive, and more with practical tasks."
              color="bg-accent-pink"
              href="/tools"
              textColor="text-white"
            />
             <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Practice & Challenges"
              description="Daily design problems with AI-powered feedback on your work."
              color="bg-black"
              href="/challenges"
              textColor="text-white"
            />
             <FeatureCard 
              icon={<Briefcase className="w-8 h-8" />}
              title="Career Prep"
              description="Interview questions, portfolio reviews, and career roadmaps."
              color="bg-white"
              href="/career"
            />
             <FeatureCard 
              icon={<Award className="w-8 h-8" />}
              title="Certification"
              description="Earn recognized certificates as you complete modules."
              color="bg-[#f0f0f0]"
              href="#"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, href, textColor = "text-black" }: { icon: ReactNode, title: string, description: string, color: string, href: string, textColor?: string }) {
  return (
    <Link href={href} className={`group block p-8 rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] ${color} ${textColor}`}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className={`text-sm ${textColor === 'text-white' ? 'text-gray-200' : 'text-gray-600'}`}>{description}</p>
      
      <div className="mt-6 flex items-center font-bold text-sm">
        Explore <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
