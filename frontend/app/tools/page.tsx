"use client";

import { ToolCard } from "@/components/tools/ToolCard";
import { Layout, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon?: string;
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tools", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setTools(data);
        setFilteredTools(data);
        
        // Extract unique categories
        const cats = ["All", ...Array.from(new Set(data.map((t: Tool) => t.category))) as string[]];
        setCategories(cats);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = tools;

    if (selectedCategory !== "All") {
      result = result.filter(tool => tool.category === selectedCategory);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(lowerQuery) || 
        tool.description.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredTools(result);
  }, [searchQuery, selectedCategory, tools]);

  return (
    <div className="container mx-auto px-6 pt-32 md:pt-48 pb-12 md:px-16 lg:px-24 min-h-screen">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
         <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-accent-blue rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                 <Layout className="w-6 h-6 text-white" />
               </div>
               <h1 className="text-4xl font-black">Design Tools</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl font-medium">
              Curated collection of the best design resources and utilities.
            </p>
         </div>

         {/* Search & Filter Controls */}
         <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search tools..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full sm:w-64 bg-white border-2 border-gray-200 rounded-xl font-bold focus:border-black outline-none transition-colors"
                />
            </div>
            <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-12 pr-8 py-3 w-full sm:w-48 bg-white border-2 border-gray-200 rounded-xl font-bold focus:border-black outline-none appearance-none cursor-pointer transition-colors"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
         </div>
      </div>

      {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
              ))}
          </div>
      ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool, index) => (
                <ToolCard 
                  key={tool.id} 
                  index={index}
                  name={tool.name}
                  category={tool.category}
                  description={tool.description}
                  url={tool.url}
                  icon={tool.icon}
                  pricing="Free" 
                  color="bg-black"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                <p className="text-xl text-gray-400 font-bold">No tools found matching your criteria.</p>
                <button 
                    onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                    className="mt-4 text-accent-blue font-black underline"
                >
                    Clear Filters
                </button>
              </div>
            )}
          </div>
      )}
    </div>
  );
}
