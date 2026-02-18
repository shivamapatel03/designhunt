import { getCourses, Course } from "@/app/actions/courses";
import { CourseCard } from "@/components/courses/CourseCard";
import { SearchFilters } from "@/components/courses/SearchFilters";
import { BookOpen } from "lucide-react";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LearningPathsPage({ searchParams }: Props) {
  const { query, category } = await searchParams;
  const queryString = typeof query === 'string' ? query : undefined;
  const categoryString = typeof category === 'string' ? category : undefined;

  const courses = await getCourses(queryString, categoryString);

  return (
    <div className="container mx-auto px-6 pt-32 md:pt-48 pb-12 md:px-16 lg:px-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
         <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-accent-yellow rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                 <BookOpen className="w-6 h-6" />
               </div>
               <h1 className="text-4xl font-bold">Learning Paths</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Structured curriculums designed to maintain focus and build mastery.
            </p>
         </div>
      </div>
      
      {/* Search Filters */}
      <div className="mb-12">
        <SearchFilters />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-2xl font-bold mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}
