"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, Lightbulb, Users, Globe, ChevronRight, Loader2, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchEverything, SearchResult } from "@/app/actions/search";
import { cn } from "@/lib/utils";

const RECENT_SEARCHES_KEY = "dh_recent_searches";

export function SearchModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Load recent searches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const newRecent = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecent));
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newRecent = recentSearches.filter(s => s !== term);
    setRecentSearches(newRecent);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecent));
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        const res = await searchEverything(query.trim());
        setResults(res.slice(0, 8)); // top 8 to fit nicely
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim().length >= 2) {
      saveRecentSearch(query.trim());
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const ResultIcon = ({ type }: { type: SearchResult['type'] }) => {
    switch (type) {
      case 'theory': return <BookOpen className="w-4 h-4" />;
      case 'idea': return <Lightbulb className="w-4 h-4" />;
      case 'person': return <Users className="w-4 h-4" />;
      case 'page': return <Globe className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getIconColorClass = (type: SearchResult['type']) => {
    switch (type) {
      case 'theory': return "bg-blue-500/10 text-blue-500";
      case 'idea': return "bg-pink-500/10 text-pink-500";
      case 'person': return "bg-purple-500/10 text-purple-500";
      case 'page': return "bg-emerald-500/10 text-emerald-500";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  // Highlighting matching substring
  const highlightMatch = (text: string, term: string) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <span key={i} className="text-blue-500 font-semibold">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 font-plus-jakarta">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl relative z-[101] overflow-hidden flex flex-col max-h-[80vh] border border-gray-100"
          >
            {/* Input Header */}
            <div className="relative flex items-center px-6 py-5 border-b border-gray-100">
              <Search className={cn("w-6 h-6 text-gray-400 mr-4", isSearching && "opacity-0")} />
              {isSearching && (
                <Loader2 className="w-6 h-6 text-blue-500 absolute left-6 animate-spin" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search resources, ideas, or users..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-semibold text-black placeholder:text-gray-400"
              />
              <button 
                onClick={onClose}
                className="ml-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto min-h-[300px] p-3 max-h-[50vh]">
              {query.length < 2 ? (
                // Initial State
                <div className="p-4">
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-2">Recent Searches</div>
                      <div className="space-y-1">
                        {recentSearches.map((term, idx) => (
                          <div 
                            key={`recent-${idx}`}
                            className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => setQuery(term)}
                          >
                            <div className="flex items-center gap-3 text-gray-600 group-hover:text-black">
                              <Clock className="w-4 h-4 opacity-50" />
                              <span className="font-semibold text-sm">{term}</span>
                            </div>
                            <button 
                              onClick={(e) => removeRecentSearch(e, term)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-2">Quick Links</div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      <Link 
                        href="/library" 
                        onClick={onClose}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group"
                      >
                         <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform"><BookOpen className="w-5 h-5"/></div>
                         <span className="text-sm font-semibold text-gray-700">Library</span>
                      </Link>
                      <Link 
                        href="/theory" 
                        onClick={onClose}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all group"
                      >
                         <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Lightbulb className="w-5 h-5"/></div>
                         <span className="text-sm font-semibold text-gray-700">Theory</span>
                      </Link>
                      <Link 
                        href="/tools" 
                        onClick={onClose}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-orange-50/50 hover:bg-orange-50 border border-transparent hover:border-orange-100 transition-all group"
                      >
                         <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Globe className="w-5 h-5"/></div>
                         <span className="text-sm font-semibold text-gray-700">Tools</span>
                      </Link>
                      <Link 
                        href="/ideas" 
                        onClick={onClose}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-pink-50/50 hover:bg-pink-50 border border-transparent hover:border-pink-100 transition-all group"
                      >
                         <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Users className="w-5 h-5"/></div>
                         <span className="text-sm font-semibold text-gray-700">Community</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                // Search Results
                <div className="py-2">
                  {results.length > 0 ? (
                    <div className="space-y-1">
                      {results.map((result) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          href={result.url}
                          onClick={() => {
                            saveRecentSearch(query.trim());
                            onClose();
                          }}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                          {/* Icon/Thumbnail */}
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-black/5 object-cover overflow-hidden",
                            getIconColorClass(result.type)
                          )}>
                            {result.thumbnail && result.type !== 'page' ? (
                              <img src={result.thumbnail} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <ResultIcon type={result.type} />
                            )}
                          </div>
                          
                          {/* Text Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-black truncate">
                              {highlightMatch(result.title, query.trim())}
                            </h4>
                            <p className="text-sm text-gray-500 truncate mt-0.5">
                              {highlightMatch(result.description, query.trim())}
                            </p>
                          </div>
                          
                          {/* Badge */}
                          <div className="shrink-0 pl-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                              {result.type}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : !isSearching ? (
                    <div className="py-14 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-600 font-semibold tracking-wide">No results found for "{query}"</p>
                      <p className="text-sm text-gray-400 mt-1">Try a different term or browse the quick links.</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-100 py-3 px-6 flex items-center justify-between text-xs font-semibold text-gray-400">
              <div className="hidden sm:flex items-center gap-4">
                <span className="flex items-center gap-1.5"><kbd className="bg-white px-2 py-1 rounded border border-gray-200 text-gray-500 shadow-sm font-sans font-semibold">↑</kbd><kbd className="bg-white px-2 py-1 rounded border border-gray-200 text-gray-500 shadow-sm font-sans font-semibold">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-white px-2 py-1 rounded border border-gray-200 text-gray-500 shadow-sm font-sans font-semibold">Enter</kbd> to select</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-white px-2 py-1 rounded border border-gray-200 text-gray-500 shadow-sm font-sans font-semibold">Esc</kbd> to close</span>
              </div>
              <img src="/logo/gloom.png" className="w-6 grayscale opacity-30" alt="" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
