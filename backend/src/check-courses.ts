import db from "./db";

const checkCourses = () => {
  console.log("Checking courses...");
  const courses = db.prepare("SELECT id, title, status FROM courses").all();
  console.log("Found courses:", JSON.stringify(courses, null, 2));
};

checkCourses();
