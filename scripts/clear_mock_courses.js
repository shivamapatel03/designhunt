const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'designhunt.db');
const db = new Database(dbPath);

const mockCourseIds = [
  'ui-fundamentals',
  'figma-mastery',
  'advanced-prototyping',
  'ux-research-101',
  'react-for-designers',
  'design-systems'
];

console.log('Clearing mock courses and related enrollments...');

const deleteEnrollmentsStmt = db.prepare('DELETE FROM enrollments WHERE course_id = ?');
const deleteCourseStmt = db.prepare('DELETE FROM courses WHERE id = ?');

let deletedCoursesCount = 0;
let deletedEnrollmentsCount = 0;

for (const id of mockCourseIds) {
    const enrollInfo = deleteEnrollmentsStmt.run(id);
    deletedEnrollmentsCount += enrollInfo.changes;
    
    const courseInfo = deleteCourseStmt.run(id);
    if (courseInfo.changes > 0) {
        deletedCoursesCount++;
        console.log(`Deleted mock course: ${id}`);
    }
}

console.log(`Successfully cleared ${deletedCoursesCount} mock courses and ${deletedEnrollmentsCount} enrollments.`);
db.close();
