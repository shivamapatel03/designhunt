import { PersonaGenerator } from "@/components/theory/PersonaGenerator";
import { ArrowLeft, Search, Heart, Users } from "lucide-react";
import Link from "next/link";

export default function UserResearchPage() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-12">
        <Link href="/theory" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Theory Hub
        </Link>
        <header className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">User Research</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
                You are not your user. Research bridges the gap between assumptions and reality.
            </p>
        </header>

         <div className="grid lg:grid-cols-[1fr_300px] gap-12">
            <div className="space-y-16">
                 <section>
                    <h2 className="text-2xl font-bold mb-6">Persona Builder</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Personas are fictional characters that represent the different user types within your targeted demographic.
                    </p>
                    <PersonaGenerator />
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-6">Methods</h2>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h3 className="font-bold mb-2">Qualitative</h3>
                            <p className="text-sm text-gray-600 mb-4">"Why" actions happen. Interviews, observations.</p>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Small Sample Size</span>
                        </div>
                         <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <h3 className="font-bold mb-2">Quantitative</h3>
                            <p className="text-sm text-gray-600 mb-4">"What" actions happen. Surveys, analytics.</p>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Large Sample Size</span>
                        </div>
                     </div>
                </section>
            </div>

             <aside className="space-y-6">
                <div className="p-6 border-2 border-black rounded-xl bg-accent-blue text-white shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Heart className="w-5 h-5" /> Empathy Map</h3>
                    <p className="text-sm opacity-90 mb-4">
                        Always ask:
                    </p>
                    <ul className="space-y-2 text-sm font-bold">
                        <li>• What do they SEE?</li>
                        <li>• What do they HEAR?</li>
                        <li>• What do they DO?</li>
                        <li>• What do they FEEL?</li>
                    </ul>
                </div>
            </aside>
         </div>
    </div>
  );
}
