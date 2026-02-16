"use client";

import { useState, useEffect } from "react";
import { Course } from "@/app/api/courses/route";
import { CourseCard } from "@/components/courses/CourseCard";
import { Filter, Search } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = courses;

    if (selectedCategory !== "All") {
      result = result.filter(c => c.category === selectedCategory);
    }
    
    if (selectedLevel !== "All") {
        result = result.filter(c => c.difficulty === selectedLevel);
    }

    setFilteredCourses(result);
  }, [selectedCategory, selectedLevel, courses]);

  const categories = ["All", "UI Design", "UX Research", "Motion", "Frontend"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-5xl font-extrabold mb-4">Course Catalog</h1>
        <p className="text-xl text-muted-foreground">
           Level up your skills with our premium curriculum. From basics to advanced systems.
        </p>
      </div>

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
      {loading ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
             <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
             Loading courses...
        </div>
      ) : filteredCourses.length > 0 ? (
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
    </div>
  );
}
