import db from "./db";

const cleanupCourses = () => {
  console.log("Cleaning up courses...");

  // Get all courses
  const courses = db.prepare("SELECT id, title FROM courses").all() as {
    id: string;
    title: string;
  }[];

  if (courses.length <= 2) {
    console.log(`Only ${courses.length} courses found. No action needed.`);
    return;
  }

  // Keep the first 2
  const toKeep = courses.slice(0, 2).map((c) => c.id);
  const toDelete = courses.slice(2).map((c) => c.id);

  console.log(`Keeping courses: ${toKeep.join(", ")}`);
  console.log(`Deleting ${toDelete.length} courses...`);

  const deleteStmt = db.prepare("DELETE FROM courses WHERE id = ?");

  // Prepare dependency cleanup statements
  const deleteEnrollments = db.prepare(
    "DELETE FROM enrollments WHERE course_id = ?",
  );
  const deleteProgress = db.prepare(
    "DELETE FROM user_progress WHERE course_id = ?",
  );
  const getModules = db.prepare("SELECT id FROM modules WHERE course_id = ?");
  const deleteLessons = db.prepare("DELETE FROM lessons WHERE module_id = ?");
  const deleteModules = db.prepare("DELETE FROM modules WHERE course_id = ?");

  db.transaction(() => {
    toDelete.forEach((id) => {
      // Delete dependencies first
      deleteEnrollments.run(id);
      deleteProgress.run(id);

      const modules = getModules.all(id) as { id: string }[];
      modules.forEach((m) => {
        deleteLessons.run(m.id);
      });
      deleteModules.run(id);

      // Finally delete course
      deleteStmt.run(id);
    });
  })();

  console.log("Cleanup complete!");
};

cleanupCourses();
