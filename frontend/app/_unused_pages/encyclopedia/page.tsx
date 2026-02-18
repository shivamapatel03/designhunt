import { getConcepts } from "@/app/actions/concepts";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Palette, Type } from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  "Typography": Type,
  "Color": Palette,
  "Layout": Layers,
  "default": BookOpen
};

export default async function EncyclopediaPage() {
  const concepts = await getConcepts();
  
  // Group by category
  const groupedConcepts = concepts.reduce((acc, concept) => {
    const cat = concept.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(concept);
    return acc;
  }, {} as Record<string, typeof concepts>);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans">
      {/* Header */}
      <div className="bg-black text-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Visual <span className="text-[#FFD700]">Encyclopedia</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
            Interactive definitions for design terms. Don't just read about them—experience them.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {Object.entries(groupedConcepts).map(([category, items]) => {
          const Icon = CATEGORY_ICONS[category] || CATEGORY_ICONS["default"];
          
          return (
            <div key={category} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-black text-white rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((concept) => (
                  <Link 
                    key={concept.id} 
                    href={`/encyclopedia/${concept.slug}`}
                    className="group relative bg-white border-2 border-black rounded-2xl p-6 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  >
                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5" />
                     </div>
                     <h3 className="text-xl font-bold mb-2">{concept.term}</h3>
                     <p className="text-gray-600 line-clamp-2">{concept.definition}</p>
                     
                     {concept.widget_type !== 'standard' && (
                         <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider text-yellow-800">
                             <ZapIcon /> Interactive
                         </div>
                     )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ZapIcon() {
    return (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
