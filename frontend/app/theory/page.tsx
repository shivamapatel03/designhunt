import Link from "next/link";
import { ArrowRight, Palette, Type, Layout, MousePointer, Scale, Eye, Box, LayoutTemplate } from "lucide-react";
import { ReactNode } from "react";

export default function TheoryPage() {
  return (
    <div className="container mx-auto px-4 pt-36 md:pt-40 pb-12 lg:pb-20 max-w-7xl">
      <div className="text-center max-w-3xl mx-auto mb-6">
        <h1 className="text-5xl font-extrabold mb-4">Design Theory Hub</h1>
        <p className="text-xl text-muted-foreground">
           Master the fundamental principles that power great interfaces. Interactive guides for beginners and pros.
        </p>
      </div>







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
