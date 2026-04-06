import { searchEverything, SearchResult } from "@/app/actions/search";
import Link from "next/link";
import { Search, BookOpen, Lightbulb, Users, Globe, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";
  const results = await searchEverything(query);

  const theoryResults = results.filter((r) => r.type === "theory");
  const ideaResults = results.filter((r) => r.type === "idea");
  const personResults = results.filter((r) => r.type === "person");
  const pageResults = results.filter((r) => r.type === "page");

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-5xl">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-clash font-medium mb-4 tracking-tight text-black">
            Search Results for <span className="text-accent-blue">"{query}"</span>
          </h1>
          <p className="text-gray-500 font-normal font-clash text-lg">
            Found {results.length} results across the platform.
          </p>
        </div>

        {results.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[40px] p-16 text-center shadow-xl shadow-black/5">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-normal font-clash mb-2">No results found</h2>
            <p className="text-gray-500 font-normal font-clash">Try searching for something else, like "Typography" or "Branding".</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Pages / Navigation */}
            {pageResults.length > 0 && (
              <section animate-in="fade-in">
                <div className="flex items-center gap-2 mb-6 text-emerald-500">
                  <Globe className="w-5 h-5" />
                  <h2 className="text-xl font-normal font-clash uppercase tracking-wider">Navigation</h2>
                </div>
                <div className="grid gap-4">
                  {pageResults.map((result) => (
                    <ResultCard key={result.id} result={result} query={query} />
                  ))}
                </div>
              </section>
            )}

            {/* Theory Modules */}
            {theoryResults.length > 0 && (
              <section animate-in="fade-in">
                <div className="flex items-center gap-2 mb-6 text-accent-blue">
                  <BookOpen className="w-5 h-5" />
                  <h2 className="text-xl font-normal font-clash uppercase tracking-wider">Theory Modules</h2>
                </div>
                <div className="grid gap-4">
                  {theoryResults.map((result) => (
                    <ResultCard key={result.id} result={result} query={query} />
                  ))}
                </div>
              </section>
            )}

            {/* Community Ideas */}
            {ideaResults.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6 text-accent-pink">
                  <Lightbulb className="w-5 h-5" />
                  <h2 className="text-xl font-normal font-clash uppercase tracking-wider">Community Ideas</h2>
                </div>
                <div className="grid gap-4">
                  {ideaResults.map((result) => (
                    <ResultCard key={result.id} result={result} query={query} />
                  ))}
                </div>
              </section>
            )}

            {/* People */}
            {personResults.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6 text-accent-purple">
                  <Users className="w-5 h-5" />
                  <h2 className="text-xl font-normal font-clash uppercase tracking-wider">People</h2>
                </div>
                <div className="grid gap-4">
                  {personResults.map((result) => (
                    <ResultCard key={result.id} result={result} query={query} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="text-blue-500 font-semibold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function ResultCard({ result, query }: { result: SearchResult, query: string }) {
  return (
    <Link 
      href={result.url}
      className={cn(
        "group bg-white border border-gray-100/50 rounded-2xl p-5 flex items-center gap-5 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300",
        result.type === 'page' && "border-emerald-100/50 hover:border-emerald-200"
      )}
    >
      <div className={cn(
        "w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-black/5 flex items-center justify-center",
        result.type === 'page' ? "bg-emerald-50 text-emerald-500" : "bg-gray-100 text-gray-300"
      )}>
        {result.thumbnail && result.type !== 'page' ? (
          <img src={result.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <>
            {result.type === 'theory' && <BookOpen className="w-6 h-6" />}
            {result.type === 'idea' && <Lightbulb className="w-6 h-6" />}
            {result.type === 'person' && <Users className="w-6 h-6" />}
            {result.type === 'page' && <Globe className="w-6 h-6" />}
          </>
        )}
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-medium font-clash truncate group-hover:text-accent-blue transition-colors text-black">
          <Highlight text={result.title} query={query} />
        </h3>
        <p className="text-gray-500 font-normal font-clash text-sm line-clamp-1">
          <Highlight text={result.description} query={query} />
        </p>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors shrink-0" />
    </Link>
  );
}
