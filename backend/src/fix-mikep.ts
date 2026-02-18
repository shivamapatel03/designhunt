import db from "./db";

// The console output showed "name": "mikep" so we will update by name
const result = db
  .prepare("UPDATE users SET is_pro = 1 WHERE name = ?")
  .run("mikep");
console.log(`Updated user 'mikep'. Changes: ${result.changes}`);
