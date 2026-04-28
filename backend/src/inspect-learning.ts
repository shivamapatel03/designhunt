import db from "./db";

async function inspect() {
  const topics = db.prepare("SELECT * FROM learning_topics").all();
  console.log("Topics:", topics);

  const levels = db.prepare("SELECT COUNT(*) as count FROM learning_levels WHERE topic_id = 'colour-theory-001'").get();
  console.log("Levels for Colour Theory:", levels);

  const sections = db.prepare("SELECT COUNT(*) as count FROM learning_sections JOIN learning_levels ON learning_sections.level_id = learning_levels.id WHERE learning_levels.topic_id = 'colour-theory-001'").get();
  console.log("Sections for Colour Theory:", sections);
}

inspect();
