
import { getCourses } from "@/app/actions/courses";
import { CourseList } from "@/components/courses/CourseList";

// Force dynamic rendering if we want to ensure latest data, 
// though for this use case revalidating every 60s or on-demand is better.
export const dynamic = 'force-dynamic'; 

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-5xl font-extrabold mb-4">Course Catalog</h1>
        <p className="text-xl text-muted-foreground">
           Level up your skills with our premium curriculum. From basics to advanced systems.
        </p>
      </div>

      <CourseList initialCourses={courses} />
    </div>
  );
}
