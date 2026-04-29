import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-figtree font-semibold tracking-tight text-black mb-4">
            Rules of Conduct
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Last updated: April 29, 2026
          </p>
        </header>

        <div className="prose prose-gray max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">1. Be Kind and Professional</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              We're a community of designers helping each other grow. Maintain a professional tone in all interactions, critiques, and discussions. Harassment or hate speech of any kind is not tolerated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">2. No Spam or Self-Promotion</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              Keep the focus on learning. Do not post unsolicited advertisements, spam links, or excessive self-promotion that doesn't add value to the community.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">3. Respect Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              Only upload work that you have the right to share. Always give proper credit when referencing others' designs or using third-party assets in your challenges.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">4. Integrity in Learning</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              Cheating or gaming the XP system undermines your own growth. Complete challenges honestly and provide meaningful critiques to others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-figtree text-black mb-4">5. Account Safety</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              You are responsible for the activity on your account. Keep your login information secure and do not share your account with others.
            </p>
          </section>

          <section className="pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold font-figtree text-black mb-4">Questions?</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              If you're unsure about any of these rules, please reach out to our moderation team at <a href="mailto:support@designhunt.io" className="text-black underline underline-offset-4 hover:text-blue-600 transition-colors">support@designhunt.io</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
