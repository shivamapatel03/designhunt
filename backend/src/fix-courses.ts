import db from "./db";

const fixCourses = () => {
  console.log("Fixing course status...");
  db.prepare("UPDATE courses SET status = 'APPROVED'").run();
  console.log("All courses set to APPROVED.");
};

fixCourses();
