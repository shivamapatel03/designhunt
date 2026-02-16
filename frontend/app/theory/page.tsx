import Link from "next/link";
import { ArrowRight, Palette, Type, Layout, MousePointer, Scale, Eye, Box, LayoutTemplate, Beaker } from "lucide-react";
import { ReactNode } from "react";
import { DailyLawCard } from "@/components/theory/DailyLawCard";
import { InteractionLab } from "@/components/theory/InteractionLab";

export default function TheoryPage() {
  return (
    <div className="container mx-auto px-4 pt-32 md:pt-48 pb-12 lg:pb-20 max-w-7xl">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-extrabold mb-4">Design Theory Hub</h1>
        <p className="text-xl text-muted-foreground">
           Master the fundamental principles that power great interfaces. Interactive guides for beginners and pros.
        </p>
      </div>

      <DailyLawCard />

      {/* Playground Showcase Section - NEW */}
      <section className="mb-20">
        <div className="relative group overflow-hidden rounded-[40px] border-2 border-black bg-black p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 via-accent-pink/20 to-accent-yellow/20 group-hover:opacity-100 opacity-50 transition-opacity" />
          <div className="relative bg-white rounded-[38px] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden translate-x-[-4px] translate-y-[-4px]">
            
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-xs font-black uppercase tracking-widest">
                <Beaker className="w-3 h-3" /> Experimental sandbox
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">The Interaction Lab</h2>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                Theory isn't just for reading. Experience the fundamental laws of design through interactive experiments. **Play with Gestalt, Kerning, and UX physics.**
              </p>
              <Link 
                href="/theory/playground"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-black rounded-2xl hover:opacity-90 transition-opacity uppercase tracking-widest"
              >
                Enter the Hub <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="w-full lg:w-1/2 relative bg-gray-50 rounded-[32px] border-4 border-dashed border-gray-100 p-1 group-hover:border-accent-blue/30 transition-colors overflow-hidden">
                <InteractionLab />
            </div>

          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
         <LinkCard 
            href="/theory/color"
            title="Color Theory"
            description="Contrast, psychology, and harmony. Use the interactive contrast checker."
            icon={<Palette className="w-8 h-8" />}
            color="bg-accent-blue"
            isInteractive
         />
         <LinkCard 
            href="/theory/typography"
            title="Typography"
            description="Hierarchy, scaling, and readability. Includes a type scale calculator."
            icon={<Type className="w-8 h-8" />}
            color="bg-black text-white"
            isInteractive
         />
         <LinkCard 
            href="/theory/layout"
            title="Layout & Grids"
            description="The 12-column grid system, spacing, and alignment rules."
            icon={<Layout className="w-8 h-8" />}
            color="bg-accent-yellow"
         />
         <LinkCard 
            href="/theory/motion"
            title="Motion & Animation"
            description="Easing curves, squash & stretch. Play with the Bezier editor."
            icon={<MousePointer className="w-8 h-8" />}
            color="bg-accent-pink"
            isInteractive
         />
          <LinkCard 
            href="/theory/ux-laws"
            title="Laws of UX"
            description="Fitts's Law, Hick's Law, and how psychology drives interaction."
            icon={<Scale className="w-8 h-8" />}
            color="bg-white"
            isInteractive
         />
            <LinkCard 
            href="/theory/accessibility"
            title="Accessibility"
            description="Color blindness simulator and WCAG checklist."
            icon={<Eye className="w-8 h-8" />}
            color="bg-gray-100"
            isInteractive
         />
            <LinkCard 
            href="/theory/design-systems"
            title="Design Systems"
            description="Atomic Design assembler. Build systems, not pages."
            icon={<Box className="w-8 h-8" />}
            color="bg-black text-white"
         />
            <LinkCard 
            href="/theory/visual-hierarchy"
            title="Visual Hierarchy"
            description="Gestalt principles and Heatmap simulation."
            icon={<LayoutTemplate className="w-8 h-8" />}
            color="bg-accent-yellow"
            isInteractive
         />
      </div>
    </div>
  );
}

function LinkCard({ 
    href, 
    title, 
    description, 
    icon, 
    color, 
    isNew, 
    isInteractive 
}: { 
    href: string, 
    title: string, 
    description: string, 
    icon: ReactNode, 
    color: string,
    isNew?: boolean,
    isInteractive?: boolean
}) {
    const iconTextColor = color.includes('bg-black') || color.includes('bg-accent-pink') ? 'text-white' : 'text-black';

    return (
        <Link href={href} className="group block p-8 rounded-3xl bg-white border-2 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 h-full flex flex-col relative overflow-hidden">
            {isNew && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-accent-yellow text-[10px] font-black uppercase tracking-tighter border border-black rounded-md rotate-3 shadow-sm">
                    New Feature
                </div>
            )}
            
            <div className={`mb-6 p-4 rounded-2xl w-fit ${color} ${iconTextColor} border-2 border-black shadow-sm`}>
                {icon}
            </div>
            
            <div className="flex flex-col gap-1 mb-3">
                {isInteractive && (
                    <span className="text-[10px] font-black text-accent-blue uppercase tracking-widest flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                        Interactive
                    </span>
                )}
                <h3 className="text-2xl font-black group-hover:underline decoration-4 underline-offset-4 decoration-accent-blue">
                    {title}
                </h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed font-medium flex-grow">
                {description}
            </p>
            
            <div className="flex items-center text-sm font-black text-black mt-auto pt-4 border-t-2 border-gray-100">
                Start Learning 
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    )
}
