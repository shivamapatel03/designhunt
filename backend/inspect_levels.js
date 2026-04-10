const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'designhunt_v2.db');
const db = new Database(dbPath);

const levels = db.prepare(`
  SELECT l.level_number, s.title as section_title, s.content_json
  FROM learning_levels l
  LEFT JOIN learning_sections s ON l.id = s.level_id
  WHERE s.[order] = 1 AND l.level_number IN (25, 26)
  ORDER BY l.level_number ASC
`).all();
console.log(JSON.stringify(levels, null, 2));
