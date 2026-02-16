import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
console.log('Using DB at:', dbPath);
const db = new Database(dbPath);

function testQuery(q) {
    try {
        console.log(`Testing: ${q}`);
        const res = db.prepare(q).get();
        console.log('Success:', res);
    } catch (e) {
        console.error('Failed:', e.message);
    }
}

testQuery('SELECT COUNT(*) FROM users');
testQuery('SELECT last_login FROM users LIMIT 1');
testQuery('SELECT role FROM users LIMIT 1');

db.close();
