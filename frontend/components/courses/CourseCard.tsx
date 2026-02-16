import Link from "next/link";
import { Clock, BarChart } from "lucide-react";
import { Course } from "@/app/actions/courses";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group flex flex-col h-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] overflow-hidden">
      {/* Thumbnail */}
      <div className={`h-48 w-full ${course.thumbnail} border-b-2 border-black flex items-center justify-center relative overflow-hidden`}>
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
         
         {/* If thumbnail is a URL (image path), render img. Otherwise render placeholder class/text */}
         {course.thumbnail && course.thumbnail.startsWith('/') ? (
             <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
         ) : (
             <span className={`text-4xl font-extrabold ${['bg-black', 'bg-accent-blue'].includes(course.thumbnail) ? 'text-white' : 'text-black'}`}>
                {course.title.split(' ')[0]}
             </span>
         )}
         
         <div className="absolute top-2 right-2 bg-white border border-black px-2 py-1 text-xs font-bold rounded">
            {course.price}
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border border-black ${
                course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>
                {course.difficulty}
            </span>
            <span className="flex items-center text-xs font-medium text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" /> {course.duration}
            </span>
        </div>

        <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-accent-blue transition-colors">
            {course.title}
        </h3>
        <p className="text-sm text-gray-600 mb-6 flex-1 line-clamp-3">
            {course.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 border border-black flex items-center justify-center text-xs font-bold overflow-hidden">
                    {course.instructor_name?.charAt(0) || '?'}
                </div>
                <span className="text-xs font-bold">{course.instructor_name}</span>
            </div>
            
            <Link href={`/courses/${course.id}`} className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors">
                View Course
            </Link>
        </div>
      </div>
    </div>
  );
}
