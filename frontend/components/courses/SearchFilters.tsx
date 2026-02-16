"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ChevronDown, Check } from "lucide-react";

type CategoryMap = {
    [key: string]: string[];
};

const CATEGORIES: CategoryMap = {
    "All": [],
    "Design": ["UI Design", "UX Research", "Graphic Design", "Motion Graphics", "3D Design"],
    "Development": ["Frontend", "Backend", "Full Stack", "Mobile", "DevOps"],
    "Business": ["Entrepreneurship", "Marketing", "Management", "Finance"],
    "Art": ["Illustration", "Photography", "Fine Art"],
};

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("query", query);
      else params.delete("query");
      router.replace(`/learning-paths?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [query, router]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat && cat !== "All") params.set("category", cat);
    else params.delete("category");
    router.replace(`/learning-paths?${params.toString()}`, { scroll: false });
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full mb-8 sticky top-0 md:top-6 z-40 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
      {/* Category Dropdown */}
      <div className="relative min-w-[200px]" ref={dropdownRef}>
        <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-6 py-4 bg-black text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all"
        >
            <span>{selectedCategory}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                <div onClick={() => handleCategorySelect("All")} className="px-6 py-3 hover:bg-gray-50 cursor-pointer font-bold border-b border-gray-100 flex items-center justify-between group">
                    <span>All Categories</span>
                    {selectedCategory === "All" && <Check className="w-4 h-4" />}
                </div>
                {Object.entries(CATEGORIES).filter(([key]) => key !== 'All').map(([parent, subs]) => (
                    <div key={parent}>
                        <div 
                            onClick={() => handleCategorySelect(parent)}
                            className="px-6 py-3 bg-gray-50 font-bold text-xs uppercase text-gray-500 tracking-widest cursor-pointer hover:text-black flex items-center justify-between"
                        >
                            {parent}
                             {selectedCategory === parent && <Check className="w-4 h-4 text-black" />}
                        </div>
                        {subs.map(sub => (
                             <div 
                                key={sub}
                                onClick={() => handleCategorySelect(sub)}
                                className="px-8 py-2 hover:bg-accent-yellow/20 cursor-pointer text-sm font-medium border-l-4 border-transparent hover:border-black flex items-center justify-between"
                             >
                                {sub}
                                {selectedCategory === sub && <Check className="w-3 h-3" />}
                             </div>
                        ))}
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for courses, topic, or instructor..."
          className="w-full pl-12 pr-10 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all placeholder:font-medium font-bold text-lg"
        />
        {query && (
            <button 
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
                <X className="w-4 h-4 text-gray-500" />
            </button>
        )}
      </div>
    </div>
  );
}
