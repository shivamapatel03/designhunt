import db from "./db";

async function cleanupCourses() {
  console.log("Cleaning up courses...");

  // Get all courses
  const courses = await db.all("SELECT id, title FROM courses") as {
    id: string;
    title: string;
  }[];

  if (courses.length <= 2) {
    console.log(`Only ${courses.length} courses found. No action needed.`);
    return;
  }

  // Keep the first 2
  const toDelete = courses.slice(2).map((c) => c.id);

  console.log(`Deleting ${toDelete.length} courses...`);

  for (const id of toDelete) {
    // Delete dependencies first
    await db.run("DELETE FROM enrollments WHERE course_id = $1", [id]);
    await db.run("DELETE FROM user_progress WHERE course_id = $1", [id]);

    const modules = await db.all("SELECT id FROM modules WHERE course_id = $1", [id]) as { id: string }[];
    for (const m of modules) {
      await db.run("DELETE FROM lessons WHERE module_id = $1", [m.id]);
    }
    await db.run("DELETE FROM modules WHERE course_id = $1", [id]);

    // Finally delete course
    await db.run("DELETE FROM courses WHERE id = $1", [id]);
  }

  console.log("Cleanup complete!");
}

cleanupCourses().then(() => process.exit(0));
