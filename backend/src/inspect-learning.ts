import db from "./db";

async function inspect() {
  const topics = await db.all("SELECT * FROM learning_topics");
  console.log("Topics:", topics);

  const levels = await db.get("SELECT COUNT(*) as count FROM learning_levels WHERE topic_id = 'colour-theory-001'");
  console.log("Levels for Colour Theory:", levels);

  const sections = await db.get("SELECT COUNT(*) as count FROM learning_sections JOIN learning_levels ON learning_sections.level_id = learning_levels.id WHERE learning_levels.topic_id = 'colour-theory-001'");
  console.log("Sections for Colour Theory:", sections);
}

inspect().then(() => process.exit(0));
