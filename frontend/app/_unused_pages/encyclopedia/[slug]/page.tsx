import { getConceptBySlug } from "@/app/actions/concepts";
import { ConceptWidget } from "@/components/encyclopedia/ConceptWidgets";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ConceptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = await getConceptBySlug(slug);

  if (!concept) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
            <h1 className="text-4xl font-black mb-4">404</h1>
            <p className="text-xl mb-8">Concept not found.</p>
            <Link href="/encyclopedia" className="underline font-bold">Back to Encyclopedia</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/encyclopedia" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Encyclopedia
        </Link>
        
        <header className="mb-12">
            <div className="text-sm font-bold uppercase tracking-widest text-[#FFD700] mb-2">{concept.category}</div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">{concept.term}</h1>
            <p className="text-xl md:text-2xl font-serif text-gray-700 leading-relaxed border-l-4 border-[#FFD700] pl-6 italic">
                {concept.definition}
            </p>
        </header>

        {concept.widget_type !== 'standard' && (
            <div className="mb-12">
                <ConceptWidget type={concept.widget_type} />
            </div>
        )}

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700">
            {/* Simple rendering for now. In real app, use a markdown parser */}
            {concept.content && concept.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
            ))}
        </div>
      </div>
    </div>
  );
}
