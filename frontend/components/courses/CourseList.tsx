"use client";

import { useState, useEffect } from "react";
import { Course } from "@/app/actions/courses";
import { CourseCard } from "@/components/courses/CourseCard";
import { Filter, Search } from "lucide-react";

interface CourseListProps {
  initialCourses: Course[];
}

export function CourseList({ initialCourses }: CourseListProps) {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(initialCourses);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  useEffect(() => {
    let result = initialCourses;

    if (selectedCategory !== "All") {
      result = result.filter(c => c.category === selectedCategory);
    }
    
    if (selectedLevel !== "All") {
        result = result.filter(c => c.difficulty === selectedLevel);
    }

    setFilteredCourses(result);
  }, [selectedCategory, selectedLevel, initialCourses]);

  const categories = ["All", "UI Design", "UX Research", "Motion", "Frontend"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 p-4 bg-gray-50 border-2 border-black rounded-xl items-center justify-between">
         <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 font-bold px-2">
                <Filter className="w-5 h-5" /> Filters:
            </div>
            
            <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 font-medium focus:border-black outline-none"
            >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select 
                 value={selectedLevel}
                 onChange={(e) => setSelectedLevel(e.target.value)}
                 className="p-2 rounded-lg border border-gray-300 font-medium focus:border-black outline-none"
            >
                 {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
         </div>
      </div>

      {/* Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
                 <CourseCard key={course.id} course={course} />
            ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No courses found matching your filters.</h3>
            <button 
                onClick={() => {setSelectedCategory('All'); setSelectedLevel('All')}}
                className="mt-4 text-accent-blue underline font-bold"
            >
                Clear Filters
            </button>
        </div>
      )}
    </>
  );
}
