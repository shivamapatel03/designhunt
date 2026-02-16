const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
const db = new Database(dbPath);

console.log('--- System Stats ---');
try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const activeUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE last_login IS NOT NULL').get();
    const trainers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "TUTOR"').get();

    console.log(`Total Users: ${totalUsers.count}`);
    console.log(`Active (Logged-in) Users: ${activeUsers.count}`);
    console.log(`Total Trainers: ${trainers.count}`);

    console.log('\n--- Recent Logins ---');
    const recentLogins = db.prepare('SELECT email, last_login, role FROM users WHERE last_login IS NOT NULL ORDER BY last_login DESC LIMIT 5').all();
    console.table(recentLogins);
} catch (e) {
    console.error('VERIFICATION FAILED:', e.message);
} finally {
    db.close();
}
